import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  InspectionType,
  InspectionJudgment,
  InspectionStatus,
} from './entities/inspection-lot.entity';
import { ResultJudgment } from './entities/inspection-result.entity';
import {
  CreateInspectionLotDto,
  UpdateInspectionLotDto,
  CreateInspectionResultDto,
  InspectionQueryDto,
} from './dto';

/**
 * 검사 관리 서비스
 */
@Injectable()
export class InspectionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 검사 로트 생성
   */
  async createLot(dto: CreateInspectionLotDto) {
    // 중복 체크
    const existing = await this.prisma.inspectionLot.findUnique({
      where: { lotNo: dto.lotNo },
    });

    if (existing) {
      throw new ConflictException(
        `Inspection lot with number '${dto.lotNo}' already exists`
      );
    }

    return this.prisma.inspectionLot.create({
      data: {
        ...dto,
        status: InspectionStatus.PENDING,
      },
    });
  }

  /**
   * 검사 로트 목록 조회
   */
  async findAll(query: InspectionQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'inspectionDate',
      sortOrder = 'DESC',
      lotNo,
      itemCode,
      itemName,
      inspectionType,
      inspectionDateFrom,
      inspectionDateTo,
      inspector,
      judgment,
      status,
      supplierCode,
      ncrNo,
    } = query;

    const where: any = { deletedAt: null };

    if (lotNo) {
      where.lotNo = { contains: lotNo };
    }

    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }

    if (itemName) {
      where.itemName = { contains: itemName };
    }

    if (inspectionType) {
      where.inspectionType = inspectionType;
    }

    if (inspector) {
      where.inspector = { contains: inspector };
    }

    if (judgment) {
      where.judgment = judgment;
    }

    if (status) {
      where.status = status;
    }

    if (supplierCode) {
      where.supplierCode = { contains: supplierCode };
    }

    if (ncrNo) {
      where.ncrNo = { contains: ncrNo };
    }

    // 날짜 범위 검색
    if (inspectionDateFrom && inspectionDateTo) {
      where.inspectionDate = {
        gte: new Date(inspectionDateFrom),
        lte: new Date(inspectionDateTo),
      };
    } else if (inspectionDateFrom) {
      where.inspectionDate = {
        gte: new Date(inspectionDateFrom),
      };
    } else if (inspectionDateTo) {
      where.inspectionDate = {
        lte: new Date(inspectionDateTo),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.inspectionLot.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.inspectionLot.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 검사 로트 단건 조회 (결과 포함)
   */
  async findOne(lotNo: string) {
    const lot = await this.prisma.inspectionLot.findUnique({
      where: { lotNo },
      include: { results: true },
    });

    if (!lot) {
      throw new NotFoundException(
        `Inspection lot with number '${lotNo}' not found`
      );
    }

    return lot;
  }

  /**
   * 검사 로트 수정
   */
  async updateLot(lotNo: string, dto: UpdateInspectionLotDto) {
    await this.findOne(lotNo);

    return this.prisma.inspectionLot.update({
      where: { lotNo },
      data: { ...dto },
    });
  }

  /**
   * 검사 로트 삭제 (소프트 삭제)
   */
  async deleteLot(lotNo: string, deletedBy?: string): Promise<void> {
    await this.findOne(lotNo);

    await this.prisma.inspectionLot.update({
      where: { lotNo },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { updatedBy: deletedBy }),
      },
    });
  }

  /**
   * 검사 결과 추가
   */
  async addResult(dto: CreateInspectionResultDto) {
    // 로트 존재 여부 확인
    const lot = await this.prisma.inspectionLot.findUnique({
      where: { lotNo: dto.lotNo },
    });

    if (!lot) {
      throw new NotFoundException(
        `Inspection lot with number '${dto.lotNo}' not found`
      );
    }

    // 결과 ID 중복 체크
    const existing = await this.prisma.inspectionResult.findUnique({
      where: { resultId: dto.resultId },
    });

    if (existing) {
      throw new ConflictException(
        `Inspection result with ID '${dto.resultId}' already exists`
      );
    }

    // 자동 판정
    if (!dto.judgment && dto.measuredValue !== undefined && dto.measuredValue !== null) {
      dto.judgment = this.calculateJudgment(dto.measuredValue, dto.specMin, dto.specMax);
    }

    // 로트 상태 업데이트
    if (lot.status === InspectionStatus.PENDING) {
      await this.prisma.inspectionLot.update({
        where: { lotNo: dto.lotNo },
        data: { status: InspectionStatus.IN_PROGRESS },
      });
    }

    return this.prisma.inspectionResult.create({
      data: { ...dto },
    });
  }

  /**
   * 다수 검사 결과 추가
   */
  async addResults(lotNo: string, results: CreateInspectionResultDto[]) {
    const savedResults: any[] = [];

    for (const dto of results) {
      const result = await this.addResult({ ...dto, lotNo });
      savedResults.push(result);
    }

    return savedResults;
  }

  /**
   * 검사 로트 최종 판정
   */
  async judgeLot(
    lotNo: string,
    judgment: InspectionJudgment,
    options?: { remarks?: string; judgedBy?: string }
  ): Promise<{
    lot: any;
    autoNcrCreated: boolean;
    ncrNo?: string;
  }> {
    await this.findOne(lotNo);

    // 검사 결과가 있는지 확인
    const results = await this.prisma.inspectionResult.findMany({
      where: { lotNo, deletedAt: null },
    });

    if (results.length === 0) {
      throw new BadRequestException(
        'Cannot judge lot without inspection results'
      );
    }

    // 결과 기반 자동 판정 (judgment가 제공되지 않은 경우)
    let finalJudgment = judgment;
    if (!finalJudgment) {
      const hasFail = results.some((r: any) => r.judgment === ResultJudgment.FAIL);
      finalJudgment = hasFail ? InspectionJudgment.FAIL : InspectionJudgment.PASS;
    }

    const updateData: any = {
      judgment: finalJudgment,
      status: InspectionStatus.COMPLETED,
    };

    if (options?.remarks) {
      updateData.remarks = options.remarks;
    }

    if (options?.judgedBy) {
      updateData.updatedBy = options.judgedBy;
      updateData.inspector = options.judgedBy;
    }

    const savedLot = await this.prisma.inspectionLot.update({
      where: { lotNo },
      data: updateData,
    });

    // FAIL인 경우 자동 NCR 생성 플래그 반환
    const autoNcrCreated = finalJudgment === InspectionJudgment.FAIL;
    const ncrNo = autoNcrCreated ? this.generateNcrNo(lotNo) : undefined;

    return {
      lot: savedLot,
      autoNcrCreated,
      ncrNo,
    };
  }

  /**
   * 검사 유형별 통계
   */
  async getStatistics(
    inspectionType?: InspectionType,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalLots: number;
    passCount: number;
    failCount: number;
    holdCount: number;
    passRate: number;
  }> {
    const where: any = {
      status: InspectionStatus.COMPLETED,
      deletedAt: null,
    };

    if (inspectionType) {
      where.inspectionType = inspectionType;
    }

    if (dateFrom && dateTo) {
      where.inspectionDate = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const lots = await this.prisma.inspectionLot.findMany({
      where,
      select: { judgment: true },
    });

    const passCount = lots.filter((l: any) => l.judgment === InspectionJudgment.PASS).length;
    const failCount = lots.filter((l: any) => l.judgment === InspectionJudgment.FAIL).length;
    const holdCount = lots.filter((l: any) => l.judgment === InspectionJudgment.HOLD).length;
    const totalLots = lots.length;

    return {
      totalLots,
      passCount,
      failCount,
      holdCount,
      passRate: totalLots > 0 ? Math.round((passCount / totalLots) * 100 * 100) / 100 : 0,
    };
  }

  /**
   * 자동 판정 계산
   */
  private calculateJudgment(
    measuredValue: number,
    specMin?: number,
    specMax?: number
  ): ResultJudgment {
    if (specMin !== undefined && specMin !== null && measuredValue < specMin) {
      return ResultJudgment.FAIL;
    }

    if (specMax !== undefined && specMax !== null && measuredValue > specMax) {
      return ResultJudgment.FAIL;
    }

    return ResultJudgment.PASS;
  }

  /**
   * NCR 번호 생성
   */
  private generateNcrNo(lotNo: string): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NCR-${dateStr}-${random}`;
  }
}
