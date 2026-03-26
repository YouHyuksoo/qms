import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { TestCategory } from './entities/dvp-plan.entity';
import { TestResult } from './entities/dvp-result.entity';
import {
  CreateDvpPlanDto,
  UpdateDvpPlanDto,
  RecordDvpResultDto,
  UpdateDvpResultDto,
  DvpQueryDto,
} from './dto';

/**
 * DVP 서비스
 *
 * DVP (Design Validation Plan) 계획 및 결과를 관리합니다.
 */
@Injectable()
export class DvpService {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Plan Methods ====================

  /**
   * DVP 계획 생성
   */
  async createPlan(dto: CreateDvpPlanDto) {
    const existing = await this.prisma.dvpPlan.findFirst({
      where: { planId: dto.planId },
    });
    if (existing) {
      throw new ConflictException(`Plan with ID ${dto.planId} already exists`);
    }

    return this.prisma.dvpPlan.create({
      data: {
        ...dto,
        plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : undefined,
        plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : undefined,
      },
    });
  }

  /**
   * DVP 계획 목록 조회
   */
  async findAllPlans(query: DvpQueryDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const where: Record<string, unknown> = { deletedAt: null };

    if (query.planId) {
      where.planId = { contains: query.planId };
    }
    if (query.projectNo) {
      where.projectNo = query.projectNo;
    }
    if (query.itemCode) {
      where.itemCode = query.itemCode;
    }
    if (query.testCategory) {
      where.testCategory = query.testCategory;
    }
    if (query.testItem) {
      where.testItem = { contains: query.testItem };
    }
    if (query.responsiblePerson) {
      where.responsiblePerson = query.responsiblePerson;
    }

    const [items, total] = await Promise.all([
      this.prisma.dvpPlan.findMany({
        where,
        include: { results: true },
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.dvpPlan.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * DVP 계획 단건 조회
   */
  async findOnePlan(planId: string) {
    const plan = await this.prisma.dvpPlan.findFirst({
      where: { planId, deletedAt: null },
      include: { results: true },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    return plan;
  }

  /**
   * DVP 계획 수정
   */
  async updatePlan(planId: string, dto: UpdateDvpPlanDto) {
    const plan = await this.findOnePlan(planId);

    await this.prisma.dvpPlan.update({
      where: { id: plan.id },
      data: {
        ...dto,
        plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : undefined,
        plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : undefined,
      },
    });

    return this.findOnePlan(planId);
  }

  /**
   * DVP 계획 삭제 (소프트)
   */
  async deletePlan(planId: string, deletedBy?: string): Promise<void> {
    const plan = await this.findOnePlan(planId);
    await this.prisma.dvpPlan.update({
      where: { id: plan.id },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== Result Methods ====================

  /**
   * DVP 결과 기록
   */
  async recordResult(planId: string, dto: RecordDvpResultDto) {
    await this.findOnePlan(planId);

    const existing = await this.prisma.dvpResult.findFirst({
      where: { resultId: dto.resultId },
    });
    if (existing) {
      throw new ConflictException(`Result with ID ${dto.resultId} already exists`);
    }

    return this.prisma.dvpResult.create({
      data: {
        ...dto,
        planId,
        actualStartDate: dto.actualStartDate ? new Date(dto.actualStartDate) : undefined,
        actualEndDate: dto.actualEndDate ? new Date(dto.actualEndDate) : undefined,
      },
    });
  }

  /**
   * DVP 결과 수정
   */
  async updateResult(resultId: string, dto: UpdateDvpResultDto) {
    const result = await this.prisma.dvpResult.findFirst({
      where: { resultId, deletedAt: null },
    });

    if (!result) {
      throw new NotFoundException(`Result with ID ${resultId} not found`);
    }

    return this.prisma.dvpResult.update({
      where: { id: result.id },
      data: {
        ...dto,
        actualStartDate: dto.actualStartDate ? new Date(dto.actualStartDate) : undefined,
        actualEndDate: dto.actualEndDate ? new Date(dto.actualEndDate) : undefined,
      },
    });
  }

  /**
   * DVP 결과 조회 (계획별)
   */
  async findResultsByPlan(planId: string) {
    const plan = await this.findOnePlan(planId);
    return plan.results || [];
  }

  // ==================== Analysis Methods ====================

  /**
   * 검증 상태 조회
   */
  async getValidationStatus(projectNo?: string) {
    const where: Record<string, unknown> = { deletedAt: null };
    if (projectNo) {
      where.projectNo = projectNo;
    }

    const plans = await this.prisma.dvpPlan.findMany({
      where,
      include: { results: true },
    });

    const byCategory = Object.values(TestCategory).reduce(
      (acc: Record<string, number>, category: string) => {
        acc[category] = plans.filter((p: any) => p.testCategory === category).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const allResults = plans.flatMap((p: any) => p.results || []);

    const byResult = Object.values(TestResult).reduce(
      (acc: Record<string, number>, result: string) => {
        acc[result] = allResults.filter((r: any) => r.testResult === result).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const passRate =
      allResults.length > 0
        ? (allResults.filter((r: any) => r.testResult === TestResult.PASS).length / allResults.length) * 100
        : 0;

    return {
      totalPlans: plans.length,
      byCategory,
      byResult,
      passRate: Math.round(passRate * 100) / 100,
      inProgressCount: byResult[TestResult.IN_PROGRESS] || 0,
      notStartedCount: byResult[TestResult.NOT_TESTED] || 0,
      completedCount: (byResult[TestResult.PASS] || 0) + (byResult[TestResult.FAIL] || 0),
      failedCount: byResult[TestResult.FAIL] || 0,
    };
  }

  /**
   * DVP 통계 조회
   */
  async getStatistics() {
    const plans = await this.prisma.dvpPlan.findMany({
      where: { deletedAt: null },
      include: { results: true },
    });

    const allResults = plans.flatMap((p: any) => p.results || []);

    const byCategory = Object.values(TestCategory).reduce(
      (acc: Record<string, number>, category: string) => {
        acc[category] = plans.filter((p: any) => p.testCategory === category).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byResult = Object.values(TestResult).reduce(
      (acc: Record<string, number>, result: string) => {
        acc[result] = allResults.filter((r: any) => r.testResult === result).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    const passedCount = byResult[TestResult.PASS] || 0;
    const completedCount = passedCount + (byResult[TestResult.FAIL] || 0);
    const averagePassRate = completedCount > 0 ? (passedCount / completedCount) * 100 : 0;

    return {
      totalPlans: plans.length,
      totalResults: allResults.length,
      byCategory,
      byResult,
      averagePassRate: Math.round(averagePassRate * 100) / 100,
    };
  }
}
