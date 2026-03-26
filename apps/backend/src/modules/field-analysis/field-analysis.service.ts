import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TraceabilityStatus } from './entities/field-failure.entity';
import {
  CreateFieldFailureDto,
  TraceProductionDto,
  TraceabilityResult,
  AnalyzePatternDto,
  CommonFactorsDto,
  VerifyCountermeasureDto,
  CountermeasureVerificationResult,
  FieldFailureQueryDto,
  UpdateCountermeasureDto,
} from './dto';

/**
 * 필드 불량 분석 서비스
 */
@Injectable()
export class FieldAnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 필드 불량 생성
   */
  async createFieldFailure(dto: CreateFieldFailureDto) {
    // 중복 체크
    const existing = await this.prisma.fieldFailure.findUnique({
      where: { failureId: dto.failureId },
    });

    if (existing) {
      throw new ConflictException(
        `Field failure with ID '${dto.failureId}' already exists`
      );
    }

    const existingNo = await this.prisma.fieldFailure.findUnique({
      where: { failureNo: dto.failureNo },
    });

    if (existingNo) {
      throw new ConflictException(
        `Field failure with number '${dto.failureNo}' already exists`
      );
    }

    return this.prisma.fieldFailure.create({
      data: {
        ...dto,
        traceabilityStatus: TraceabilityStatus.UNTRACED,
      },
    });
  }

  /**
   * 필드 불량 목록 조회
   */
  async findAllFailures(query: FieldFailureQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'failureDate',
      sortOrder = 'DESC',
      failureId,
      failureNo,
      complaintId,
      itemCode,
      lotNo,
      failureMode,
      traceabilityStatus,
      productionLine,
      equipmentId,
      operatorId,
      failureDateFrom,
      failureDateTo,
    } = query;

    const where: any = { deletedAt: null };

    if (failureId) {
      where.failureId = { contains: failureId };
    }

    if (failureNo) {
      where.failureNo = { contains: failureNo };
    }

    if (complaintId) {
      where.complaintId = complaintId;
    }

    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }

    if (lotNo) {
      where.lotNo = { contains: lotNo };
    }

    if (failureMode) {
      where.failureMode = { contains: failureMode };
    }

    if (traceabilityStatus) {
      where.traceabilityStatus = traceabilityStatus;
    }

    if (productionLine) {
      where.productionLine = { contains: productionLine };
    }

    if (equipmentId) {
      where.equipmentId = { contains: equipmentId };
    }

    if (operatorId) {
      where.operatorId = { contains: operatorId };
    }

    // 날짜 범위 검색
    if (failureDateFrom && failureDateTo) {
      where.failureDate = {
        gte: new Date(failureDateFrom),
        lte: new Date(failureDateTo),
      };
    } else if (failureDateFrom) {
      where.failureDate = {
        gte: new Date(failureDateFrom),
      };
    } else if (failureDateTo) {
      where.failureDate = {
        lte: new Date(failureDateTo),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.fieldFailure.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.fieldFailure.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 필드 불량 단건 조회
   */
  async findOneFailure(failureId: string) {
    const failure = await this.prisma.fieldFailure.findUnique({
      where: { failureId },
    });

    if (!failure) {
      throw new NotFoundException(
        `Field failure with ID '${failureId}' not found`
      );
    }

    return failure;
  }

  /**
   * 필드 불량 수정
   */
  async updateFailure(failureId: string, dto: Partial<CreateFieldFailureDto>) {
    await this.findOneFailure(failureId);

    return this.prisma.fieldFailure.update({
      where: { failureId },
      data: { ...dto },
    });
  }

  /**
   * 필드 불량 삭제 (소프트 삭제)
   */
  async deleteFailure(failureId: string, deletedBy?: string): Promise<void> {
    await this.findOneFailure(failureId);

    await this.prisma.fieldFailure.update({
      where: { failureId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { updatedBy: deletedBy }),
      },
    });
  }

  /** 생산 이력 추적 */
  async traceProductionHistory(dto: TraceProductionDto): Promise<TraceabilityResult> {
    const failures = await this.prisma.fieldFailure.findMany({ where: { lotNo: dto.lotNo, deletedAt: null } });
    if (failures.length === 0) throw new NotFoundException(`No traceability information found for lot '${dto.lotNo}'`);

    const f = failures[0];
    return {
      lotNo: f.lotNo ?? '', itemCode: f.itemCode, itemName: f.itemName ?? '',
      productionDate: f.productionDate?.toISOString(), productionLine: f.productionLine ?? '',
      equipmentId: f.equipmentId ?? '', equipmentName: f.equipmentName ?? '',
      operatorId: f.operatorId ?? '', operatorName: f.operatorName ?? '',
      inspectionLotNo: f.inspectionLotNo ?? '', rawMaterialLot: f.rawMaterialLot ?? '',
      supplierCode: f.supplierCode ?? '', supplierName: f.supplierName ?? '',
      relatedFailures: failures.map((r: any) => ({ failureId: r.failureId, failureDate: r.failureDate.toISOString(), failureMode: r.failureMode })),
    };
  }

  /** 불량 패턴 분석 (뷰 엔티티 -> raw query) */
  async analyzeFailurePatterns(dto: AnalyzePatternDto) {
    const { dateFrom, dateTo, itemCode, failureMode, productionLine, equipmentId } = dto;
    let query = `SELECT * FROM "QMS_FAILURE_PATTERN" WHERE "FAILURE_MONTH" >= $1 AND "FAILURE_MONTH" <= $2`;
    const params: any[] = [dateFrom.substring(0, 7), dateTo.substring(0, 7)];
    let idx = 3;
    if (itemCode) { query += ` AND "ITEM_CODE" = $${idx++}`; params.push(itemCode); }
    if (failureMode) { query += ` AND "FAILURE_MODE" LIKE $${idx++}`; params.push(`%${failureMode}%`); }
    if (productionLine) { query += ` AND "PRODUCTION_LINE" = $${idx++}`; params.push(productionLine); }
    if (equipmentId) { query += ` AND "EQUIPMENT_ID" = $${idx++}`; params.push(equipmentId); }
    query += ` ORDER BY "OCCURRENCE_COUNT" DESC`;
    const patterns: any[] = await this.prisma.$queryRawUnsafe(query, ...params);
    const top = patterns[0] || {};
    return {
      patterns,
      summary: {
        totalPatterns: patterns.length,
        topFailureMode: top.FAILURE_MODE || top.failureMode || '',
        topAffectedItem: top.ITEM_CODE || top.itemCode || '',
        topProductionLine: top.PRODUCTION_LINE || top.productionLine || '',
      },
    };
  }

  /** 공통 요인 분석 */
  async getCommonFactors(dto: CommonFactorsDto) {
    const { dateFrom, dateTo, itemCode, failureMode } = dto;
    const where: any = { failureDate: { gte: new Date(dateFrom), lte: new Date(dateTo) }, deletedAt: null };
    if (itemCode) where.itemCode = itemCode;
    if (failureMode) where.failureMode = failureMode;

    const failures = await this.prisma.fieldFailure.findMany({ where });
    const factorMap = new Map<string, Map<string, string[]>>();
    const factorKeys = ['LOT_NO', 'PRODUCTION_LINE', 'EQUIPMENT_ID', 'OPERATOR_ID', 'RAW_MATERIAL_LOT', 'SUPPLIER_CODE', 'FAILURE_MODE'] as const;
    const fieldKeys = ['lotNo', 'productionLine', 'equipmentId', 'operatorId', 'rawMaterialLot', 'supplierCode', 'failureMode'] as const;
    for (const failure of failures) {
      factorKeys.forEach((key, i) => this.addToFactorMap(factorMap, key, failure[fieldKeys[i]], failure.failureId));
    }

    const commonFactors: Array<{ factorType: string; factorValue: string; occurrenceCount: number; affectedFailures: string[] }> = [];
    for (const [factorType, values] of factorMap) {
      for (const [factorValue, failureIds] of values) {
        if (failureIds.length >= 2) commonFactors.push({ factorType, factorValue, occurrenceCount: failureIds.length, affectedFailures: failureIds });
      }
    }
    commonFactors.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    return { commonFactors: commonFactors.slice(0, 10), recommendations: this.generateRecommendations(commonFactors) };
  }

  /**
   * 대책 효과 검증
   */
  async verifyCountermeasureEffectiveness(
    dto: VerifyCountermeasureDto
  ): Promise<CountermeasureVerificationResult> {
    const { failureMode, countermeasureDate, comparisonPeriodDays, itemCode } = dto;

    const countermeasureDateObj = new Date(countermeasureDate);

    // 대책 시행 전/후 기간 설정
    const beforeEnd = new Date(countermeasureDateObj);
    beforeEnd.setDate(beforeEnd.getDate() - 1);
    const beforeStart = new Date(beforeEnd);
    beforeStart.setDate(beforeStart.getDate() - comparisonPeriodDays);

    const afterStart = new Date(countermeasureDateObj);
    const afterEnd = new Date(afterStart);
    afterEnd.setDate(afterEnd.getDate() + comparisonPeriodDays);

    // 대책 시행 전 불량 수
    const beforeWhere: any = {
      failureMode,
      failureDate: { gte: beforeStart, lte: beforeEnd },
      deletedAt: null,
    };
    if (itemCode) beforeWhere.itemCode = itemCode;
    const beforeCount = await this.prisma.fieldFailure.count({ where: beforeWhere });

    // 대책 시행 후 불량 수
    const afterWhere: any = {
      failureMode,
      failureDate: { gte: afterStart, lte: afterEnd },
      deletedAt: null,
    };
    if (itemCode) afterWhere.itemCode = itemCode;
    const afterCount = await this.prisma.fieldFailure.count({ where: afterWhere });

    // 월평균 계산
    const monthsInPeriod = comparisonPeriodDays / 30;
    const beforeAvg = beforeCount / monthsInPeriod;
    const afterAvg = afterCount / monthsInPeriod;

    const absoluteReduction = beforeAvg - afterAvg;
    const percentageReduction = beforeAvg > 0
      ? Math.round((absoluteReduction / beforeAvg) * 100 * 100) / 100
      : 0;

    return {
      failureMode,
      countermeasureDate,
      beforePeriod: {
        startDate: beforeStart.toISOString().split('T')[0],
        endDate: beforeEnd.toISOString().split('T')[0],
        failureCount: beforeCount,
        avgFailuresPerMonth: Math.round(beforeAvg * 100) / 100,
      },
      afterPeriod: {
        startDate: afterStart.toISOString().split('T')[0],
        endDate: afterEnd.toISOString().split('T')[0],
        failureCount: afterCount,
        avgFailuresPerMonth: Math.round(afterAvg * 100) / 100,
      },
      improvement: {
        absoluteReduction: Math.round(absoluteReduction * 100) / 100,
        percentageReduction,
        isEffective: percentageReduction >= 50,
      },
    };
  }

  /** 추적성 보고서 생성 */
  async generateTraceabilityReport(failureId: string) {
    const failure = await this.findOneFailure(failureId);
    if (!failure.lotNo) throw new NotFoundException('No lot number associated with this failure');
    const traceability = await this.traceProductionHistory({ lotNo: failure.lotNo });
    const relatedFailures = await this.prisma.fieldFailure.findMany({
      where: {
        OR: [{ lotNo: failure.lotNo }, { equipmentId: failure.equipmentId }, { operatorId: failure.operatorId }, { rawMaterialLot: failure.rawMaterialLot }],
        failureId: { not: failureId }, deletedAt: null,
      },
    });
    const recommendations: string[] = [];
    if (failure.equipmentId) recommendations.push(`장비 ${failure.equipmentId}의 점검 및 유지보수를 실시하세요.`);
    if (failure.operatorId) recommendations.push(`작업자 ${failure.operatorId}에 대한 재교육을 검토하세요.`);
    if (failure.rawMaterialLot) recommendations.push(`원자재 로트 ${failure.rawMaterialLot}의 품질을 검증하세요.`);
    return { failure, traceability, relatedFailures, recommendations };
  }

  /** 대책 업데이트 */
  async updateCountermeasure(failureId: string, dto: UpdateCountermeasureDto) {
    await this.findOneFailure(failureId);
    return this.prisma.fieldFailure.update({ where: { failureId }, data: { ...dto } });
  }

  /** 요인 맵에 추가 */
  private addToFactorMap(map: Map<string, Map<string, string[]>>, type: string, value: string | null, id: string): void {
    if (!value) return;
    if (!map.has(type)) map.set(type, new Map());
    const valueMap = map.get(type)!;
    if (!valueMap.has(value)) valueMap.set(value, []);
    valueMap.get(value)!.push(id);
  }

  /** 추천사항 생성 */
  private generateRecommendations(factors: Array<{ factorType: string; factorValue: string; occurrenceCount: number }>): string[] {
    const msgMap: Record<string, string> = {
      LOT_NO: '에 대한 특별 관리가 필요합니다.',
      EQUIPMENT_ID: '의 점검 및 보수를 권장합니다.',
      OPERATOR_ID: '에 대한 재교육을 검토하세요.',
      RAW_MATERIAL_LOT: '의 공급사를 평가하세요.',
      PRODUCTION_LINE: '의 공정 관리를 강화하세요.',
    };
    const prefixMap: Record<string, string> = {
      LOT_NO: '로트 ', EQUIPMENT_ID: '장비 ', OPERATOR_ID: '작업자 ',
      RAW_MATERIAL_LOT: '원자재 로트 ', PRODUCTION_LINE: '생산라인 ',
    };
    return factors.slice(0, 3)
      .filter((f) => msgMap[f.factorType])
      .map((f) => `${prefixMap[f.factorType]}${f.factorValue}${msgMap[f.factorType]}`);
  }
}
