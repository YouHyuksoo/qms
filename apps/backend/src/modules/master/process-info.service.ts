/**
 * @file process-info.service.ts
 * @description 공정(ProcessInfo) 서비스
 *
 * 공정 CRUD 비즈니스 로직을 처리합니다.
 * isActive 필터링 및 검색(contains) 기능을 지원합니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 *
 * 초보자 가이드:
 * - findAll: 검색어(search)로 코드/이름 contains 검색, isActive/processType 필터링 지원
 * - findOne: processCode(PK)로 단건 조회
 * - create: 중복 코드 체크 후 생성
 * - update/remove: 존재 여부 확인 후 처리 (삭제는 소프트 삭제)
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreateProcessInfoDto,
  UpdateProcessInfoDto,
  ProcessInfoQueryDto,
} from './dto/process-info.dto';

/**
 * 공정 서비스
 */
@Injectable()
export class ProcessInfoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 공정 생성
   */
  async create(dto: CreateProcessInfoDto) {
    const existing = await this.prisma.processInfo.findFirst({
      where: { processCode: dto.processCode, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Process with code '${dto.processCode}' already exists`,
      );
    }

    return this.prisma.processInfo.create({ data: { ...dto } });
  }

  /**
   * 공정 목록 조회 (검색 + isActive 필터링)
   */
  async findAll(query: ProcessInfoQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, search, isActive, processType } = query;

    const where: any = { deletedAt: null };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (processType) {
      where.processType = processType;
    }

    if (search) {
      where.OR = [
        { processCode: { contains: search } },
        { processName: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.processInfo.findMany({
        where,
        orderBy: [{ sequence: 'asc' }, { processCode: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.processInfo.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 공정 단건 조회
   */
  async findOne(processCode: string) {
    const process = await this.prisma.processInfo.findFirst({
      where: { processCode, deletedAt: null },
    });

    if (!process) {
      throw new NotFoundException(
        `Process with code '${processCode}' not found`,
      );
    }

    return process;
  }

  /**
   * 공정 수정
   */
  async update(processCode: string, dto: UpdateProcessInfoDto) {
    await this.findOne(processCode);
    return this.prisma.processInfo.update({
      where: { processCode },
      data: { ...dto },
    });
  }

  /**
   * 공정 삭제 (소프트 삭제)
   */
  async remove(processCode: string, deletedBy?: string): Promise<void> {
    await this.findOne(processCode);

    await this.prisma.processInfo.update({
      where: { processCode },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }
}
