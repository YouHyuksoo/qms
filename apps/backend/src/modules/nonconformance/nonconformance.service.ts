import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  NcrStatus,
  DefectType,
  NcrSource,
} from './entities/ncr.entity';
import { ReviewStatus } from './entities/mrb-review.entity';
import {
  CreateNcrDto,
  UpdateNcrDto,
  CreateMrbReviewDto,
  ExecuteDispositionDto,
  NcrQueryDto,
} from './dto';

/**
 * 부적합 관리 서비스
 */
@Injectable()
export class NonconformanceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * NCR 생성
   */
  async createNcr(dto: CreateNcrDto) {
    // 중복 체크
    const existing = await this.prisma.ncr.findUnique({
      where: { ncrNo: dto.ncrNo },
    });

    if (existing) {
      throw new ConflictException(
        `NCR with number '${dto.ncrNo}' already exists`
      );
    }

    return this.prisma.ncr.create({
      data: {
        ...dto,
        status: NcrStatus.DRAFT,
      },
    });
  }

  /**
   * NCR 목록 조회
   */
  async findAllNcrs(query: NcrQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'occurrenceDate',
      sortOrder = 'DESC',
      ncrNo,
      title,
      lotNo,
      itemCode,
      itemName,
      status,
      defectType,
      source,
      reportedBy,
      assignedTo,
      occurrenceDateFrom,
      occurrenceDateTo,
    } = query;

    const where: any = { deletedAt: null };

    if (ncrNo) {
      where.ncrNo = { contains: ncrNo };
    }

    if (title) {
      where.title = { contains: title };
    }

    if (lotNo) {
      where.lotNo = { contains: lotNo };
    }

    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }

    if (itemName) {
      where.itemName = { contains: itemName };
    }

    if (status) {
      where.status = status;
    }

    if (defectType) {
      where.defectType = defectType;
    }

    if (source) {
      where.source = source;
    }

    if (reportedBy) {
      where.reportedBy = { contains: reportedBy };
    }

    if (assignedTo) {
      where.assignedTo = { contains: assignedTo };
    }

    // 날짜 범위 검색
    if (occurrenceDateFrom && occurrenceDateTo) {
      where.occurrenceDate = {
        gte: new Date(occurrenceDateFrom),
        lte: new Date(occurrenceDateTo),
      };
    } else if (occurrenceDateFrom) {
      where.occurrenceDate = {
        gte: new Date(occurrenceDateFrom),
      };
    } else if (occurrenceDateTo) {
      where.occurrenceDate = {
        lte: new Date(occurrenceDateTo),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.ncr.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ncr.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * NCR 단건 조회 (MRB 심의 포함)
   */
  async findOneNcr(ncrNo: string) {
    const ncr = await this.prisma.ncr.findUnique({
      where: { ncrNo },
      include: { mrbReviews: true },
    });

    if (!ncr) {
      throw new NotFoundException(`NCR with number '${ncrNo}' not found`);
    }

    return ncr;
  }

  /**
   * NCR 수정
   */
  async updateNcr(ncrNo: string, dto: UpdateNcrDto) {
    const ncr = await this.findOneNcr(ncrNo);

    // 종결된 NCR은 수정 불가
    if (ncr.status === NcrStatus.COMPLETED || ncr.status === NcrStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot update completed or cancelled NCR'
      );
    }

    return this.prisma.ncr.update({
      where: { ncrNo },
      data: { ...dto },
    });
  }

  /**
   * NCR 삭제 (소프트 삭제)
   */
  async deleteNcr(ncrNo: string, deletedBy?: string): Promise<void> {
    await this.findOneNcr(ncrNo);

    await this.prisma.ncr.update({
      where: { ncrNo },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { updatedBy: deletedBy }),
      },
    });
  }

  /**
   * MRB 심의 생성
   */
  async createMrbReview(dto: CreateMrbReviewDto) {
    // NCR 존재 여부 확인
    const ncr = await this.prisma.ncr.findUnique({
      where: { ncrNo: dto.ncrNo },
    });

    if (!ncr) {
      throw new NotFoundException(
        `NCR with number '${dto.ncrNo}' not found`
      );
    }

    // 심의 ID 중복 체크
    const existing = await this.prisma.mrbReview.findUnique({
      where: { reviewId: dto.reviewId },
    });

    if (existing) {
      throw new ConflictException(
        `MRB review with ID '${dto.reviewId}' already exists`
      );
    }

    // NCR 상태 업데이트
    if (ncr.status === NcrStatus.DRAFT) {
      await this.prisma.ncr.update({
        where: { ncrNo: dto.ncrNo },
        data: { status: NcrStatus.UNDER_REVIEW },
      });
    }

    return this.prisma.mrbReview.create({
      data: { ...dto },
    });
  }

  /**
   * MRB 심의 목록 조회 (NCR별)
   */
  async findMrbReviewsByNcr(ncrNo: string) {
    await this.findOneNcr(ncrNo);
    return this.prisma.mrbReview.findMany({
      where: { ncrNo, deletedAt: null },
      orderBy: { reviewDate: 'desc' },
    });
  }

  /**
   * MRB 심의 승인
   */
  async approveMrbReview(reviewId: string, approvedBy: string) {
    const review = await this.prisma.mrbReview.findUnique({
      where: { reviewId },
    });

    if (!review) {
      throw new NotFoundException(
        `MRB review with ID '${reviewId}' not found`
      );
    }

    if (review.status !== ReviewStatus.PENDING) {
      throw new BadRequestException('Review is not in pending status');
    }

    const savedReview = await this.prisma.mrbReview.update({
      where: { reviewId },
      data: {
        approvedBy,
        approvedDate: new Date(),
        status: ReviewStatus.APPROVED,
      },
    });

    // NCR 상태 업데이트
    await this.updateNcrStatusForDisposition(review.ncrNo);

    return savedReview;
  }

  /**
   * MRB 심의 반려
   */
  async rejectMrbReview(reviewId: string, reason?: string) {
    const review = await this.prisma.mrbReview.findUnique({
      where: { reviewId },
    });

    if (!review) {
      throw new NotFoundException(
        `MRB review with ID '${reviewId}' not found`
      );
    }

    if (review.status !== ReviewStatus.PENDING) {
      throw new BadRequestException('Review is not in pending status');
    }

    return this.prisma.mrbReview.update({
      where: { reviewId },
      data: {
        status: ReviewStatus.REJECTED,
        ...(reason && { remarks: reason }),
      },
    });
  }

  /**
   * 처분 실행
   */
  async executeDisposition(reviewId: string, dto: ExecuteDispositionDto) {
    const review = await this.prisma.mrbReview.findUnique({
      where: { reviewId },
    });

    if (!review) {
      throw new NotFoundException(
        `MRB review with ID '${reviewId}' not found`
      );
    }

    if (review.status !== ReviewStatus.APPROVED) {
      throw new BadRequestException('Review must be approved before execution');
    }

    const savedReview = await this.prisma.mrbReview.update({
      where: { reviewId },
      data: {
        executionResult: dto.executionResult,
        executedBy: (dto.executedBy || dto.updatedBy) ?? '',
        executionDate: dto.executionDate
          ? new Date(dto.executionDate)
          : new Date(),
      },
    });

    // NCR 상태 업데이트
    const ncr = await this.findOneNcr(review.ncrNo);
    if (ncr.status !== NcrStatus.COMPLETED) {
      await this.prisma.ncr.update({
        where: { ncrNo: review.ncrNo },
        data: { status: NcrStatus.IN_PROGRESS },
      });
    }

    return savedReview;
  }

  /**
   * NCR 종결
   */
  async closeNcr(
    ncrNo: string,
    closedBy: string,
    options?: {
      rootCause?: string;
      correctiveAction?: string;
      preventiveAction?: string;
    }
  ) {
    const ncr = await this.findOneNcr(ncrNo);

    if (ncr.status === NcrStatus.COMPLETED || ncr.status === NcrStatus.CANCELLED) {
      throw new BadRequestException('NCR is already closed');
    }

    // 모든 MRB 심의가 완료되었는지 확인
    const pendingReviews = await this.prisma.mrbReview.count({
      where: { ncrNo, status: ReviewStatus.PENDING, deletedAt: null },
    });

    if (pendingReviews > 0) {
      throw new BadRequestException(
        'Cannot close NCR with pending MRB reviews'
      );
    }

    return this.prisma.ncr.update({
      where: { ncrNo },
      data: {
        status: NcrStatus.COMPLETED,
        closedBy,
        closedDate: new Date(),
        ...(options?.rootCause && { rootCause: options.rootCause }),
        ...(options?.correctiveAction && { correctiveAction: options.correctiveAction }),
        ...(options?.preventiveAction && { preventiveAction: options.preventiveAction }),
      },
    });
  }

  /** NCR 통계 조회 */
  async getStatistics(options?: { dateFrom?: string; dateTo?: string; source?: NcrSource }) {
    const where: any = { deletedAt: null };
    if (options?.dateFrom && options?.dateTo) {
      where.occurrenceDate = { gte: new Date(options.dateFrom), lte: new Date(options.dateTo) };
    }
    if (options?.source) where.source = options.source;

    const ncrs = await this.prisma.ncr.findMany({ where, select: { status: true, defectType: true, source: true } });
    const byStatus = {} as Record<NcrStatus, number>;
    const byDefectType = {} as Record<DefectType, number>;
    const bySource = {} as Record<NcrSource, number>;
    Object.values(NcrStatus).forEach((s) => { byStatus[s] = 0; });
    Object.values(DefectType).forEach((t) => { byDefectType[t] = 0; });
    Object.values(NcrSource).forEach((s) => { bySource[s] = 0; });

    ncrs.forEach((ncr: any) => {
      byStatus[ncr.status as NcrStatus]++;
      if (ncr.defectType) byDefectType[ncr.defectType as DefectType]++;
      if (ncr.source) bySource[ncr.source as NcrSource]++;
    });
    const openNcrs = ncrs.filter((n: any) => n.status !== NcrStatus.COMPLETED && n.status !== NcrStatus.CANCELLED).length;
    return { totalNcrs: ncrs.length, byStatus, byDefectType, bySource, openNcrs, closedNcrs: ncrs.length - openNcrs };
  }

  /** NCR 상태 업데이트 (처분 결정 시) */
  private async updateNcrStatusForDisposition(ncrNo: string): Promise<void> {
    const ncr = await this.findOneNcr(ncrNo);
    const approvedReviews = await this.prisma.mrbReview.count({ where: { ncrNo, status: ReviewStatus.APPROVED, deletedAt: null } });
    if (approvedReviews > 0 && ncr.status === NcrStatus.UNDER_REVIEW) {
      await this.prisma.ncr.update({ where: { ncrNo }, data: { status: NcrStatus.DISPOSITION_DECIDED } });
    }
  }

  /** 검사 실패로부터 NCR 생성 */
  async createNcrFromInspection(params: {
    ncrNo: string; lotNo: string; itemCode?: string; itemName?: string;
    defectQty?: number; description?: string; createdBy?: string;
  }) {
    return this.createNcr({
      ncrNo: params.ncrNo,
      title: `Inspection Failure - Lot ${params.lotNo}`,
      description: params.description || `Inspection failed for lot ${params.lotNo}`,
      lotNo: params.lotNo, itemCode: params.itemCode, itemName: params.itemName,
      defectQty: params.defectQty || 0, defectType: DefectType.MAJOR,
      source: NcrSource.INSPECTION, reportedDate: new Date().toISOString().split('T')[0],
      createdBy: params.createdBy,
    });
  }
}
