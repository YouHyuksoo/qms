/**
 * @file item.service.ts
 * @description 품번(Item) 서비스
 *
 * 품번 CRUD 비즈니스 로직을 처리합니다.
 * isActive 필터링 및 검색(contains) 기능을 지원합니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 *
 * 초보자 가이드:
 * - findAll: 검색어(search)로 코드/이름 contains 검색, isActive/itemType 필터링 지원
 * - findOne: itemCode(PK)로 단건 조회
 * - create: 중복 코드 체크 후 생성
 * - update/remove: 존재 여부 확인 후 처리 (삭제는 소프트 삭제)
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateItemDto, UpdateItemDto, ItemQueryDto } from './dto/item.dto';

/**
 * 품번 서비스
 */
@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 품번 생성
   */
  async create(dto: CreateItemDto) {
    const existing = await this.prisma.item.findFirst({
      where: { itemCode: dto.itemCode, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Item with code '${dto.itemCode}' already exists`,
      );
    }

    return this.prisma.item.create({ data: { ...dto } });
  }

  /**
   * 품번 목록 조회 (검색 + isActive 필터링)
   */
  async findAll(query: ItemQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, search, isActive, itemType } = query;

    const where: any = { deletedAt: null };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (itemType) {
      where.itemType = itemType;
    }

    if (search) {
      where.OR = [
        { itemCode: { contains: search } },
        { itemName: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        orderBy: { itemCode: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.item.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 품번 단건 조회
   */
  async findOne(itemCode: string) {
    const item = await this.prisma.item.findFirst({
      where: { itemCode, deletedAt: null },
    });

    if (!item) {
      throw new NotFoundException(
        `Item with code '${itemCode}' not found`,
      );
    }

    return item;
  }

  /**
   * 품번 수정
   */
  async update(itemCode: string, dto: UpdateItemDto) {
    await this.findOne(itemCode);
    return this.prisma.item.update({
      where: { itemCode },
      data: { ...dto },
    });
  }

  /**
   * 품번 삭제 (소프트 삭제)
   */
  async remove(itemCode: string, deletedBy?: string): Promise<void> {
    await this.findOne(itemCode);

    await this.prisma.item.update({
      where: { itemCode },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }
}
