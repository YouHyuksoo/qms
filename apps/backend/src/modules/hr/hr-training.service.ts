/**
 * @file hr-training.service.ts
 * @description 교육 이력 관리 서비스
 *
 * 직원의 교육 CRUD, 예정 교육 조회, 교육 통계 기능을 제공합니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 * - 교육 등록/조회/수정/삭제
 * - 예정 교육 목록 조회
 * - 교육 현황 통계
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  TrainingStatus,
} from './entities/training-record.entity';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
  TrainingQueryDto,
} from './dto';

/**
 * 교육 관리 서비스
 */
@Injectable()
export class HrTrainingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 교육 등록
   */
  async createTraining(dto: CreateTrainingDto) {
    const existing = await this.prisma.trainingRecord.findFirst({
      where: { trainingId: dto.trainingId, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Training with ID '${dto.trainingId}' already exists`,
      );
    }

    return this.prisma.trainingRecord.create({
      data: {
        ...dto,
        status: dto.status ?? TrainingStatus.PLANNED,
      },
    });
  }

  /**
   * 교육 목록 조회
   */
  async findAllTrainings(query: TrainingQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'trainingDate',
      sortOrder = 'DESC',
      employeeId,
      trainingType,
      status,
    } = query;

    const where: any = { deletedAt: null };

    if (employeeId) {
      where.employeeId = { contains: employeeId };
    }
    if (trainingType) {
      where.trainingType = trainingType;
    }
    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.trainingRecord.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.trainingRecord.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 교육 상세 조회
   */
  async findOneTraining(trainingId: string) {
    const training = await this.prisma.trainingRecord.findFirst({
      where: { trainingId, deletedAt: null },
    });

    if (!training) {
      throw new NotFoundException(
        `Training with ID '${trainingId}' not found`,
      );
    }

    return training;
  }

  /**
   * 교육 수정
   */
  async updateTraining(trainingId: string, dto: UpdateTrainingDto) {
    await this.findOneTraining(trainingId);
    return this.prisma.trainingRecord.update({
      where: { trainingId },
      data: { ...dto },
    });
  }

  /**
   * 교육 삭제 (소프트 삭제)
   */
  async deleteTraining(
    trainingId: string,
    deletedBy?: string,
  ): Promise<void> {
    await this.findOneTraining(trainingId);

    await this.prisma.trainingRecord.update({
      where: { trainingId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }

  /**
   * 예정 교육 목록 조회
   */
  async getUpcomingTrainings() {
    const today = new Date();

    return this.prisma.trainingRecord.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            status: TrainingStatus.PLANNED,
            trainingDate: { gte: today },
          },
          {
            nextTrainingDate: { gte: today },
          },
        ],
      },
      orderBy: { trainingDate: 'asc' },
    });
  }

  /**
   * 교육 현황 통계
   */
  async getTrainingStatistics(): Promise<{
    byStatus: Array<{ status: string; count: number }>;
    byType: Array<{ type: string; count: number }>;
    completionRate: number;
    avgScore: number;
  }> {
    const byStatusRaw = await this.prisma.trainingRecord.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    const byTypeRaw = await this.prisma.trainingRecord.groupBy({
      by: ['trainingType'],
      where: { deletedAt: null, trainingType: { not: null } },
      _count: { _all: true },
    });

    const scoreResult = await this.prisma.trainingRecord.aggregate({
      where: { deletedAt: null },
      _avg: { score: true },
      _count: { _all: true },
    });

    const completedCount = await this.prisma.trainingRecord.count({
      where: { deletedAt: null, status: TrainingStatus.COMPLETED },
    });

    const total = scoreResult._count._all;

    return {
      byStatus: byStatusRaw.map((r: any) => ({
        status: r.status,
        count: r._count._all,
      })),
      byType: byTypeRaw.map((r: any) => ({
        type: r.trainingType!,
        count: r._count._all,
      })),
      completionRate:
        total > 0
          ? Math.round((completedCount / total) * 10000) / 100
          : 0,
      avgScore:
        Math.round(Number(scoreResult._avg.score || 0) * 100) / 100,
    };
  }
}
