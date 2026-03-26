/**
 * @file customer.service.ts
 * @description 고객사(Customer) 서비스
 *
 * 고객사 CRUD 비즈니스 로직을 처리합니다.
 * isActive 필터링 및 검색(contains) 기능을 지원합니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 *
 * 초보자 가이드:
 * - findAll: 검색어(search)로 코드/이름 contains 검색, isActive 필터링 지원
 * - findOne: customerCode(PK)로 단건 조회
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
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerQueryDto,
} from './dto/customer.dto';

/**
 * 고객사 서비스
 */
@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 고객사 생성
   */
  async create(dto: CreateCustomerDto) {
    const existing = await this.prisma.customer.findFirst({
      where: { customerCode: dto.customerCode, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Customer with code '${dto.customerCode}' already exists`,
      );
    }

    return this.prisma.customer.create({ data: { ...dto } });
  }

  /**
   * 고객사 목록 조회 (검색 + isActive 필터링)
   */
  async findAll(query: CustomerQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, search, isActive, customerType } = query;

    const where: any = { deletedAt: null };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (customerType) {
      where.customerType = customerType;
    }

    if (search) {
      where.OR = [
        { customerCode: { contains: search } },
        { customerName: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        orderBy: { customerCode: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 고객사 단건 조회
   */
  async findOne(customerCode: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { customerCode, deletedAt: null },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with code '${customerCode}' not found`,
      );
    }

    return customer;
  }

  /**
   * 고객사 수정
   */
  async update(customerCode: string, dto: UpdateCustomerDto) {
    await this.findOne(customerCode);
    return this.prisma.customer.update({
      where: { customerCode },
      data: { ...dto },
    });
  }

  /**
   * 고객사 삭제 (소프트 삭제)
   */
  async remove(customerCode: string, deletedBy?: string): Promise<void> {
    await this.findOne(customerCode);

    await this.prisma.customer.update({
      where: { customerCode },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }
}
