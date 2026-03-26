/**
 * @file equipment.service.ts
 * @description 계측기 관리 서비스
 *
 * 초보자 가이드:
 * - 계측기 CRUD, 교정 등록, 교정 예정 조회, OOT 관리, 통계 기능을 제공합니다.
 * - 교정 등록 시 Equipment의 lastCalibrationDate, nextCalibrationDate를 자동 갱신합니다.
 * - OOT 발생 시 해당 계측기의 status를 OOT로 변경합니다.
 * - Prisma Client를 사용하여 데이터베이스에 접근합니다.
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { EquipmentStatus } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentQueryDto } from './dto/equipment-query.dto';
import { CreateCalibrationDto } from './dto/create-calibration.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 계측기 등록
   */
  async createEquipment(dto: CreateEquipmentDto) {
    const existing = await this.prisma.equipment.findFirst({
      where: { equipmentId: dto.equipmentId, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException(
        `Equipment with ID '${dto.equipmentId}' already exists`,
      );
    }

    const existingNo = await this.prisma.equipment.findFirst({
      where: { equipmentNo: dto.equipmentNo, deletedAt: null },
    });

    if (existingNo) {
      throw new ConflictException(
        `Equipment with number '${dto.equipmentNo}' already exists`,
      );
    }

    return this.prisma.equipment.create({ data: { ...dto } });
  }

  /**
   * 계측기 목록 조회 (필터/페이지네이션)
   */
  async findAllEquipment(query: EquipmentQueryDto): Promise<{
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
      equipmentNo,
      equipmentName,
      equipmentType,
      status,
      department,
    } = query;

    const where: any = { deletedAt: null };

    if (equipmentNo) {
      where.equipmentNo = { contains: equipmentNo };
    }
    if (equipmentName) {
      where.equipmentName = { contains: equipmentName };
    }
    if (equipmentType) {
      where.equipmentType = { contains: equipmentType };
    }
    if (status) {
      where.status = status;
    }
    if (department) {
      where.department = { contains: department };
    }

    const [items, total] = await Promise.all([
      this.prisma.equipment.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.equipment.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  /**
   * 계측기 상세 조회 (교정 이력 포함)
   */
  async findOneEquipment(equipmentId: string) {
    const equipment = await this.prisma.equipment.findFirst({
      where: { equipmentId, deletedAt: null },
      include: { calibrations: true },
    });

    if (!equipment) {
      throw new NotFoundException(
        `Equipment with ID '${equipmentId}' not found`,
      );
    }

    return equipment;
  }

  /**
   * 계측기 수정
   */
  async updateEquipment(equipmentId: string, dto: UpdateEquipmentDto) {
    await this.findOneEquipment(equipmentId);
    return this.prisma.equipment.update({
      where: { equipmentId },
      data: { ...dto },
    });
  }

  /**
   * 계측기 소프트 삭제
   */
  async deleteEquipment(
    equipmentId: string,
    deletedBy?: string,
  ): Promise<void> {
    await this.findOneEquipment(equipmentId);

    await this.prisma.equipment.update({
      where: { equipmentId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy ? { updatedBy: deletedBy } : {}),
      },
    });
  }

  /**
   * 교정 결과 등록
   *
   * 교정 등록 시 Equipment의 교정 날짜를 자동 업데이트하고,
   * OOT인 경우 status를 OOT로 변경합니다.
   */
  async createCalibration(equipmentId: string, dto: CreateCalibrationDto) {
    const equipment = await this.findOneEquipment(equipmentId);

    const existingNo = await this.prisma.calibration.findFirst({
      where: { calibrationNo: dto.calibrationNo, deletedAt: null },
    });

    if (existingNo) {
      throw new ConflictException(
        `Calibration with number '${dto.calibrationNo}' already exists`,
      );
    }

    const saved = await this.prisma.calibration.create({
      data: { ...dto, equipmentId },
    });

    // Equipment 교정 날짜 자동 업데이트
    const updateData: any = {
      lastCalibrationDate: new Date(dto.calibrationDate),
    };

    if (dto.nextCalibrationDate) {
      updateData.nextCalibrationDate = new Date(dto.nextCalibrationDate);
    } else if (equipment.calibrationCycle) {
      const next = new Date(dto.calibrationDate);
      next.setDate(next.getDate() + equipment.calibrationCycle);
      updateData.nextCalibrationDate = next;
    }

    // OOT 시 status 변경
    if (dto.isOot) {
      updateData.status = EquipmentStatus.OOT;
    }

    await this.prisma.equipment.update({
      where: { equipmentId },
      data: updateData,
    });

    return saved;
  }

  /**
   * 교정 이력 조회
   */
  async findCalibrations(equipmentId: string) {
    // 존재 여부 확인
    await this.findOneEquipment(equipmentId);

    return this.prisma.calibration.findMany({
      where: { equipmentId, deletedAt: null },
      orderBy: { calibrationDate: 'desc' },
    });
  }

  /**
   * 교정 예정 계측기 조회
   *
   * nextCalibrationDate 기준으로 N일 이내에 교정이 필요한 계측기를 조회합니다.
   */
  async getCalibrationDue(daysAhead: number = 30) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);

    return this.prisma.equipment.findMany({
      where: {
        nextCalibrationDate: { lte: targetDate },
        status: EquipmentStatus.ACTIVE,
        deletedAt: null,
      },
      orderBy: { nextCalibrationDate: 'asc' },
    });
  }

  /**
   * OOT 목록 조회
   *
   * isOot=true인 교정 기록과 해당 계측기 정보를 조회합니다.
   */
  async getOotEquipment() {
    return this.prisma.calibration.findMany({
      where: { isOot: true, deletedAt: null },
      include: { equipment: true },
      orderBy: { calibrationDate: 'desc' },
    });
  }

  /**
   * 통계 조회 (상태별/부서별 집계)
   */
  async getStatistics(): Promise<{
    byStatus: Array<{ status: string; count: number }>;
    byDepartment: Array<{ department: string; count: number }>;
    total: number;
    calibrationDueSoon: number;
  }> {
    const byStatusRaw = await this.prisma.equipment.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    const byDepartmentRaw = await this.prisma.equipment.groupBy({
      by: ['department'],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    const total = await this.prisma.equipment.count({
      where: { deletedAt: null },
    });

    // 30일 이내 교정 예정
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const calibrationDueSoon = await this.prisma.equipment.count({
      where: {
        nextCalibrationDate: { lte: targetDate },
        status: EquipmentStatus.ACTIVE,
        deletedAt: null,
      },
    });

    return {
      byStatus: byStatusRaw.map((r: any) => ({
        status: r.status,
        count: r._count._all,
      })),
      byDepartment: byDepartmentRaw.map((r: any) => ({
        department: r.department || '미지정',
        count: r._count._all,
      })),
      total,
      calibrationDueSoon,
    };
  }
}
