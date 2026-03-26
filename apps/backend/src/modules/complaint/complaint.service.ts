import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ComplaintStatus } from './entities/customer-complaint.entity';
import {
  CreateComplaintDto,
  UpdateComplaintDto,
  ComplaintQueryDto,
  AnalyzeTrendsDto,
  AnalyzeResponseTimeDto,
  ResolveComplaintDto,
  CloseComplaintDto,
} from './dto';

/**
 * 클레임 관리 서비스
 */
@Injectable()
export class ComplaintService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 클레임 생성
   */
  async createComplaint(dto: CreateComplaintDto) {
    // 중복 체크
    const existing = await this.prisma.customerComplaint.findUnique({
      where: { complaintId: dto.complaintId },
    });

    if (existing) {
      throw new ConflictException(
        `Complaint with ID '${dto.complaintId}' already exists`
      );
    }

    const existingNo = await this.prisma.customerComplaint.findUnique({
      where: { complaintNo: dto.complaintNo },
    });

    if (existingNo) {
      throw new ConflictException(
        `Complaint with number '${dto.complaintNo}' already exists`
      );
    }

    return this.prisma.customerComplaint.create({
      data: {
        ...dto,
        status: ComplaintStatus.RECEIVED,
      },
    });
  }

  /**
   * 클레임 목록 조회
   */
  async findAllComplaints(query: ComplaintQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'receiptDate',
      sortOrder = 'DESC',
      complaintId,
      complaintNo,
      customerCode,
      itemCode,
      complaintType,
      severity,
      status,
      receiptDateFrom,
      receiptDateTo,
      assignedTo,
      lotNo,
    } = query;

    const where: any = { deletedAt: null };

    if (complaintId) {
      where.complaintId = { contains: complaintId };
    }

    if (complaintNo) {
      where.complaintNo = { contains: complaintNo };
    }

    if (customerCode) {
      where.customerCode = { contains: customerCode };
    }

    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }

    if (complaintType) {
      where.complaintType = complaintType;
    }

    if (severity) {
      where.severity = severity;
    }

    if (status) {
      where.status = status;
    }

    if (assignedTo) {
      where.assignedTo = { contains: assignedTo };
    }

    if (lotNo) {
      where.lotNo = { contains: lotNo };
    }

    // 날짜 범위 검색
    if (receiptDateFrom && receiptDateTo) {
      where.receiptDate = {
        gte: new Date(receiptDateFrom),
        lte: new Date(receiptDateTo),
      };
    } else if (receiptDateFrom) {
      where.receiptDate = {
        gte: new Date(receiptDateFrom),
      };
    } else if (receiptDateTo) {
      where.receiptDate = {
        lte: new Date(receiptDateTo),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.customerComplaint.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.customerComplaint.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 클레임 단건 조회
   */
  async findOneComplaint(complaintId: string) {
    const complaint = await this.prisma.customerComplaint.findUnique({
      where: { complaintId },
    });

    if (!complaint) {
      throw new NotFoundException(
        `Complaint with ID '${complaintId}' not found`
      );
    }

    return complaint;
  }

  /**
   * 클레임 수정
   */
  async updateComplaint(complaintId: string, dto: UpdateComplaintDto) {
    await this.findOneComplaint(complaintId);

    return this.prisma.customerComplaint.update({
      where: { complaintId },
      data: { ...dto },
    });
  }

  /**
   * 클레임 삭제 (소프트 삭제)
   */
  async deleteComplaint(complaintId: string, deletedBy?: string): Promise<void> {
    await this.findOneComplaint(complaintId);

    await this.prisma.customerComplaint.update({
      where: { complaintId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { updatedBy: deletedBy }),
      },
    });
  }

  /**
   * 클레임 트렌드 분석 (뷰 엔티티 -> raw query)
   */
  async analyzeTrends(dto: AnalyzeTrendsDto): Promise<{
    trends: any[];
    summary: {
      totalComplaints: number;
      totalDefectQty: number;
      avgResponseTime: number;
      avgSatisfaction: number;
    };
  }> {
    const { dateFrom, dateTo, customerCode, itemCode, complaintType, severity } = dto;

    let query = `
      SELECT * FROM "QMS_COMPLAINT_TREND"
      WHERE "PERIOD" >= $1 AND "PERIOD" <= $2
    `;
    const params: any[] = [dateFrom.substring(0, 7), dateTo.substring(0, 7)];
    let paramIdx = 3;

    if (customerCode) {
      query += ` AND "CUSTOMER_CODE" = $${paramIdx++}`;
      params.push(customerCode);
    }

    if (itemCode) {
      query += ` AND "ITEM_CODE" = $${paramIdx++}`;
      params.push(itemCode);
    }

    if (complaintType) {
      query += ` AND "COMPLAINT_TYPE" = $${paramIdx++}`;
      params.push(complaintType);
    }

    if (severity) {
      query += ` AND "SEVERITY" = $${paramIdx++}`;
      params.push(severity);
    }

    const trends: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    // 요약 통계 계산
    const totalComplaints = trends.reduce((sum, t) => sum + Number(t.COMPLAINT_COUNT || t.complaintCount || 0), 0);
    const totalDefectQty = trends.reduce((sum, t) => sum + Number(t.TOTAL_DEFECT_QTY || t.totalDefectQty || 0), 0);
    const avgResponseTime = trends.length > 0
      ? trends.reduce((sum, t) => sum + Number(t.AVG_RESPONSE_TIME || t.avgResponseTime || 0), 0) / trends.length
      : 0;
    const avgSatisfaction = trends.length > 0
      ? trends.reduce((sum, t) => sum + Number(t.AVG_SATISFACTION || t.avgSatisfaction || 0), 0) / trends.length
      : 0;

    return {
      trends,
      summary: {
        totalComplaints,
        totalDefectQty,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        avgSatisfaction: Math.round(avgSatisfaction * 100) / 100,
      },
    };
  }

  /**
   * 응답 시간 분석 (raw query)
   */
  async analyzeResponseTime(dto: AnalyzeResponseTimeDto): Promise<{
    analysis: Array<{
      groupKey: string;
      avgResponseTime: number;
      minResponseTime: number;
      maxResponseTime: number;
      complaintCount: number;
    }>;
    bottlenecks: Array<{
      groupKey: string;
      avgResponseTime: number;
      severity: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
  }> {
    const { dateFrom, dateTo, groupBy } = dto;

    const groupByColumn = this.getGroupByColumn(groupBy ?? 'MONTH');

    const rawData: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT ${groupByColumn} AS "groupKey",
             AVG("RESPONSE_TIME_HOURS") AS "avgResponseTime",
             MIN("RESPONSE_TIME_HOURS") AS "minResponseTime",
             MAX("RESPONSE_TIME_HOURS") AS "maxResponseTime",
             COUNT(*) AS "complaintCount"
      FROM "QMS_CUSTOMER_COMPLAINT"
      WHERE "RECEIPT_DATE" >= $1
        AND "RECEIPT_DATE" <= $2
        AND "RESPONSE_TIME_HOURS" IS NOT NULL
        AND "DELETED_AT" IS NULL
      GROUP BY ${groupByColumn}
    `, new Date(dateFrom), new Date(dateTo));

    const analysis = rawData.map((row) => ({
      groupKey: row.groupKey,
      avgResponseTime: Math.round(Number(row.avgResponseTime) * 100) / 100,
      minResponseTime: Number(row.minResponseTime),
      maxResponseTime: Number(row.maxResponseTime),
      complaintCount: Number(row.complaintCount),
    }));

    // 병목 식별 (평균 응답 시간이 24시간 이상인 경우)
    const bottlenecks = analysis
      .filter((a) => a.avgResponseTime > 24)
      .map((a) => ({
        groupKey: a.groupKey,
        avgResponseTime: a.avgResponseTime,
        severity: a.avgResponseTime > 72 ? 'HIGH' : a.avgResponseTime > 48 ? 'MEDIUM' : 'LOW' as 'HIGH' | 'MEDIUM' | 'LOW',
      }))
      .sort((a, b) => b.avgResponseTime - a.avgResponseTime);

    return {
      analysis,
      bottlenecks,
    };
  }

  /**
   * 클레임 해결
   */
  async resolveComplaint(complaintId: string, dto: ResolveComplaintDto) {
    const complaint = await this.findOneComplaint(complaintId);

    if (complaint.status === ComplaintStatus.CLOSED) {
      throw new ConflictException('Cannot resolve a closed complaint');
    }

    // 응답 시간 계산
    const receiptDate = new Date(complaint.receiptDate);
    const resolvedDate = new Date();
    const responseTimeHours = Math.round(
      (resolvedDate.getTime() - receiptDate.getTime()) / (1000 * 60 * 60)
    );

    return this.prisma.customerComplaint.update({
      where: { complaintId },
      data: {
        status: ComplaintStatus.RESOLVED,
        resolution: dto.resolution,
        resolvedDate,
        resolvedBy: dto.resolvedBy ?? '',
        responseTimeHours,
      },
    });
  }

  /**
   * 클레임 종결
   */
  async closeComplaint(complaintId: string, dto: CloseComplaintDto) {
    const complaint = await this.findOneComplaint(complaintId);

    if (complaint.status !== ComplaintStatus.RESOLVED) {
      throw new ConflictException('Only resolved complaints can be closed');
    }

    return this.prisma.customerComplaint.update({
      where: { complaintId },
      data: {
        status: ComplaintStatus.CLOSED,
        closedDate: new Date(),
        closedBy: dto.closedBy ?? '',
        ...(dto.satisfactionScore !== undefined && {
          satisfactionScore: dto.satisfactionScore,
        }),
      },
    });
  }

  /**
   * 그룹화 컬럼 매핑
   */
  private getGroupByColumn(groupBy: string): string {
    const columnMap: Record<string, string> = {
      CUSTOMER: '"CUSTOMER_CODE"',
      ITEM: '"ITEM_CODE"',
      TYPE: '"COMPLAINT_TYPE"',
      SEVERITY: '"SEVERITY"',
      ASSIGNED_TO: '"ASSIGNED_TO"',
    };
    return columnMap[groupBy] || '"SEVERITY"';
  }
}
