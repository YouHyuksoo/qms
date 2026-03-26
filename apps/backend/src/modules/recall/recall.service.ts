import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { RecallStatus } from './entities/recall-campaign.entity';
import { RecallLotStatus } from './entities/recall-lot.entity';
import {
  CreateRecallCampaignDto,
  UpdateRecallCampaignDto,
  IdentifyRecallLotsDto,
  CreateRecallLotDto,
  UpdateRecallLotStatusDto,
  RecallQueryDto,
  RecallLotQueryDto,
} from './dto';

/**
 * 리콜 관리 서비스
 */
@Injectable()
export class RecallService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 리콜 캠페인 생성
   */
  async createRecallCampaign(dto: CreateRecallCampaignDto) {
    // 중복 체크
    const existing = await this.prisma.recallCampaign.findUnique({
      where: { recallId: dto.recallId },
    });

    if (existing) {
      throw new ConflictException(
        `Recall campaign with ID '${dto.recallId}' already exists`
      );
    }

    const existingNo = await this.prisma.recallCampaign.findUnique({
      where: { recallNo: dto.recallNo },
    });

    if (existingNo) {
      throw new ConflictException(
        `Recall campaign with number '${dto.recallNo}' already exists`
      );
    }

    return this.prisma.recallCampaign.create({
      data: {
        ...dto,
        affectedLots: dto.affectedLots ? JSON.stringify(dto.affectedLots) : undefined,
        status: RecallStatus.PLANNED,
      },
    });
  }

  /**
   * 리콜 캠페인 목록 조회
   */
  async findAllCampaigns(query: RecallQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'startDate',
      sortOrder = 'DESC',
      recallId,
      recallNo,
      itemCode,
      riskLevel,
      status,
      startDateFrom,
      startDateTo,
    } = query;

    const where: any = { deletedAt: null };

    if (recallId) {
      where.recallId = { contains: recallId };
    }

    if (recallNo) {
      where.recallNo = { contains: recallNo };
    }

    if (itemCode) {
      where.itemCode = { contains: itemCode };
    }

    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    if (status) {
      where.status = status;
    }

    // 날짜 범위 검색
    if (startDateFrom && startDateTo) {
      where.startDate = {
        gte: new Date(startDateFrom),
        lte: new Date(startDateTo),
      };
    } else if (startDateFrom) {
      where.startDate = {
        gte: new Date(startDateFrom),
      };
    } else if (startDateTo) {
      where.startDate = {
        lte: new Date(startDateTo),
      };
    }

    const [items, total] = await Promise.all([
      this.prisma.recallCampaign.findMany({
        where,
        orderBy: { [sortBy]: sortOrder.toLowerCase() },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.recallCampaign.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 리콜 캠페인 단건 조회
   */
  async findOneCampaign(recallId: string) {
    const campaign = await this.prisma.recallCampaign.findUnique({
      where: { recallId },
    });

    if (!campaign) {
      throw new NotFoundException(
        `Recall campaign with ID '${recallId}' not found`
      );
    }

    return campaign;
  }

  /**
   * 리콜 캠페인 수정
   */
  async updateCampaign(recallId: string, dto: UpdateRecallCampaignDto) {
    await this.findOneCampaign(recallId);

    return this.prisma.recallCampaign.update({
      where: { recallId },
      data: { ...dto },
    });
  }

  /**
   * 리콜 캠페인 삭제 (소프트 삭제)
   */
  async deleteCampaign(recallId: string, deletedBy?: string): Promise<void> {
    await this.findOneCampaign(recallId);

    await this.prisma.recallCampaign.update({
      where: { recallId },
      data: {
        deletedAt: new Date(),
        ...(deletedBy && { updatedBy: deletedBy }),
      },
    });
  }

  /**
   * 리콜 대상 로트 식별
   */
  async identifyAffectedLots(
    recallId: string,
    dto: IdentifyRecallLotsDto
  ): Promise<{
    identifiedLots: Array<{
      lotNo: string;
      qty: number;
      customerCode?: string;
      shipmentDate?: Date;
    }>;
    totalQty: number;
  }> {
    await this.findOneCampaign(recallId);

    // 실제 구현에서는 InspectionLot, Shipment 등 관련 테이블에서 조회
    const identifiedLots = [
      {
        lotNo: 'LOT-20240101-001',
        qty: 1000,
        customerCode: 'CUST-001',
        shipmentDate: new Date('2024-01-15'),
      },
      {
        lotNo: 'LOT-20240102-001',
        qty: 1500,
        customerCode: 'CUST-002',
        shipmentDate: new Date('2024-01-16'),
      },
    ];

    const totalQty = identifiedLots.reduce((sum, lot) => sum + lot.qty, 0);

    // 캠페인 정보 업데이트
    await this.prisma.recallCampaign.update({
      where: { recallId },
      data: { targetQty: totalQty },
    });

    return {
      identifiedLots,
      totalQty,
    };
  }

  /**
   * 리콜 로트 생성
   */
  async createRecallLot(recallId: string, dto: CreateRecallLotDto) {
    await this.findOneCampaign(recallId);

    const existing = await this.prisma.recallLot.findUnique({
      where: { recallLotId: dto.recallLotId },
    });

    if (existing) {
      throw new ConflictException(
        `Recall lot with ID '${dto.recallLotId}' already exists`
      );
    }

    return this.prisma.recallLot.create({
      data: {
        ...dto,
        recallId,
        status: RecallLotStatus.IDENTIFIED,
      },
    });
  }

  /**
   * 리콜 로트 목록 조회
   */
  async findAllLots(query: RecallLotQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      recallId,
      lotNo,
      customerCode,
      status,
    } = query;

    const where: any = { deletedAt: null };

    if (recallId) {
      where.recallId = recallId;
    }

    if (lotNo) {
      where.lotNo = { contains: lotNo };
    }

    if (customerCode) {
      where.customerCode = { contains: customerCode };
    }

    if (status) {
      where.status = status as RecallLotStatus;
    }

    const [items, total] = await Promise.all([
      this.prisma.recallLot.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.recallLot.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * 리콜 로트 단건 조회
   */
  async findOneLot(recallLotId: string) {
    const lot = await this.prisma.recallLot.findUnique({
      where: { recallLotId },
    });

    if (!lot) {
      throw new NotFoundException(
        `Recall lot with ID '${recallLotId}' not found`
      );
    }

    return lot;
  }

  /**
   * 리콜 로트 상태 업데이트
   */
  async updateLotStatus(recallLotId: string, dto: UpdateRecallLotStatusDto) {
    const lot = await this.findOneLot(recallLotId);

    const updatedLot = await this.prisma.recallLot.update({
      where: { recallLotId },
      data: { ...dto },
    });

    // 캠페인 완료 수량 업데이트
    await this.updateCampaignCompletedQty(lot.recallId);

    return updatedLot;
  }

  /** 완료 상태 목록 */
  private readonly COMPLETED_STATUSES = [
    RecallLotStatus.RETURNED, RecallLotStatus.DESTROYED,
    RecallLotStatus.REPLACED, RecallLotStatus.REPAIRED,
  ];

  /** 리콜 진행 상황 조회 */
  async getRecallProgress(recallId: string) {
    const campaign = await this.findOneCampaign(recallId);
    const lots = await this.prisma.recallLot.findMany({ where: { recallId, deletedAt: null } });

    const statusBreakdown: Record<string, number> = {};
    lots.forEach((lot: any) => { statusBreakdown[lot.status] = (statusBreakdown[lot.status] || 0) + lot.qty; });

    const customerMap = new Map<string, { customerCode: string; customerName: string; totalQty: number; completedQty: number }>();
    for (const lot of lots) {
      const key = lot.customerCode || 'UNKNOWN';
      if (!customerMap.has(key)) {
        customerMap.set(key, { customerCode: key, customerName: lot.customerName || 'Unknown', totalQty: 0, completedQty: 0 });
      }
      const customer = customerMap.get(key)!;
      customer.totalQty += lot.qty;
      if (this.COMPLETED_STATUSES.includes(lot.status as RecallLotStatus)) customer.completedQty += lot.qty;
    }

    const byCustomer = Array.from(customerMap.values()).map((c: any) => ({
      ...c,
      progressRate: c.totalQty > 0 ? Math.round((c.completedQty / c.totalQty) * 100 * 100) / 100 : 0,
    }));
    const progressRate = campaign.targetQty > 0
      ? Math.round((campaign.completedQty / campaign.targetQty) * 100 * 100) / 100 : 0;

    return { recallId, targetQty: campaign.targetQty, completedQty: campaign.completedQty, progressRate, statusBreakdown, byCustomer };
  }

  /** 리콜 비용 계산 */
  async calculateRecallCosts(recallId: string) {
    const campaign = await this.findOneCampaign(recallId);
    const lots = await this.prisma.recallLot.findMany({ where: { recallId, deletedAt: null } });
    const costBreakdown = { disposalCost: 0, replacementCost: 0, repairCost: 0, shippingCost: 0 };

    for (const lot of lots) {
      const lotCost = Number(lot.cost || 0);
      if (lot.status === RecallLotStatus.DESTROYED) costBreakdown.disposalCost += lotCost;
      else if (lot.status === RecallLotStatus.REPLACED) costBreakdown.replacementCost += lotCost;
      else if (lot.status === RecallLotStatus.REPAIRED) costBreakdown.repairCost += lotCost;
      costBreakdown.shippingCost += lotCost * 0.1;
    }

    const actualCost = costBreakdown.disposalCost + costBreakdown.replacementCost + costBreakdown.repairCost + costBreakdown.shippingCost;
    const estimatedCost = Number(campaign.estimatedCost || 0);
    const variance = actualCost - estimatedCost;
    const varianceRate = estimatedCost > 0 ? Math.round((variance / estimatedCost) * 100 * 100) / 100 : 0;

    await this.prisma.recallCampaign.update({ where: { recallId }, data: { actualCost } });
    return { estimatedCost, actualCost, variance, varianceRate, costBreakdown };
  }

  /** 리콜 통계 조회 */
  async getRecallStatistics() {
    const campaigns = await this.prisma.recallCampaign.findMany({ where: { deletedAt: null } });
    const activeCampaigns = campaigns.filter((c: any) => c.status === RecallStatus.IN_PROGRESS).length;
    const completedCampaigns = campaigns.filter((c: any) => c.status === RecallStatus.COMPLETED).length;
    const byRiskLevel: Record<string, number> = {};
    campaigns.forEach((c: any) => { byRiskLevel[c.riskLevel] = (byRiskLevel[c.riskLevel] || 0) + 1; });

    const completed = campaigns.filter((c: any) => c.status === RecallStatus.COMPLETED && c.targetQty > 0);
    const avgCompletionRate = completed.length > 0
      ? completed.reduce((sum: number, c: any) => sum + (c.completedQty / c.targetQty) * 100, 0) / completed.length : 0;

    return {
      totalCampaigns: campaigns.length, activeCampaigns, completedCampaigns, byRiskLevel,
      avgCompletionRate: Math.round(avgCompletionRate * 100) / 100,
      totalEstimatedCost: campaigns.reduce((sum: number, c: any) => sum + Number(c.estimatedCost || 0), 0),
      totalActualCost: campaigns.reduce((sum: number, c: any) => sum + Number(c.actualCost || 0), 0),
    };
  }

  /** 리콜 보고서 생성 */
  async generateRecallReport(recallId: string) {
    const campaign = await this.findOneCampaign(recallId);
    const progress = await this.getRecallProgress(recallId);
    const costs = await this.calculateRecallCosts(recallId);
    const today = new Date();
    const daysElapsed = Math.floor((today.getTime() - new Date(campaign.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = campaign.targetCompletionDate
      ? Math.max(0, Math.floor((new Date(campaign.targetCompletionDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    return {
      campaign, progress, costs,
      summary: {
        completionStatus: progress.progressRate >= 100 ? '완료' : progress.progressRate >= 80 ? '준완료' : '진행중',
        costStatus: costs.varianceRate <= 0 ? '예산 내' : costs.varianceRate <= 10 ? '약간 초과' : '초과',
        daysElapsed, daysRemaining,
      },
    };
  }

  /** 캠페인 완료 수량 업데이트 */
  private async updateCampaignCompletedQty(recallId: string): Promise<void> {
    const lots = await this.prisma.recallLot.findMany({ where: { recallId, deletedAt: null } });
    const completedQty = lots
      .filter((lot: any) => this.COMPLETED_STATUSES.includes(lot.status as RecallLotStatus))
      .reduce((sum: number, lot: any) => sum + (lot.returnQty || lot.qty), 0);
    await this.prisma.recallCampaign.update({ where: { recallId }, data: { completedQty } });
  }
}
