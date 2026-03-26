import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { InspectionResult, SampleStatus } from './entities/initial-sample.entity';
import {
  CreateInitialSampleDto,
  UpdateInitialSampleDto,
  AddInspectionItemDto,
  UpdateInspectionItemDto,
  InitialSampleQueryDto,
} from './dto';

/**
 * 초기 샘플 서비스
 *
 * 초기 샘플(Initial Sample) 등록 및 검사 결과를 관리합니다.
 */
@Injectable()
export class InitialSampleService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Sample Methods ====================

  /**
   * 초기 샘플 등록
   */
  async createSample(dto: CreateInitialSampleDto) {
    const existing = await this.prisma.initialSample.findFirst({
      where: { sampleId: dto.sampleId },
    });
    if (existing) {
      throw new ConflictException(`Sample with ID ${dto.sampleId} already exists`);
    }

    return this.prisma.initialSample.create({
      data: {
        ...dto,
        submissionDate: new Date(dto.submissionDate),
        status: SampleStatus.REGISTERED,
        inspectionResult: InspectionResult.PENDING,
      },
    });
  }

  /**
   * 초기 샘플 목록 조회
   */
  async findAllSamples(query: InitialSampleQueryDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const where: Record<string, unknown> = { deletedAt: null };

    if (query.sampleId) {
      where.sampleId = { contains: query.sampleId };
    }
    if (query.projectNo) {
      where.projectNo = query.projectNo;
    }
    if (query.sampleNo) {
      where.sampleNo = { contains: query.sampleNo };
    }
    if (query.itemCode) {
      where.itemCode = query.itemCode;
    }
    if (query.inspectionResult) {
      where.inspectionResult = query.inspectionResult;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.inspector) {
      where.inspector = query.inspector;
    }
    if (query.approvedBy) {
      where.approvedBy = query.approvedBy;
    }
    if (query.submissionDateFrom || query.submissionDateTo) {
      where.submissionDate = {
        ...(query.submissionDateFrom ? { gte: new Date(query.submissionDateFrom) } : {}),
        ...(query.submissionDateTo ? { lte: new Date(query.submissionDateTo) } : {}),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.initialSample.findMany({
        where,
        include: { inspectionItems: true },
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.initialSample.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 초기 샘플 단건 조회
   */
  async findOneSample(sampleId: string) {
    const sample = await this.prisma.initialSample.findFirst({
      where: { sampleId, deletedAt: null },
      include: { inspectionItems: true },
    });

    if (!sample) {
      throw new NotFoundException(`Sample with ID ${sampleId} not found`);
    }

    return sample;
  }

  /**
   * 초기 샘플 수정
   */
  async updateSample(sampleId: string, dto: UpdateInitialSampleDto) {
    const sample = await this.findOneSample(sampleId);

    if (sample.status === SampleStatus.APPROVED || sample.status === SampleStatus.REJECTED) {
      throw new BadRequestException('Cannot update approved or rejected sample');
    }

    await this.prisma.initialSample.update({
      where: { id: sample.id },
      data: {
        ...dto,
        inspectionDate: dto.inspectionDate ? new Date(dto.inspectionDate) : undefined,
      },
    });

    return this.findOneSample(sampleId);
  }

  /**
   * 초기 샘플 삭제 (소프트)
   */
  async deleteSample(sampleId: string, deletedBy?: string): Promise<void> {
    const sample = await this.findOneSample(sampleId);
    await this.prisma.initialSample.update({
      where: { id: sample.id },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== Inspection Item Methods ====================

  /**
   * 검사 항목 추가
   */
  async addInspectionItem(sampleId: string, dto: AddInspectionItemDto) {
    const sample = await this.findOneSample(sampleId);

    if (sample.status === SampleStatus.APPROVED || sample.status === SampleStatus.REJECTED) {
      throw new BadRequestException('Cannot add inspection items to approved or rejected sample');
    }

    const existing = await this.prisma.sampleInspectionItem.findFirst({
      where: { itemId: dto.itemId },
    });
    if (existing) {
      throw new ConflictException(`Inspection item with ID ${dto.itemId} already exists`);
    }

    let judgment = dto.judgment || InspectionResult.PENDING;
    if (dto.measuredValue !== undefined && dto.specMin !== undefined && dto.specMax !== undefined) {
      judgment =
        dto.measuredValue >= dto.specMin && dto.measuredValue <= dto.specMax
          ? InspectionResult.PASS
          : InspectionResult.FAIL;
    }

    const saved = await this.prisma.sampleInspectionItem.create({
      data: {
        ...dto,
        sampleId,
        judgment,
      },
    });

    await this.prisma.initialSample.update({
      where: { id: sample.id },
      data: { status: SampleStatus.INSPECTING },
    });

    return saved;
  }

  /**
   * 검사 항목 수정
   */
  async updateInspectionItem(itemId: string, dto: UpdateInspectionItemDto) {
    const item = await this.prisma.sampleInspectionItem.findFirst({
      where: { itemId, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException(`Inspection item with ID ${itemId} not found`);
    }

    let judgment = dto.judgment;
    if (dto.measuredValue !== undefined && item.specMin !== undefined && item.specMax !== undefined) {
      judgment =
        dto.measuredValue >= item.specMin && dto.measuredValue <= item.specMax
          ? InspectionResult.PASS
          : InspectionResult.FAIL;
    }

    return this.prisma.sampleInspectionItem.update({
      where: { id: item.id },
      data: {
        ...dto,
        judgment,
      },
    });
  }

  /**
   * 검사 항목 목록 조회 (샘플별)
   */
  async findInspectionItemsBySample(sampleId: string) {
    const sample = await this.findOneSample(sampleId);
    return sample.inspectionItems || [];
  }

  // ==================== Judgment Methods ====================

  /**
   * 샘플 최종 판정
   */
  async judgeSample(
    sampleId: string,
    judgment: InspectionResult,
    options?: {
      approvedBy?: string;
      rejectionReason?: string;
      remarks?: string;
      updatedBy?: string;
    },
  ) {
    const sample = await this.findOneSample(sampleId);

    const items = sample.inspectionItems || [];
    if (items.length === 0) {
      throw new BadRequestException('No inspection items found for this sample');
    }

    const pendingItems = items.filter((item: any) => item.judgment === InspectionResult.PENDING);
    if (pendingItems.length > 0) {
      throw new BadRequestException(`There are ${pendingItems.length} pending inspection items`);
    }

    let finalJudgment = judgment;
    if (!finalJudgment) {
      const hasFail = items.some((item: any) => item.judgment === InspectionResult.FAIL);
      finalJudgment = hasFail ? InspectionResult.FAIL : InspectionResult.PASS;
    }

    if (finalJudgment === InspectionResult.FAIL && !options?.rejectionReason) {
      throw new BadRequestException('Rejection reason is required for failed samples');
    }

    const status =
      finalJudgment === InspectionResult.PASS
        ? SampleStatus.APPROVED
        : finalJudgment === InspectionResult.FAIL
          ? SampleStatus.REJECTED
          : SampleStatus.COMPLETED;

    await this.prisma.initialSample.update({
      where: { id: sample.id },
      data: {
        inspectionResult: finalJudgment,
        status,
        approvedBy: finalJudgment === InspectionResult.PASS ? options?.approvedBy : undefined,
        approvalDate: finalJudgment === InspectionResult.PASS ? new Date() : undefined,
        rejectionReason: finalJudgment === InspectionResult.FAIL ? options?.rejectionReason : undefined,
        remarks: options?.remarks,
        updatedBy: options?.updatedBy,
      },
    });

    return this.findOneSample(sampleId);
  }

  /**
   * 샘플 승인
   */
  async approveSample(sampleId: string, approvedBy: string, remarks?: string) {
    return this.judgeSample(sampleId, InspectionResult.PASS, { approvedBy, remarks });
  }

  /**
   * 샘플 반려
   */
  async rejectSample(sampleId: string, reason: string, remarks?: string) {
    return this.judgeSample(sampleId, InspectionResult.FAIL, { rejectionReason: reason, remarks });
  }

  // ==================== Analysis Methods ====================

  /**
   * 통계 조회
   */
  async getStatistics() {
    const samples = await this.prisma.initialSample.findMany({
      where: { deletedAt: null },
    });

    const byStatus = Object.values(SampleStatus).reduce(
      (acc: Record<string, number>, status: string) => {
        acc[status] = samples.filter((s: any) => s.status === status).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byResult = Object.values(InspectionResult).reduce(
      (acc: Record<string, number>, result: string) => {
        acc[result] = samples.filter((s: any) => s.inspectionResult === result).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const completedSamples = samples.filter(
      (s: any) => s.inspectionResult === InspectionResult.PASS || s.inspectionResult === InspectionResult.FAIL,
    );

    const approvalRate =
      completedSamples.length > 0 ? (byResult[InspectionResult.PASS] / completedSamples.length) * 100 : 0;

    return {
      totalSamples: samples.length,
      byStatus,
      byResult,
      approvalRate: Math.round(approvalRate * 100) / 100,
      pendingCount: byResult[InspectionResult.PENDING] || 0,
    };
  }
}
