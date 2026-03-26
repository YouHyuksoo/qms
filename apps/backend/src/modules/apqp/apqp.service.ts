import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ApqpProjectStatus } from './entities/apqp-project.entity';
import { ApqpPhaseStatus } from './entities/apqp-phase.entity';
import { DeliverableStatus } from './entities/gate-deliverable.entity';
import {
  CreateApqpProjectDto,
  UpdateApqpProjectDto,
  CreatePhaseDto,
  UpdatePhaseDto,
  SubmitDeliverableDto,
  ApproveDeliverableDto,
  CreateDeliverableDto,
  ApprovePhaseDto,
  RejectPhaseDto,
  ApqpQueryDto,
  PhaseQueryDto,
} from './dto';

/**
 * APQP 서비스
 *
 * APQP 프로젝트, 단계, 산출물의 CRUD 및 승인 처리를 담당합니다.
 * 통계/분석은 ApqpAnalysisService에서 처리합니다.
 */
@Injectable()
export class ApqpService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Project Methods ====================

  /** APQP 프로젝트 생성 */
  async createProject(dto: CreateApqpProjectDto) {
    const existing = await this.prisma.apqpProject.findFirst({
      where: { projectNo: dto.projectNo },
    });
    if (existing) {
      throw new ConflictException(`Project with number ${dto.projectNo} already exists`);
    }

    return this.prisma.apqpProject.create({
      data: {
        ...dto,
        plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : undefined,
        plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : undefined,
        actualStartDate: dto.status === ApqpProjectStatus.PLANNING ? new Date() : undefined,
      },
    });
  }

  /** APQP 프로젝트 목록 조회 */
  async findAllProjects(query: ApqpQueryDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
    const where: Record<string, unknown> = { deletedAt: null };

    if (query.projectNo) where.projectNo = { contains: query.projectNo };
    if (query.projectName) where.projectName = { contains: query.projectName };
    if (query.customerCode) where.customerCode = query.customerCode;
    if (query.itemCode) where.itemCode = query.itemCode;
    if (query.status) where.status = query.status;
    if (query.projectManager) where.projectManager = query.projectManager;

    const [items, total] = await Promise.all([
      this.prisma.apqpProject.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.apqpProject.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /** APQP 프로젝트 단건 조회 */
  async findOneProject(projectNo: string) {
    const project = await this.prisma.apqpProject.findFirst({
      where: { projectNo, deletedAt: null },
      include: { phases: { include: { deliverables: true } } },
    });
    if (!project) {
      throw new NotFoundException(`Project with number ${projectNo} not found`);
    }
    return project;
  }

  /** APQP 프로젝트 수정 */
  async updateProject(projectNo: string, dto: UpdateApqpProjectDto) {
    const project = await this.findOneProject(projectNo);
    if (project.status === ApqpProjectStatus.CANCELLED) {
      throw new BadRequestException('Cannot update cancelled project');
    }

    await this.prisma.apqpProject.update({
      where: { id: project.id },
      data: {
        ...dto,
        plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : undefined,
        plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : undefined,
        actualStartDate: dto.actualStartDate ? new Date(dto.actualStartDate) : undefined,
        actualEndDate: dto.actualEndDate ? new Date(dto.actualEndDate) : undefined,
      },
    });
    return this.findOneProject(projectNo);
  }

  /** APQP 프로젝트 삭제 (소프트) */
  async deleteProject(projectNo: string, deletedBy?: string): Promise<void> {
    const project = await this.findOneProject(projectNo);
    await this.prisma.apqpProject.update({
      where: { id: project.id },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== Phase Methods ====================

  /** APQP 단계 생성 */
  async createPhase(projectNo: string, dto: CreatePhaseDto) {
    await this.findOneProject(projectNo);
    const existing = await this.prisma.apqpPhase.findFirst({ where: { phaseId: dto.phaseId } });
    if (existing) {
      throw new ConflictException(`Phase with ID ${dto.phaseId} already exists`);
    }
    return this.prisma.apqpPhase.create({
      data: {
        ...dto,
        projectNo,
        plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : undefined,
        plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : undefined,
      },
    });
  }

  /** APQP 단계 수정 */
  async updatePhase(phaseId: string, dto: UpdatePhaseDto) {
    const phase = await this.prisma.apqpPhase.findFirst({
      where: { phaseId, deletedAt: null },
      include: { deliverables: true },
    });
    if (!phase) throw new NotFoundException(`Phase with ID ${phaseId} not found`);

    await this.prisma.apqpPhase.update({
      where: { id: phase.id },
      data: {
        ...dto,
        plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : undefined,
        plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : undefined,
        actualStartDate: dto.actualStartDate ? new Date(dto.actualStartDate) : undefined,
        actualEndDate: dto.actualEndDate ? new Date(dto.actualEndDate) : undefined,
      },
    });
    return this.prisma.apqpPhase.findFirst({ where: { phaseId }, include: { deliverables: true } });
  }

  /** APQP 단계 목록 조회 (프로젝트별) */
  async findPhasesByProject(projectNo: string, query: PhaseQueryDto) {
    const { page = 1, limit = 20 } = query;
    const where: Record<string, unknown> = { projectNo, deletedAt: null };
    if (query.phaseType) where.phaseType = query.phaseType;
    if (query.status) where.status = query.status;

    const [items, total] = await Promise.all([
      this.prisma.apqpPhase.findMany({
        where,
        orderBy: { sequenceNo: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.apqpPhase.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  // ==================== Deliverable Methods ====================

  /** 산출물 생성 */
  async createDeliverable(phaseId: string, dto: CreateDeliverableDto) {
    const phase = await this.prisma.apqpPhase.findFirst({ where: { phaseId, deletedAt: null } });
    if (!phase) throw new NotFoundException(`Phase with ID ${phaseId} not found`);
    return this.prisma.gateDeliverable.create({ data: { ...dto, phaseId } });
  }

  /** 산출물 제출 */
  async submitDeliverable(phaseId: string, deliverableId: string, dto: SubmitDeliverableDto) {
    const deliverable = await this.prisma.gateDeliverable.findFirst({
      where: { deliverableId, phaseId, deletedAt: null },
    });
    if (!deliverable) throw new NotFoundException(`Deliverable with ID ${deliverableId} not found`);

    return this.prisma.gateDeliverable.update({
      where: { id: deliverable.id },
      data: {
        isSubmitted: true,
        submittedBy: dto.submittedBy,
        submittedDate: dto.submittedDate ? new Date(dto.submittedDate) : new Date(),
        documentPath: dto.documentPath,
        remarks: dto.remarks,
        status: DeliverableStatus.SUBMITTED,
        updatedBy: dto.updatedBy,
      },
    });
  }

  /** 산출물 승인 */
  async approveDeliverable(phaseId: string, deliverableId: string, dto: ApproveDeliverableDto) {
    const deliverable = await this.prisma.gateDeliverable.findFirst({
      where: { deliverableId, phaseId, deletedAt: null },
    });
    if (!deliverable) throw new NotFoundException(`Deliverable with ID ${deliverableId} not found`);
    if (!deliverable.isSubmitted) throw new BadRequestException('Cannot approve un-submitted deliverable');

    return this.prisma.gateDeliverable.update({
      where: { id: deliverable.id },
      data: {
        approvedBy: dto.approvedBy,
        approvedDate: new Date(),
        remarks: dto.remarks,
        status: DeliverableStatus.APPROVED,
        updatedBy: dto.updatedBy,
      },
    });
  }

  // ==================== Approval Methods ====================

  /** 단계 승인 */
  async approvePhase(phaseId: string, dto: ApprovePhaseDto) {
    const phase = await this.prisma.apqpPhase.findFirst({
      where: { phaseId, deletedAt: null },
      include: { deliverables: true },
    });
    if (!phase) throw new NotFoundException(`Phase with ID ${phaseId} not found`);

    const required = phase.deliverables?.filter((d: any) => d.isRequired && !d.deletedAt) || [];
    const approved = required.filter((d: any) => d.status === DeliverableStatus.APPROVED);
    if (required.length > 0 && approved.length < required.length) {
      throw new BadRequestException(
        `All required deliverables must be approved. Approved: ${approved.length}/${required.length}`,
      );
    }

    await this.prisma.apqpPhase.update({
      where: { id: phase.id },
      data: {
        status: ApqpPhaseStatus.APPROVED,
        approvedBy: dto.approvedBy,
        approvedDate: dto.approvedDate ? new Date(dto.approvedDate) : new Date(),
        actualEndDate: new Date(),
        remarks: dto.remarks,
        updatedBy: dto.updatedBy,
      },
    });
    return this.prisma.apqpPhase.findFirst({ where: { phaseId }, include: { deliverables: true } });
  }

  /** 단계 반려 */
  async rejectPhase(phaseId: string, dto: RejectPhaseDto) {
    const phase = await this.prisma.apqpPhase.findFirst({
      where: { phaseId, deletedAt: null },
      include: { deliverables: true },
    });
    if (!phase) throw new NotFoundException(`Phase with ID ${phaseId} not found`);

    await this.prisma.apqpPhase.update({
      where: { id: phase.id },
      data: {
        status: ApqpPhaseStatus.REJECTED,
        rejectionReason: dto.reason,
        remarks: dto.remarks,
        updatedBy: dto.updatedBy,
      },
    });
    return this.prisma.apqpPhase.findFirst({ where: { phaseId }, include: { deliverables: true } });
  }

  // ==================== Analysis Methods ====================

  /** 타겟 vs 실적 비교 */
  async compareTargetVsActual(projectNo: string) {
    const project = await this.findOneProject(projectNo);
    const phases = project.phases || [];
    const comparison = phases.map((phase: any) => ({
      phaseId: phase.phaseId,
      phaseName: phase.phaseName,
      phaseType: phase.phaseType,
      targetQualityLevel: phase.targetQualityLevel,
      actualQualityLevel: phase.actualQualityLevel,
      variance: phase.targetQualityLevel && phase.actualQualityLevel
        ? phase.actualQualityLevel - phase.targetQualityLevel : null,
      status: phase.status,
    }));

    const overallTarget = project.targetQualityLevel;
    const overallActual = project.actualQualityLevel;
    return {
      project, comparison, overallTarget, overallActual,
      overallVariance: overallTarget && overallActual ? overallActual - overallTarget : null,
    };
  }

  /** 프로젝트 타임라인 데이터 */
  async getProjectTimeline(projectNo: string) {
    const project = await this.findOneProject(projectNo);
    const timeline = (project.phases || []).map((phase: any) => {
      const pStart = phase.plannedStartDate ? new Date(phase.plannedStartDate).getTime() : 0;
      const pEnd = phase.plannedEndDate ? new Date(phase.plannedEndDate).getTime() : 0;
      const aStart = phase.actualStartDate ? new Date(phase.actualStartDate).getTime() : 0;
      const aEnd = phase.actualEndDate ? new Date(phase.actualEndDate).getTime() : 0;
      const ms = 1000 * 60 * 60 * 24;
      const planned = pStart && pEnd ? Math.ceil((pEnd - pStart) / ms) : null;
      const actual = aStart && aEnd ? Math.ceil((aEnd - aStart) / ms) : null;

      return {
        phaseId: phase.phaseId, phaseName: phase.phaseName, phaseType: phase.phaseType,
        plannedStart: phase.plannedStartDate, plannedEnd: phase.plannedEndDate,
        actualStart: phase.actualStartDate, actualEnd: phase.actualEndDate,
        duration: actual || planned,
        delay: planned && actual ? actual - planned : null,
        status: phase.status,
      };
    });
    return { project, timeline };
  }

  /** APQP 통계 조회 */
  async getStatistics() {
    const projects = await this.prisma.apqpProject.findMany({ where: { deletedAt: null } });
    const byStatus = Object.values(ApqpProjectStatus).reduce((acc: Record<string, number>, s: string) => {
      acc[s] = projects.filter((p: any) => p.status === s).length;
      return acc;
    }, {} as Record<string, number>);

    const now = new Date();
    return {
      totalProjects: projects.length,
      byStatus,
      activeProjects: projects.filter(
        (p: any) => p.status !== ApqpProjectStatus.COMPLETED && p.status !== ApqpProjectStatus.CANCELLED,
      ).length,
      completedProjects: byStatus[ApqpProjectStatus.COMPLETED] || 0,
      delayedProjects: projects.filter((p: any) =>
        p.plannedEndDate &&
        p.status !== ApqpProjectStatus.COMPLETED &&
        p.status !== ApqpProjectStatus.CANCELLED &&
        new Date(p.plannedEndDate) < now,
      ).length,
    };
  }
}
