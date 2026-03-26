/**
 * @file traceability.service.ts
 * @description 추적성 관리 서비스
 *
 * 로트 추적 데이터의 CRUD와 Forward/Backward/Genealogy 추적 기능을 제공합니다.
 *
 * - Forward Trace: 원자재 → 완제품 방향으로 해당 로트가 투입된 모든 하위 로트를 추적
 * - Backward Trace: 완제품 → 원자재 방향으로 상위 원자재 로트를 역추적
 * - Genealogy: 양방향 트리를 구성하여 전체 계보를 조회
 *
 * 초보자 가이드:
 * - parentLotNo 필드가 로트 간 부모-자식 관계를 형성합니다.
 * - Forward는 현재 lotNo를 parentLotNo로 가진 레코드들을 찾아 내려갑니다.
 * - Backward는 현재 레코드의 parentLotNo를 따라 올라갑니다.
 * - 최대 5단계까지 추적합니다.
 * - Prisma Client를 사용하여 데이터베이스에 접근합니다.
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateTraceDto,
  UpdateTraceDto,
  TraceQueryDto,
} from './dto';

/** Forward/Backward 추적 최대 깊이 */
const MAX_TRACE_DEPTH = 5;

/**
 * 추적성 관리 서비스
 */
@Injectable()
export class TraceabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 추적 데이터 생성
   */
  async createTrace(dto: CreateTraceDto) {
    const existing = await this.prisma.lotTrace.findFirst({
      where: { traceId: dto.traceId, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Trace with ID '${dto.traceId}' already exists`,
      );
    }

    return this.prisma.lotTrace.create({ data: { ...dto } });
  }

  /**
   * 추적 데이터 목록 조회 (필터 + 페이지네이션)
   */
  async findAllTraces(query: TraceQueryDto): Promise<{
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
      lotNo,
      itemCode,
      traceType,
      dateFrom,
      dateTo,
    } = query;

    const where: any = { deletedAt: null };

    if (lotNo) {
      where.lotNo = { contains: lotNo };
    }

    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }

    if (traceType) {
      where.traceType = traceType;
    }

    if (dateFrom && dateTo) {
      where.productionDate = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    } else if (dateFrom) {
      where.productionDate = { gte: new Date(dateFrom) };
    } else if (dateTo) {
      where.productionDate = { lte: new Date(dateTo) };
    }

    const [items, total] = await Promise.all([
      this.prisma.lotTrace.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.lotTrace.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 추적 데이터 단건 조회
   */
  async findOneTrace(traceId: string) {
    const trace = await this.prisma.lotTrace.findFirst({
      where: { traceId, deletedAt: null },
    });

    if (!trace) {
      throw new NotFoundException(
        `Trace with ID '${traceId}' not found`,
      );
    }

    return trace;
  }

  /**
   * 추적 데이터 수정
   */
  async updateTrace(traceId: string, dto: UpdateTraceDto) {
    await this.findOneTrace(traceId);
    return this.prisma.lotTrace.update({
      where: { traceId },
      data: { ...dto },
    });
  }

  /**
   * 추적 데이터 삭제 (소프트 삭제)
   */
  async deleteTrace(traceId: string, deletedBy?: string): Promise<void> {
    await this.findOneTrace(traceId);

    await this.prisma.lotTrace.update({
      where: { traceId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }

  /**
   * Forward Trace (원자재 → 완제품)
   *
   * 현재 lotNo를 parentLotNo로 가진 레코드들을 조회하고,
   * 그 레코드들의 lotNo로 다시 조회하는 과정을 최대 5단계 반복합니다.
   *
   * @param lotNo - 추적 시작 로트번호
   * @returns 단계별 하위 로트 목록
   */
  async forwardTrace(lotNo: string): Promise<{
    startLotNo: string;
    depth: number;
    traces: Array<{ level: number; items: any[] }>;
  }> {
    const traces: Array<{ level: number; items: any[] }> = [];
    let currentLotNos: string[] = [lotNo];

    for (let level = 1; level <= MAX_TRACE_DEPTH; level++) {
      if (currentLotNos.length === 0) break;

      const children = await this.prisma.lotTrace.findMany({
        where: { parentLotNo: { in: currentLotNos }, deletedAt: null },
      });

      if (children.length === 0) break;

      traces.push({ level, items: children });
      currentLotNos = [...new Set(children.map((c: any) => c.lotNo))] as string[];
    }

    return {
      startLotNo: lotNo,
      depth: traces.length,
      traces,
    };
  }

  /**
   * Backward Trace (완제품 → 원자재)
   *
   * 현재 lotNo의 parentLotNo를 조회하고,
   * 그 parentLotNo의 parentLotNo를 다시 조회하는 과정을 최대 5단계 반복합니다.
   *
   * @param lotNo - 추적 시작 로트번호
   * @returns 단계별 상위 로트 목록
   */
  async backwardTrace(lotNo: string): Promise<{
    startLotNo: string;
    depth: number;
    traces: Array<{ level: number; items: any[] }>;
  }> {
    const traces: Array<{ level: number; items: any[] }> = [];
    let currentLotNos: string[] = [lotNo];

    for (let level = 1; level <= MAX_TRACE_DEPTH; level++) {
      if (currentLotNos.length === 0) break;

      const currentRecords = await this.prisma.lotTrace.findMany({
        where: { lotNo: { in: currentLotNos }, deletedAt: null },
      });

      const parentLotNos: string[] = Array.from(new Set(
        currentRecords
          .map((r: any) => r.parentLotNo as string)
          .filter((p: string | null | undefined): p is string => !!p),
      ));

      if (parentLotNos.length === 0) break;

      const parents = await this.prisma.lotTrace.findMany({
        where: { lotNo: { in: parentLotNos }, deletedAt: null },
      });

      if (parents.length === 0) break;

      traces.push({ level, items: parents });
      currentLotNos = parentLotNos;
    }

    return {
      startLotNo: lotNo,
      depth: traces.length,
      traces,
    };
  }

  /**
   * Genealogy (양방향 계보 조회)
   *
   * Forward + Backward 추적을 합쳐서 전체 계보(Family Tree)를 반환합니다.
   *
   * @param lotNo - 기준 로트번호
   * @returns 양방향 추적 결과
   */
  async getGenealogy(lotNo: string): Promise<{
    lotNo: string;
    forward: { depth: number; traces: Array<{ level: number; items: any[] }> };
    backward: { depth: number; traces: Array<{ level: number; items: any[] }> };
  }> {
    const [forward, backward] = await Promise.all([
      this.forwardTrace(lotNo),
      this.backwardTrace(lotNo),
    ]);

    return {
      lotNo,
      forward: { depth: forward.depth, traces: forward.traces },
      backward: { depth: backward.depth, traces: backward.traces },
    };
  }
}
