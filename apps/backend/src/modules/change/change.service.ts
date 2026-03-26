/**
 * @file change.service.ts
 * @description 변경 관리 서비스
 *
 * 변경 요청(Change Request)의 CRUD 및 워크플로우를 처리하는 서비스입니다.
 * Prisma Client를 사용하여 데이터베이스에 접근합니다.
 *
 * 주요 비즈니스 로직:
 * - create: 변경 요청 등록 (중복 체크 포함)
 * - review: 상태를 REVIEWING으로 전환, 검토자/검토일 기록
 * - approve: 상태를 APPROVED로 전환, 승인자/승인일 기록
 * - implement: 상태를 IMPLEMENTING으로 전환 (고객 승인 미완료 시 차단)
 * - complete: 상태를 COMPLETED로 전환, 완료일 기록
 * - statistics: 타입별/상태별 통계
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  ChangeStatus,
} from './entities/change-request.entity';
import {
  CreateChangeDto,
  UpdateChangeDto,
  ChangeQueryDto,
  ReviewChangeDto,
  ApproveChangeDto,
  ImplementChangeDto,
  CompleteChangeDto,
} from './dto';

/**
 * 변경 관리 서비스
 */
@Injectable()
export class ChangeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 변경 요청 생성
   */
  async createChange(dto: CreateChangeDto) {
    const existing = await this.prisma.changeRequest.findFirst({
      where: { changeId: dto.changeId, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Change request with ID '${dto.changeId}' already exists`,
      );
    }

    const existingNo = await this.prisma.changeRequest.findFirst({
      where: { changeNo: dto.changeNo, deletedAt: null },
    });

    if (existingNo) {
      throw new ConflictException(
        `Change request with number '${dto.changeNo}' already exists`,
      );
    }

    return this.prisma.changeRequest.create({
      data: { ...dto, status: ChangeStatus.REQUESTED },
    });
  }

  /**
   * 변경 요청 목록 조회
   */
  async findAllChanges(query: ChangeQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'requestDate',
      sortOrder = 'DESC',
      changeNo,
      changeType,
      status,
      itemCode,
      customerCode,
      requestDateFrom,
      requestDateTo,
    } = query;

    const where: any = { deletedAt: null };

    if (changeNo) {
      where.changeNo = { contains: changeNo };
    }

    if (changeType) {
      where.changeType = changeType;
    }

    if (status) {
      where.status = status;
    }

    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }

    if (customerCode) {
      where.customerCode = { contains: customerCode };
    }

    if (requestDateFrom && requestDateTo) {
      where.requestDate = {
        gte: new Date(requestDateFrom),
        lte: new Date(requestDateTo),
      };
    } else if (requestDateFrom) {
      where.requestDate = { gte: new Date(requestDateFrom) };
    } else if (requestDateTo) {
      where.requestDate = { lte: new Date(requestDateTo) };
    }

    const [items, total] = await Promise.all([
      this.prisma.changeRequest.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.changeRequest.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 변경 요청 단건 조회
   */
  async findOneChange(changeId: string) {
    const change = await this.prisma.changeRequest.findFirst({
      where: { changeId, deletedAt: null },
    });

    if (!change) {
      throw new NotFoundException(
        `Change request with ID '${changeId}' not found`,
      );
    }

    return change;
  }

  /**
   * 변경 요청 수정
   */
  async updateChange(changeId: string, dto: UpdateChangeDto) {
    await this.findOneChange(changeId);
    return this.prisma.changeRequest.update({
      where: { changeId },
      data: { ...dto },
    });
  }

  /**
   * 변경 요청 삭제 (소프트 삭제)
   */
  async deleteChange(changeId: string, deletedBy?: string): Promise<void> {
    await this.findOneChange(changeId);

    await this.prisma.changeRequest.update({
      where: { changeId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }

  /**
   * 변경 요청 검토 시작
   */
  async reviewChange(changeId: string, dto: ReviewChangeDto) {
    await this.findOneChange(changeId);

    return this.prisma.changeRequest.update({
      where: { changeId },
      data: {
        status: ChangeStatus.REVIEWING,
        reviewedBy: dto.reviewedBy,
        reviewDate: new Date(),
        ...(dto.remarks ? { remarks: dto.remarks } : {}),
      },
    });
  }

  /**
   * 변경 요청 승인
   */
  async approveChange(changeId: string, dto: ApproveChangeDto) {
    await this.findOneChange(changeId);

    return this.prisma.changeRequest.update({
      where: { changeId },
      data: {
        status: ChangeStatus.APPROVED,
        approvedBy: dto.approvedBy,
        approvalDate: new Date(),
        ...(dto.remarks ? { remarks: dto.remarks } : {}),
      },
    });
  }

  /**
   * 변경 요청 실행 시작
   *
   * 고객 승인이 필요한데 미승인 상태이면 ConflictException을 던집니다.
   */
  async implementChange(changeId: string, dto: ImplementChangeDto) {
    const change = await this.findOneChange(changeId);

    if (
      change.customerApprovalRequired &&
      change.customerApprovalStatus !== 'APPROVED'
    ) {
      throw new ConflictException(
        'Customer approval is required before implementation. ' +
        'Current customer approval status: ' +
        (change.customerApprovalStatus || 'NOT_REQUESTED'),
      );
    }

    return this.prisma.changeRequest.update({
      where: { changeId },
      data: {
        status: ChangeStatus.IMPLEMENTING,
        implementationDate: new Date(),
        ...(dto.updatedBy ? { updatedBy: dto.updatedBy } : {}),
        ...(dto.remarks ? { remarks: dto.remarks } : {}),
      },
    });
  }

  /**
   * 변경 요청 완료
   */
  async completeChange(changeId: string, dto: CompleteChangeDto) {
    await this.findOneChange(changeId);

    return this.prisma.changeRequest.update({
      where: { changeId },
      data: {
        status: ChangeStatus.COMPLETED,
        completionDate: new Date(),
        ...(dto.updatedBy ? { updatedBy: dto.updatedBy } : {}),
        ...(dto.remarks ? { remarks: dto.remarks } : {}),
      },
    });
  }

  /**
   * 고객 승인 대기 중인 변경 요청 목록 조회
   */
  async findPendingCustomerApproval() {
    return this.prisma.changeRequest.findMany({
      where: {
        customerApprovalRequired: true,
        customerApprovalStatus: 'PENDING',
        deletedAt: null,
      },
      orderBy: { requestDate: 'asc' },
    });
  }

  /**
   * 변경 요청 통계 (타입별, 상태별)
   */
  async getStatistics(): Promise<{
    byType: Array<{ changeType: string; count: number }>;
    byStatus: Array<{ status: string; count: number }>;
    total: number;
  }> {
    const byTypeRaw = await this.prisma.changeRequest.groupBy({
      by: ['changeType'],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    const byStatusRaw = await this.prisma.changeRequest.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    const total = await this.prisma.changeRequest.count({
      where: { deletedAt: null },
    });

    return {
      byType: byTypeRaw.map((r: any) => ({
        changeType: r.changeType,
        count: r._count._all,
      })),
      byStatus: byStatusRaw.map((r: any) => ({
        status: r.status,
        count: r._count._all,
      })),
      total,
    };
  }
}
