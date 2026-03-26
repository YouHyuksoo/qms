/**
 * @file capa.service.ts
 * @description CAPA(시정/예방 조치) 서비스
 *
 * CAPA의 생성, 조회, 수정, 삭제 및 효과성 검증 관리를 담당합니다.
 * Prisma를 사용하여 DB에 접근합니다.
 *
 * 초보자 가이드:
 * - createCapa: 중복 번호 체크 후 CAPA를 생성합니다.
 * - findAllCapas: 페이지네이션과 다양한 필터로 목록을 조회합니다.
 * - findOneCapa: 효과성 검증 이력을 포함한 단건 조회입니다.
 * - addEffectivenessCheck: CAPA에 효과성 검증 기록을 추가합니다.
 * - getCapaSummary: 상태별/타입별/우선순위별 통계를 제공합니다.
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CapaStatus } from './entities/capa.entity';
import {
  CreateCapaDto,
  UpdateCapaDto,
  CapaQueryDto,
  CreateEffectivenessCheckDto,
} from './dto';

/**
 * CAPA 서비스
 */
@Injectable()
export class CapaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * CAPA 생성
   * @param dto 생성 데이터
   * @returns 생성된 CAPA
   */
  async createCapa(dto: CreateCapaDto) {
    const existing = await this.prisma.capa.findFirst({
      where: { capaId: dto.capaId },
    });

    if (existing) {
      throw new ConflictException(`CAPA with ID '${dto.capaId}' already exists`);
    }

    const existingNo = await this.prisma.capa.findFirst({
      where: { capaNo: dto.capaNo },
    });

    if (existingNo) {
      throw new ConflictException(`CAPA with number '${dto.capaNo}' already exists`);
    }

    return this.prisma.capa.create({
      data: {
        ...dto,
        status: CapaStatus.OPEN,
      },
    });
  }

  /**
   * CAPA 목록 조회 (페이지네이션/필터링)
   * @param query 조회 조건
   * @returns 페이지네이션된 CAPA 목록
   */
  async findAllCapas(query: CapaQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      capaNo,
      capaType,
      status,
      priority,
      assignedTo,
      dueDateFrom,
      dueDateTo,
    } = query;

    const where: Record<string, unknown> = { deletedAt: null };

    if (capaNo) {
      where.capaNo = { contains: capaNo };
    }
    if (capaType) {
      where.capaType = capaType;
    }
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }
    if (assignedTo) {
      where.assignedTo = { contains: assignedTo };
    }
    if (dueDateFrom || dueDateTo) {
      where.dueDate = {
        ...(dueDateFrom ? { gte: new Date(dueDateFrom) } : {}),
        ...(dueDateTo ? { lte: new Date(dueDateTo) } : {}),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.capa.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.capa.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * CAPA 단건 조회 (효과성 검증 이력 포함)
   * @param capaId CAPA ID
   * @returns CAPA 상세 정보
   */
  async findOneCapa(capaId: string) {
    const capa = await this.prisma.capa.findFirst({
      where: { capaId, deletedAt: null },
      include: { effectivenessChecks: true },
    });

    if (!capa) {
      throw new NotFoundException(`CAPA with ID '${capaId}' not found`);
    }

    return capa;
  }

  /**
   * CAPA 수정
   * @param capaId CAPA ID
   * @param dto 수정 데이터
   * @returns 수정된 CAPA
   */
  async updateCapa(capaId: string, dto: UpdateCapaDto) {
    const capa = await this.findOneCapa(capaId);

    return this.prisma.capa.update({
      where: { id: capa.id },
      data: { ...dto },
    });
  }

  /**
   * CAPA 소프트 삭제
   * @param capaId CAPA ID
   * @param deletedBy 삭제자
   */
  async deleteCapa(capaId: string, deletedBy?: string): Promise<void> {
    const capa = await this.findOneCapa(capaId);

    await this.prisma.capa.update({
      where: { id: capa.id },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }

  /**
   * 효과성 검증 추가
   * @param capaId CAPA ID
   * @param dto 효과성 검증 데이터
   * @returns 생성된 효과성 검증
   */
  async addEffectivenessCheck(capaId: string, dto: CreateEffectivenessCheckDto) {
    await this.findOneCapa(capaId);

    return this.prisma.effectivenessCheck.create({
      data: {
        ...dto,
        capaId,
      },
    });
  }

  /**
   * 효과성 검증 이력 조회
   * @param capaId CAPA ID
   * @returns 효과성 검증 이력 목록
   */
  async getEffectivenessChecks(capaId: string) {
    await this.findOneCapa(capaId);

    return this.prisma.effectivenessCheck.findMany({
      where: { capaId },
      orderBy: { checkNo: 'asc' },
    });
  }

  /**
   * CAPA 통계 요약 (상태별, 타입별, 우선순위별)
   * @returns 통계 요약 데이터
   */
  async getCapaSummary() {
    const [byStatus, byType, byPriority, total] = await Promise.all([
      this.prisma.$queryRaw`
        SELECT status, COUNT(*) as count FROM capa WHERE deleted_at IS NULL GROUP BY status
      ` as Promise<Array<{ status: string; count: bigint }>>,
      this.prisma.$queryRaw`
        SELECT capa_type as "capaType", COUNT(*) as count FROM capa WHERE deleted_at IS NULL GROUP BY capa_type
      ` as Promise<Array<{ capaType: string; count: bigint }>>,
      this.prisma.$queryRaw`
        SELECT priority, COUNT(*) as count FROM capa WHERE deleted_at IS NULL GROUP BY priority
      ` as Promise<Array<{ priority: string; count: bigint }>>,
      this.prisma.capa.count({ where: { deletedAt: null } }),
    ]);

    return {
      byStatus: byStatus.map((r: any) => ({
        status: r.status,
        count: Number(r.count),
      })),
      byType: byType.map((r: any) => ({
        capaType: r.capaType,
        count: Number(r.count),
      })),
      byPriority: byPriority.map((r: any) => ({
        priority: r.priority,
        count: Number(r.count),
      })),
      total,
    };
  }
}
