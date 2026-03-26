/**
 * @file hr-competency.service.ts
 * @description 직원 역량/자격 관리 서비스
 *
 * 직원의 역량 CRUD, 역량 매트릭스, 만료 예정 자격 조회 기능을 제공합니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 * - 역량 등록/조회/수정/삭제
 * - 부서별/공정별 역량 매트릭스 조회
 * - 만료 예정 자격증 조회
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateCompetencyDto,
  UpdateCompetencyDto,
  CompetencyQueryDto,
} from './dto';

/**
 * 역량 관리 서비스
 */
@Injectable()
export class HrCompetencyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 역량 등록
   */
  async createCompetency(dto: CreateCompetencyDto) {
    const existing = await this.prisma.employeeCompetency.findFirst({
      where: { competencyId: dto.competencyId, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Competency with ID '${dto.competencyId}' already exists`,
      );
    }

    return this.prisma.employeeCompetency.create({ data: { ...dto } });
  }

  /**
   * 역량 목록 조회
   */
  async findAllCompetencies(query: CompetencyQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      employeeId,
      department,
      processCode,
      competencyLevel,
      isQualified,
    } = query;

    const where: any = { deletedAt: null };

    if (employeeId) {
      where.employeeId = { contains: employeeId };
    }
    if (department) {
      where.department = { contains: department };
    }
    if (processCode) {
      where.processCode = { contains: processCode };
    }
    if (competencyLevel) {
      where.competencyLevel = competencyLevel;
    }
    if (isQualified !== undefined) {
      where.isQualified = isQualified;
    }

    const [items, total] = await Promise.all([
      this.prisma.employeeCompetency.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.employeeCompetency.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 역량 상세 조회
   */
  async findOneCompetency(competencyId: string) {
    const competency = await this.prisma.employeeCompetency.findFirst({
      where: { competencyId, deletedAt: null },
    });

    if (!competency) {
      throw new NotFoundException(
        `Competency with ID '${competencyId}' not found`,
      );
    }

    return competency;
  }

  /**
   * 역량 수정
   */
  async updateCompetency(competencyId: string, dto: UpdateCompetencyDto) {
    await this.findOneCompetency(competencyId);
    return this.prisma.employeeCompetency.update({
      where: { competencyId },
      data: { ...dto },
    });
  }

  /**
   * 역량 삭제 (소프트 삭제)
   */
  async deleteCompetency(
    competencyId: string,
    deletedBy?: string,
  ): Promise<void> {
    await this.findOneCompetency(competencyId);

    await this.prisma.employeeCompetency.update({
      where: { competencyId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }

  /**
   * 역량 매트릭스 조회 (부서별/공정별 역량 현황)
   */
  async getCompetencyMatrix(): Promise<{
    byDepartment: Array<Record<string, unknown>>;
    byProcess: Array<Record<string, unknown>>;
  }> {
    const byDepartmentRaw = await this.prisma.$queryRaw`SELECT "department", "competencyLevel", COUNT(*)::bigint as "count" FROM "EmployeeCompetency" WHERE "deletedAt" IS NULL AND "department" IS NOT NULL GROUP BY "department", "competencyLevel"` as Array<{ department: string; competencyLevel: string; count: bigint }>;

    const byProcessRaw = await this.prisma.$queryRaw`SELECT "processCode", "competencyLevel", COUNT(*)::bigint as "count" FROM "EmployeeCompetency" WHERE "deletedAt" IS NULL AND "processCode" IS NOT NULL GROUP BY "processCode", "competencyLevel"` as Array<{ processCode: string; competencyLevel: string; count: bigint }>;

    return {
      byDepartment: this.aggregateMatrix(
        byDepartmentRaw.map((r: any) => ({
          department: r.department,
          competencyLevel: r.competencyLevel,
          count: String(r.count),
        })),
        'department',
      ),
      byProcess: this.aggregateMatrix(
        byProcessRaw.map((r: any) => ({
          processCode: r.processCode,
          competencyLevel: r.competencyLevel,
          count: String(r.count),
        })),
        'processCode',
      ),
    };
  }

  /**
   * 만료 예정 자격 조회
   */
  async getExpiringCertifications(daysAhead: number = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return this.prisma.employeeCompetency.findMany({
      where: {
        expiryDate: { lte: targetDate },
        isQualified: true,
        deletedAt: null,
      },
      orderBy: { expiryDate: 'asc' },
    });
  }

  /**
   * 역량 레벨 분포 통계
   */
  async getLevelDistribution(): Promise<
    Array<{ level: string; count: number }>
  > {
    const result = await this.prisma.employeeCompetency.groupBy({
      by: ['competencyLevel'],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    return result.map((r: any) => ({
      level: r.competencyLevel,
      count: r._count._all,
    }));
  }

  /**
   * 매트릭스 데이터 집계 헬퍼
   */
  private aggregateMatrix(
    rawData: Array<{
      competencyLevel: string;
      count: string;
      [key: string]: string;
    }>,
    groupKey: string,
  ): Array<Record<string, unknown>> {
    const grouped = new Map<
      string,
      { total: number; levels: Record<string, number> }
    >();

    for (const row of rawData) {
      const key = row[groupKey];
      if (!grouped.has(key)) {
        grouped.set(key, { total: 0, levels: {} });
      }
      const group = grouped.get(key)!;
      const count = Number(row.count);
      group.total += count;
      group.levels[row.competencyLevel] = count;
    }

    return Array.from(grouped.entries()).map(([key, value]) => ({
      [groupKey]: key,
      totalEmployees: value.total,
      levels: value.levels,
    }));
  }
}
