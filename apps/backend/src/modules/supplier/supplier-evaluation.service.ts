/**
 * @file supplier-evaluation.service.ts
 * @description 공급업체 평가 서비스
 *
 * 공급업체 평가의 CRUD 및 스코어카드, 통계 기능을 제공합니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 *
 * - 평가 등록/조회/수정
 * - 스코어카드: 특정 공급업체의 최근 평가 + 이력 조회
 * - 통계: 등급 분포, 평균 PPM
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateEvaluationDto,
  UpdateEvaluationDto,
  EvaluationQueryDto,
} from './dto';

/**
 * 공급업체 평가 서비스
 */
@Injectable()
export class SupplierEvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 평가 등록
   */
  async createEvaluation(dto: CreateEvaluationDto) {
    const existing = await this.prisma.supplierEvaluation.findFirst({
      where: { evaluationId: dto.evaluationId, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Evaluation with ID '${dto.evaluationId}' already exists`,
      );
    }

    return this.prisma.supplierEvaluation.create({ data: { ...dto } });
  }

  /**
   * 평가 목록 조회 (필터: supplierCode, period, grade)
   */
  async findAllEvaluations(query: EvaluationQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'evaluationDate',
      sortOrder = 'DESC',
      supplierCode,
      period,
      grade,
    } = query;

    const where: any = { deletedAt: null };

    if (supplierCode) {
      where.supplierCode = { contains: supplierCode };
    }

    if (period) {
      where.evaluationPeriod = { contains: period };
    }

    if (grade) {
      where.grade = grade;
    }

    const [items, total] = await Promise.all([
      this.prisma.supplierEvaluation.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.supplierEvaluation.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 평가 상세 조회
   */
  async findOneEvaluation(evaluationId: string) {
    const evaluation = await this.prisma.supplierEvaluation.findFirst({
      where: { evaluationId, deletedAt: null },
    });

    if (!evaluation) {
      throw new NotFoundException(
        `Evaluation with ID '${evaluationId}' not found`,
      );
    }

    return evaluation;
  }

  /**
   * 평가 수정
   */
  async updateEvaluation(evaluationId: string, dto: UpdateEvaluationDto) {
    await this.findOneEvaluation(evaluationId);
    return this.prisma.supplierEvaluation.update({
      where: { evaluationId },
      data: { ...dto },
    });
  }

  /**
   * 스코어카드 조회 - 특정 공급업체의 최근 평가 + 이력
   */
  async getScorecard(supplierCode: string): Promise<{
    latest: any | null;
    history: any[];
  }> {
    const history = await this.prisma.supplierEvaluation.findMany({
      where: { supplierCode, deletedAt: null },
      orderBy: { evaluationDate: 'desc' },
      take: 12,
    });

    return {
      latest: history.length > 0 ? history[0] : null,
      history,
    };
  }

  /**
   * 통계 - 등급 분포, 평균 PPM
   */
  async getStatistics(): Promise<{
    gradeDistribution: Array<{ grade: string; count: number }>;
    avgPpm: number;
    totalSuppliers: number;
  }> {
    // 등급 분포
    const gradeDistribution = await this.prisma.supplierEvaluation.groupBy({
      by: ['grade'],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    const gradeResult = gradeDistribution.map((row: any) => ({
      grade: row.grade,
      count: row._count._all,
    }));

    // 평균 PPM + 고유 공급업체 수
    const ppmResult = await this.prisma.supplierEvaluation.aggregate({
      where: { deletedAt: null },
      _avg: { ppm: true },
    });

    const distinctSuppliers = await this.prisma.$queryRaw`SELECT COUNT(DISTINCT "supplierCode") as "totalSuppliers" FROM "SupplierEvaluation" WHERE "deletedAt" IS NULL` as Array<{ totalSuppliers: bigint }>;

    return {
      gradeDistribution: gradeResult,
      avgPpm: ppmResult._avg.ppm
        ? Math.round(Number(ppmResult._avg.ppm) * 100) / 100
        : 0,
      totalSuppliers: Number(distinctSuppliers[0]?.totalSuppliers ?? 0),
    };
  }
}
