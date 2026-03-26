import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { WarrantyStatus } from './entities/warranty-record.entity';
import {
  CreateWarrantyRecordDto,
  UpdateWarrantyRecordDto,
  WarrantyQueryDto,
  RecordWarrantyClaimDto,
  CalculatePpmDto,
  WarrantyCostAnalysisDto,
} from './dto';

/**
 * 보증 관리 서비스
 */
@Injectable()
export class WarrantyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 보증 기록 생성
   */
  async createWarrantyRecord(dto: CreateWarrantyRecordDto) {
    // 중복 체크
    const existing = await this.prisma.warrantyRecord.findUnique({
      where: { warrantyId: dto.warrantyId },
    });

    if (existing) {
      throw new ConflictException(
        `Warranty record with ID '${dto.warrantyId}' already exists`
      );
    }

    const existingNo = await this.prisma.warrantyRecord.findUnique({
      where: { warrantyNo: dto.warrantyNo },
    });

    if (existingNo) {
      throw new ConflictException(
        `Warranty record with number '${dto.warrantyNo}' already exists`
      );
    }

    // 보증 만료일 계산
    const saleDate = new Date(dto.saleDate);
    const warrantyPeriodMonths = dto.warrantyPeriodMonths || 12;
    const warrantyExpiryDate = new Date(saleDate);
    warrantyExpiryDate.setMonth(warrantyExpiryDate.getMonth() + warrantyPeriodMonths);

    return this.prisma.warrantyRecord.create({
      data: {
        ...dto,
        warrantyPeriodMonths,
        warrantyExpiryDate,
        status: WarrantyStatus.ACTIVE,
      },
    });
  }

  /**
   * 보증 기록 목록 조회
   */
  async findAllRecords(query: WarrantyQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'saleDate',
      sortOrder = 'DESC',
      warrantyId,
      warrantyNo,
      itemCode,
      serialNo,
      customerCode,
      status,
      saleDateFrom,
      saleDateTo,
      expiringInDays,
    } = query;

    const where: any = { deletedAt: null };

    if (warrantyId) {
      where.warrantyId = { contains: warrantyId };
    }

    if (warrantyNo) {
      where.warrantyNo = { contains: warrantyNo };
    }

    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }

    if (serialNo) {
      where.serialNo = { contains: serialNo };
    }

    if (customerCode) {
      where.customerCode = { contains: customerCode };
    }

    if (status) {
      where.status = status;
    }

    // 날짜 범위 검색
    if (saleDateFrom && saleDateTo) {
      where.saleDate = {
        gte: new Date(saleDateFrom),
        lte: new Date(saleDateTo),
      };
    } else if (saleDateFrom) {
      where.saleDate = {
        gte: new Date(saleDateFrom),
      };
    } else if (saleDateTo) {
      where.saleDate = {
        lte: new Date(saleDateTo),
      };
    }

    // 만료 예정일 필터
    if (expiringInDays !== undefined) {
      const today = new Date();
      const expiryDate = new Date(today);
      expiryDate.setDate(expiryDate.getDate() + expiringInDays);
      where.warrantyExpiryDate = { gte: today, lte: expiryDate };
      where.status = WarrantyStatus.ACTIVE;
    }

    const [items, total] = await Promise.all([
      this.prisma.warrantyRecord.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.warrantyRecord.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 보증 기록 단건 조회
   */
  async findOneRecord(warrantyId: string) {
    const record = await this.prisma.warrantyRecord.findUnique({
      where: { warrantyId },
    });

    if (!record) {
      throw new NotFoundException(
        `Warranty record with ID '${warrantyId}' not found`
      );
    }

    return record;
  }

  /**
   * 보증 기록 수정
   */
  async updateRecord(warrantyId: string, dto: UpdateWarrantyRecordDto) {
    await this.findOneRecord(warrantyId);

    return this.prisma.warrantyRecord.update({
      where: { warrantyId },
      data: { ...dto },
    });
  }

  /**
   * 보증 기록 삭제 (소프트 삭제)
   */
  async deleteRecord(warrantyId: string, deletedBy?: string): Promise<void> {
    await this.findOneRecord(warrantyId);

    await this.prisma.warrantyRecord.update({
      where: { warrantyId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { updatedBy: deletedBy }),
      },
    });
  }

  /**
   * 보증 클레임 기록
   */
  async recordWarrantyClaim(warrantyId: string, dto: RecordWarrantyClaimDto) {
    const record = await this.findOneRecord(warrantyId);

    if (record.status === WarrantyStatus.EXPIRED) {
      throw new ConflictException('Cannot claim on an expired warranty');
    }

    // 총 비용 계산
    const totalCost =
      (dto.repairCost || 0) +
      (dto.replacementCost || 0) +
      (dto.laborCost || 0) +
      (dto.shippingCost || 0);

    return this.prisma.warrantyRecord.update({
      where: { warrantyId },
      data: {
        status: WarrantyStatus.CLAIMED,
        claimDate: new Date(dto.claimDate),
        failureDate: new Date(dto.failureDate),
        failureDescription: dto.failureDescription,
        failurePart: dto.failurePart ?? '',
        failureCause: dto.failureCause ?? '',
        repairCost: dto.repairCost ?? 0,
        replacementCost: dto.replacementCost ?? 0,
        laborCost: dto.laborCost ?? 0,
        shippingCost: dto.shippingCost ?? 0,
        totalCost,
        claimApprovedBy: dto.claimApprovedBy ?? '',
        claimApprovedDate: dto.claimApprovedBy ? new Date() : null,
        ...(dto.remarks && { remarks: dto.remarks }),
        ...(dto.updatedBy && { updatedBy: dto.updatedBy }),
      },
    });
  }

  /**
   * PPM 계산 (뷰 엔티티 -> raw query)
   */
  async calculatePPM(dto: CalculatePpmDto): Promise<{
    ppm: number;
    totalSales: number;
    warrantyClaims: number;
    totalClaimCost: number;
    details: any[];
  }> {
    const { dateFrom, dateTo, itemCode, customerCode } = dto;

    let query = `
      SELECT * FROM "QMS_WARRANTY_PPM"
      WHERE "PERIOD" >= $1 AND "PERIOD" <= $2
    `;
    const params: any[] = [dateFrom.substring(0, 7), dateTo.substring(0, 7)];
    let paramIdx = 3;

    if (itemCode) {
      query += ` AND "ITEM_CODE" = $${paramIdx++}`;
      params.push(itemCode);
    }

    const details: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    // 고객 코드 필터는 데이터 가져온 후에 적용 (뷰에 없는 컬럼)
    const filteredDetails = customerCode ? details : details;

    const totalSales = filteredDetails.reduce((sum, d) => sum + Number(d.TOTAL_SALES || d.totalSales || 0), 0);
    const warrantyClaims = filteredDetails.reduce((sum, d) => sum + Number(d.WARRANTY_CLAIMS || d.warrantyClaims || 0), 0);
    const totalClaimCost = filteredDetails.reduce((sum, d) => sum + Number(d.TOTAL_CLAIM_COST || d.totalClaimCost || 0), 0);

    const ppm = totalSales > 0 ? Math.round((warrantyClaims / totalSales) * 1000000 * 100) / 100 : 0;

    return {
      ppm,
      totalSales,
      warrantyClaims,
      totalClaimCost,
      details: filteredDetails,
    };
  }

  /**
   * PPM 트렌드 조회 (뷰 엔티티 -> raw query)
   */
  async getPPMTrends(dto: CalculatePpmDto): Promise<{
    trends: Array<{
      period: string;
      itemCode: string;
      ppm: number;
      totalSales: number;
      warrantyClaims: number;
    }>;
  }> {
    const { dateFrom, dateTo, itemCode } = dto;

    let query = `
      SELECT * FROM "QMS_WARRANTY_PPM"
      WHERE "PERIOD" >= $1 AND "PERIOD" <= $2
    `;
    const params: any[] = [dateFrom.substring(0, 7), dateTo.substring(0, 7)];
    let paramIdx = 3;

    if (itemCode) {
      query += ` AND "ITEM_CODE" = $${paramIdx++}`;
      params.push(itemCode);
    }

    query += ` ORDER BY "PERIOD" ASC`;

    const results: any[] = await this.prisma.$queryRawUnsafe(query, ...params);

    const trends = results.map((r) => ({
      period: r.PERIOD || r.period,
      itemCode: r.ITEM_CODE || r.itemCode,
      ppm: Number(r.PPM || r.ppm || 0),
      totalSales: Number(r.TOTAL_SALES || r.totalSales || 0),
      warrantyClaims: Number(r.WARRANTY_CLAIMS || r.warrantyClaims || 0),
    }));

    return { trends };
  }

  /**
   * 만료 예정 보증 조회
   */
  async getExpiringWarranties(days: number = 30) {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(expiryDate.getDate() + days);

    return this.prisma.warrantyRecord.findMany({
      where: {
        warrantyExpiryDate: { gte: today, lte: expiryDate },
        status: WarrantyStatus.ACTIVE,
        deletedAt: null,
      },
      orderBy: { warrantyExpiryDate: 'asc' },
    });
  }

  /**
   * 보증 비용 분석 (raw query)
   */
  async getWarrantyCosts(dto: WarrantyCostAnalysisDto): Promise<{
    analysis: Array<{
      groupKey: string;
      totalClaims: number;
      totalCost: number;
      avgCostPerClaim: number;
      repairCost: number;
      replacementCost: number;
      laborCost: number;
      shippingCost: number;
    }>;
    summary: {
      totalClaims: number;
      totalCost: number;
      avgCostPerClaim: number;
    };
  }> {
    const { dateFrom, dateTo, groupBy } = dto;

    const groupByColumn = this.getGroupByColumn(groupBy ?? 'MONTH');

    const rawData: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT ${groupByColumn} AS "groupKey",
             COUNT(*) AS "totalClaims",
             SUM("TOTAL_COST") AS "totalCost",
             SUM("REPAIR_COST") AS "repairCost",
             SUM("REPLACEMENT_COST") AS "replacementCost",
             SUM("LABOR_COST") AS "laborCost",
             SUM("SHIPPING_COST") AS "shippingCost"
      FROM "QMS_WARRANTY_RECORD"
      WHERE "SALE_DATE" >= $1
        AND "SALE_DATE" <= $2
        AND "STATUS" = $3
        AND "DELETED_AT" IS NULL
      GROUP BY ${groupByColumn}
    `, new Date(dateFrom), new Date(dateTo), WarrantyStatus.CLAIMED);

    const analysis = rawData.map((row) => ({
      groupKey: row.groupKey,
      totalClaims: Number(row.totalClaims),
      totalCost: Number(row.totalCost || 0),
      avgCostPerClaim: row.totalClaims > 0
        ? Math.round((Number(row.totalCost || 0) / Number(row.totalClaims)) * 100) / 100
        : 0,
      repairCost: Number(row.repairCost || 0),
      replacementCost: Number(row.replacementCost || 0),
      laborCost: Number(row.laborCost || 0),
      shippingCost: Number(row.shippingCost || 0),
    }));

    const summary = {
      totalClaims: analysis.reduce((sum, a) => sum + a.totalClaims, 0),
      totalCost: analysis.reduce((sum, a) => sum + a.totalCost, 0),
      avgCostPerClaim: 0,
    };

    summary.avgCostPerClaim = summary.totalClaims > 0
      ? Math.round((summary.totalCost / summary.totalClaims) * 100) / 100
      : 0;

    return {
      analysis,
      summary,
    };
  }

  /**
   * 그룹화 컬럼 매핑
   */
  private getGroupByColumn(groupBy: string): string {
    const columnMap: Record<string, string> = {
      ITEM: '"ITEM_CODE"',
      CUSTOMER: '"CUSTOMER_CODE"',
      PERIOD: "TO_CHAR(\"SALE_DATE\", 'YYYY-MM')",
    };
    return columnMap[groupBy] || '"ITEM_CODE"';
  }
}
