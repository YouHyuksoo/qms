import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { PpapStatus, PpapSubmissionLevel } from './entities/ppap-submission.entity';
import { PpapDocumentType, DocumentStatus } from './entities/ppap-document.entity';
import { ApprovalAction } from './entities/ppap-approval-history.entity';
import {
  CreatePpapSubmissionDto, UpdatePpapSubmissionDto,
  SubmitDocumentDto, ApproveDocumentDto,
  ApproveSubmissionDto, RejectSubmissionDto,
  ResubmitSubmissionDto, InterimApproveSubmissionDto,
  PpapQueryDto,
} from './dto';
import { PPAP_LEVEL_DOCS } from './ppap-level-docs';

/**
 * PPAP 서비스
 *
 * PPAP 제출, 문서, 승인 이력을 관리합니다.
 */
@Injectable()
export class PpapService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Submission CRUD ====================

  /** PPAP 제출 생성 */
  async createSubmission(dto: CreatePpapSubmissionDto) {
    const existing = await this.prisma.ppapSubmission.findFirst({ where: { submissionId: dto.submissionId } });
    if (existing) throw new ConflictException(`Submission with ID ${dto.submissionId} already exists`);

    const saved = await this.prisma.ppapSubmission.create({
      data: {
        ...dto,
        submissionDate: dto.submissionDate ? new Date(dto.submissionDate) : undefined,
        approvalDeadline: dto.approvalDeadline ? new Date(dto.approvalDeadline) : undefined,
      },
    });
    await this.createDefaultDocuments(saved.submissionId, saved.submissionLevel as PpapSubmissionLevel);
    return this.findOneSubmission(saved.submissionId);
  }

  /** 기본 문서 생성 (레벨별) */
  private async createDefaultDocuments(submissionId: string, level: PpapSubmissionLevel): Promise<void> {
    const allDocs = PPAP_LEVEL_DOCS(level);
    await this.prisma.ppapDocument.createMany({
      data: allDocs.map(doc => ({
        documentId: `${submissionId}-${doc.documentType}`,
        submissionId,
        documentType: doc.documentType,
        documentName: doc.documentName,
        isRequired: doc.isRequired,
        status: DocumentStatus.NOT_SUBMITTED,
      })),
    });
  }

  /** PPAP 제출 목록 조회 */
  async findAllSubmissions(query: PpapQueryDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
    const where: Record<string, unknown> = { deletedAt: null };

    if (query.submissionId) where.submissionId = { contains: query.submissionId };
    if (query.projectNo) where.projectNo = query.projectNo;
    if (query.submissionNo) where.submissionNo = { contains: query.submissionNo };
    if (query.submissionLevel !== undefined) where.submissionLevel = query.submissionLevel;
    if (query.customerCode) where.customerCode = query.customerCode;
    if (query.status) where.status = query.status;
    if (query.pswNo) where.pswNo = { contains: query.pswNo };

    const [items, total] = await Promise.all([
      this.prisma.ppapSubmission.findMany({
        where, orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit, take: limit,
      }),
      this.prisma.ppapSubmission.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  /** PPAP 제출 단건 조회 */
  async findOneSubmission(submissionId: string) {
    const submission = await this.prisma.ppapSubmission.findFirst({
      where: { submissionId, deletedAt: null },
      include: { documents: true, approvalHistory: true },
    });
    if (!submission) throw new NotFoundException(`Submission with ID ${submissionId} not found`);
    return submission;
  }

  /** PPAP 제출 수정 */
  async updateSubmission(submissionId: string, dto: UpdatePpapSubmissionDto) {
    const submission = await this.findOneSubmission(submissionId);
    if (submission.status === PpapStatus.APPROVED) throw new BadRequestException('Cannot update approved submission');
    await this.prisma.ppapSubmission.update({
      where: { id: submission.id },
      data: { ...dto, approvalDeadline: dto.approvalDeadline ? new Date(dto.approvalDeadline) : undefined },
    });
    return this.findOneSubmission(submissionId);
  }

  /** PPAP 제출 삭제 (소프트) */
  async deleteSubmission(submissionId: string, deletedBy?: string): Promise<void> {
    const submission = await this.findOneSubmission(submissionId);
    await this.prisma.ppapSubmission.update({ where: { id: submission.id }, data: { deletedAt: new Date() } });
  }

  // ==================== Document Methods ====================

  /** 문서 제출 */
  async submitDocument(submissionId: string, dto: SubmitDocumentDto) {
    const submission = await this.findOneSubmission(submissionId);
    if (submission.status === PpapStatus.APPROVED) {
      throw new BadRequestException('Cannot submit documents to approved submission');
    }
    const document = await this.prisma.ppapDocument.findFirst({
      where: { documentId: dto.documentId, submissionId, deletedAt: null },
    });
    const submitData = {
      isSubmitted: true,
      submittedDate: dto.submittedDate ? new Date(dto.submittedDate) : new Date(),
      documentPath: dto.documentPath,
      status: DocumentStatus.SUBMITTED,
    };

    if (document) {
      return this.prisma.ppapDocument.update({
        where: { id: document.id },
        data: { ...submitData, version: dto.version, remarks: dto.remarks, updatedBy: dto.createdBy },
      });
    }
    return this.prisma.ppapDocument.create({
      data: { ...dto, submissionId, ...submitData },
    });
  }

  /** 문서 승인 */
  async approveDocument(submissionId: string, documentId: string, dto: ApproveDocumentDto) {
    const doc = await this.prisma.ppapDocument.findFirst({ where: { documentId, submissionId, deletedAt: null } });
    if (!doc) throw new NotFoundException(`Document with ID ${documentId} not found`);
    if (!doc.isSubmitted) throw new BadRequestException('Cannot approve un-submitted document');
    return this.prisma.ppapDocument.update({
      where: { id: doc.id },
      data: { status: DocumentStatus.APPROVED, reviewedBy: dto.reviewedBy, reviewDate: new Date(), remarks: dto.remarks, updatedBy: dto.updatedBy },
    });
  }

  // ==================== Approval Methods ====================

  /** PPAP 승인 */
  async approveSubmission(submissionId: string, dto: ApproveSubmissionDto) {
    const submission = await this.findOneSubmission(submissionId);
    const required = submission.documents?.filter((d: any) => d.isRequired && !d.deletedAt) || [];
    const approved = required.filter((d: any) => d.status === DocumentStatus.APPROVED);
    if (required.length > 0 && approved.length < required.length) {
      throw new BadRequestException(`All required documents must be approved. Approved: ${approved.length}/${required.length}`);
    }
    const prev = submission.status;
    await this.prisma.ppapSubmission.update({
      where: { id: submission.id },
      data: { status: PpapStatus.APPROVED, reviewedBy: dto.reviewedBy, reviewDate: dto.reviewDate ? new Date(dto.reviewDate) : new Date(), remarks: dto.remarks, updatedBy: dto.updatedBy },
    });
    await this.addHistory(submissionId, ApprovalAction.APPROVED, dto.reviewedBy, prev, PpapStatus.APPROVED, dto.remarks);
    return this.findOneSubmission(submissionId);
  }

  /** PPAP 반려 */
  async rejectSubmission(submissionId: string, dto: RejectSubmissionDto) {
    const submission = await this.findOneSubmission(submissionId);
    const prev = submission.status;
    await this.prisma.ppapSubmission.update({
      where: { id: submission.id },
      data: { status: PpapStatus.REJECTED, reviewedBy: dto.reviewedBy, reviewDate: new Date(), rejectionReason: dto.reason, remarks: dto.remarks, updatedBy: dto.updatedBy },
    });
    await this.addHistory(submissionId, ApprovalAction.REJECTED, dto.reviewedBy, prev, PpapStatus.REJECTED, dto.reason);
    return this.findOneSubmission(submissionId);
  }

  /** PPAP 재제출 */
  async resubmitSubmission(submissionId: string, dto: ResubmitSubmissionDto) {
    const submission = await this.findOneSubmission(submissionId);
    if (submission.status !== PpapStatus.REJECTED && submission.status !== PpapStatus.INTERIM_APPROVED) {
      throw new BadRequestException('Only rejected or interim approved submissions can be resubmitted');
    }
    const prev = submission.status;
    await this.prisma.ppapSubmission.update({
      where: { id: submission.id },
      data: { status: PpapStatus.SUBMITTED, resubmissionDate: dto.resubmissionDate ? new Date(dto.resubmissionDate) : new Date(), resubmissionCount: submission.resubmissionCount + 1, remarks: dto.remarks, updatedBy: dto.createdBy },
    });
    await this.addHistory(submissionId, ApprovalAction.RESUBMITTED, dto.resubmittedBy, prev, PpapStatus.SUBMITTED, dto.improvements);
    return this.findOneSubmission(submissionId);
  }

  /** PPAP 임시 승인 */
  async interimApproveSubmission(submissionId: string, dto: InterimApproveSubmissionDto) {
    const submission = await this.findOneSubmission(submissionId);
    const prev = submission.status;
    await this.prisma.ppapSubmission.update({
      where: { id: submission.id },
      data: { status: PpapStatus.INTERIM_APPROVED, reviewedBy: dto.reviewedBy, reviewDate: new Date(), remarks: `${dto.conditionReason}. ${dto.remarks || ''}`, updatedBy: dto.updatedBy },
    });
    await this.addHistory(submissionId, ApprovalAction.INTERIM_APPROVED, dto.reviewedBy, prev, PpapStatus.INTERIM_APPROVED, dto.conditionReason);
    return this.findOneSubmission(submissionId);
  }

  /** 승인 이력 추가 (내부) */
  private async addHistory(submissionId: string, action: ApprovalAction, actionBy: string, prev: string, next: string, reason?: string) {
    return this.prisma.ppapApprovalHistory.create({
      data: { historyId: `HIST-${submissionId}-${Date.now()}`, submissionId, action, actionBy, actionDate: new Date(), previousStatus: prev, newStatus: next, reason },
    });
  }

  // ==================== Analysis Methods ====================

  /** 승인 이력 조회 */
  async getApprovalHistory(submissionId: string) {
    const submission = await this.findOneSubmission(submissionId);
    return submission.approvalHistory || [];
  }

  /** 재제출 필요 여부 확인 */
  async checkResubmissionNeeded(submissionId: string) {
    const submission = await this.findOneSubmission(submissionId);
    const reasons: string[] = [];
    let daysSinceRejection: number | null = null;

    if (submission.status === PpapStatus.REJECTED) {
      reasons.push('Submission has been rejected');
      const hist = submission.approvalHistory?.find((h: any) => h.action === ApprovalAction.REJECTED);
      if (hist) {
        daysSinceRejection = Math.floor((Date.now() - new Date(hist.actionDate).getTime()) / 86400000);
      }
    }
    if (submission.status === PpapStatus.INTERIM_APPROVED) reasons.push('Submission is interim approved and needs final approval');
    if (submission.approvalDeadline && submission.status === PpapStatus.SUBMITTED && new Date() > new Date(submission.approvalDeadline)) {
      reasons.push('Approval deadline has passed');
    }
    return { needsResubmission: reasons.length > 0, reasons, daysSinceRejection };
  }

  /** PPAP 통계 조회 */
  async getStatistics() {
    const submissions = await this.prisma.ppapSubmission.findMany({ where: { deletedAt: null } });
    const byStatus = Object.values(PpapStatus).reduce((a: Record<string, number>, s: string) => { a[s] = submissions.filter((x: any) => x.status === s).length; return a; }, {} as Record<string, number>);
    const byLevel = Object.values(PpapSubmissionLevel).reduce((a: Record<string, number>, l: string) => { a[l] = submissions.filter((x: any) => x.submissionLevel === l).length; return a; }, {} as Record<string, number>);
    const totalResub = submissions.reduce((s: number, x: any) => s + (x.resubmissionCount || 0), 0);

    return {
      totalSubmissions: submissions.length, byStatus, byLevel,
      approvedCount: byStatus[PpapStatus.APPROVED] || 0,
      rejectedCount: byStatus[PpapStatus.REJECTED] || 0,
      pendingCount: (byStatus[PpapStatus.SUBMITTED] || 0) + (byStatus[PpapStatus.UNDER_REVIEW] || 0),
      averageResubmissionCount: submissions.length > 0 ? totalResub / submissions.length : 0,
    };
  }
}
