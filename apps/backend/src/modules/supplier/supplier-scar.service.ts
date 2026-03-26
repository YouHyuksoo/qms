/**
 * @file supplier-scar.service.ts
 * @description SCAR(공급업체 시정 조치 요구서) 서비스
 *
 * SCAR의 CRUD 및 종결 처리 기능을 제공합니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 *
 * - SCAR 발행/조회/수정
 * - SCAR 종결: ACCEPTED 상태에서만 종결 가능
 * - 공급업체 응답 기록 (수정 API를 통해 처리)
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { ScarStatus } from './entities/scar.entity';
import {
  CreateScarDto,
  UpdateScarDto,
  ScarQueryDto,
  CloseScarDto,
} from './dto';

/**
 * SCAR 서비스
 */
@Injectable()
export class SupplierScarService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * SCAR 발행
   */
  async createScar(dto: CreateScarDto) {
    const existing = await this.prisma.scar.findFirst({
      where: { scarId: dto.scarId, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `SCAR with ID '${dto.scarId}' already exists`,
      );
    }

    const existingNo = await this.prisma.scar.findFirst({
      where: { scarNo: dto.scarNo, deletedAt: null },
    });

    if (existingNo) {
      throw new ConflictException(
        `SCAR with number '${dto.scarNo}' already exists`,
      );
    }

    return this.prisma.scar.create({
      data: { ...dto, status: ScarStatus.ISSUED },
    });
  }

  /**
   * SCAR 목록 조회 (필터: scarNo, supplierCode, status)
   */
  async findAllScars(query: ScarQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'issueDate',
      sortOrder = 'DESC',
      scarNo,
      supplierCode,
      status,
    } = query;

    const where: any = { deletedAt: null };

    if (scarNo) {
      where.scarNo = { contains: scarNo };
    }

    if (supplierCode) {
      where.supplierCode = { contains: supplierCode };
    }

    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      this.prisma.scar.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.scar.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * SCAR 상세 조회
   */
  async findOneScar(scarId: string) {
    const scar = await this.prisma.scar.findFirst({
      where: { scarId, deletedAt: null },
    });

    if (!scar) {
      throw new NotFoundException(`SCAR with ID '${scarId}' not found`);
    }

    return scar;
  }

  /**
   * SCAR 수정 (공급업체 응답 포함)
   */
  async updateScar(scarId: string, dto: UpdateScarDto) {
    await this.findOneScar(scarId);
    return this.prisma.scar.update({
      where: { scarId },
      data: { ...dto },
    });
  }

  /**
   * SCAR 종결
   *
   * ACCEPTED 상태에서만 종결할 수 있습니다.
   */
  async closeScar(scarId: string, dto: CloseScarDto) {
    const scar = await this.findOneScar(scarId);

    if (scar.status === ScarStatus.CLOSED) {
      throw new ConflictException('SCAR is already closed');
    }

    if (scar.status !== ScarStatus.ACCEPTED) {
      throw new ConflictException(
        'Only ACCEPTED SCARs can be closed',
      );
    }

    return this.prisma.scar.update({
      where: { scarId },
      data: {
        status: ScarStatus.CLOSED,
        closedDate: new Date(),
        ...(dto.reviewedBy ? { reviewedBy: dto.reviewedBy } : {}),
        ...(dto.remarks ? { remarks: dto.remarks } : {}),
        ...(dto.updatedBy ? { updatedBy: dto.updatedBy } : {}),
      },
    });
  }
}
