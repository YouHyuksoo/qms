import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RecallService } from './recall.service';
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
 * 리콜 관리 컨트롤러
 */
@ApiTags('Recall')
@Controller('recalls')
export class RecallController {
  constructor(private readonly recallService: RecallService) {}

  /**
   * 리콜 캠페인 생성
   */
  @Post('campaigns')
  @ApiOperation({
    summary: '리콜 캠페인 생성',
    description: '새로운 리콜 캠페인을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '리콜 캠페인 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 리콜 ID 또는 번호' })
  async createCampaign(@Body() dto: CreateRecallCampaignDto) {
    return this.recallService.createRecallCampaign(dto);
  }

  /**
   * 리콜 캠페인 목록 조회
   */
  @Get('campaigns')
  @ApiOperation({
    summary: '리콜 캠페인 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 리콜 캠페인 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '리콜 캠페인 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/RecallCampaign' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllCampaigns(@Query() query: RecallQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.recallService.findAllCampaigns(query);
  }

  /**
   * 리콜 캠페인 단건 조회
   */
  @Get('campaigns/:recallId')
  @ApiOperation({
    summary: '리콜 캠페인 상세 조회',
    description: '특정 리콜 캠페인의 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'recallId', description: '리콜 ID', example: 'REC-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '리콜 캠페인 조회 성공',
  })
  @ApiResponse({ status: 404, description: '리콜 캠페인을 찾을 수 없음' })
  async findOneCampaign(@Param('recallId') recallId: string) {
    return this.recallService.findOneCampaign(recallId);
  }

  /**
   * 리콜 캠페인 수정
   */
  @Put('campaigns/:recallId')
  @ApiOperation({
    summary: '리콜 캠페인 수정',
    description: '기존 리콜 캠페인의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'recallId', description: '리콜 ID', example: 'REC-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '리콜 캠페인 수정 성공',
  })
  @ApiResponse({ status: 404, description: '리콜 캠페인을 찾을 수 없음' })
  async updateCampaign(
    @Param('recallId') recallId: string,
    @Body() dto: UpdateRecallCampaignDto
  ) {
    return this.recallService.updateCampaign(recallId, dto);
  }

  /**
   * 리콜 캠페인 삭제
   */
  @Delete('campaigns/:recallId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '리콜 캠페인 삭제',
    description: '리콜 캠페인을 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'recallId', description: '리콜 ID', example: 'REC-20240319-001' })
  @ApiResponse({ status: 204, description: '리콜 캠페인 삭제 성공' })
  @ApiResponse({ status: 404, description: '리콜 캠페인을 찾을 수 없음' })
  async deleteCampaign(
    @Param('recallId') recallId: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.recallService.deleteCampaign(recallId, deletedBy);
  }

  /**
   * 리콜 대상 로트 식별
   */
  @Post('campaigns/:recallId/identify-lots')
  @ApiOperation({
    summary: '리콜 대상 로트 식별',
    description: '품목 및 생산일 범위에 따른 리콜 대상 로트를 식별합니다.',
  })
  @ApiParam({ name: 'recallId', description: '리콜 ID', example: 'REC-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '로트 식별 성공',
    schema: {
      properties: {
        identifiedLots: { type: 'array' },
        totalQty: { type: 'number' },
      },
    },
  })
  async identifyAffectedLots(
    @Param('recallId') recallId: string,
    @Body() dto: IdentifyRecallLotsDto
  ): Promise<{
    identifiedLots: Array<{
      lotNo: string;
      qty: number;
      customerCode?: string;
      shipmentDate?: Date;
    }>;
    totalQty: number;
  }> {
    return this.recallService.identifyAffectedLots(recallId, dto);
  }

  /**
   * 리콜 로트 생성
   */
  @Post('campaigns/:recallId/lots')
  @ApiOperation({
    summary: '리콜 로트 생성',
    description: '리콜 캠페인에 로트를 추가합니다.',
  })
  @ApiParam({ name: 'recallId', description: '리콜 ID', example: 'REC-20240319-001' })
  @ApiResponse({
    status: 201,
    description: '리콜 로트 생성 성공',
  })
  async createRecallLot(
    @Param('recallId') recallId: string,
    @Body() dto: CreateRecallLotDto
  ) {
    return this.recallService.createRecallLot(recallId, dto);
  }

  /**
   * 리콜 로트 목록 조회
   */
  @Get('lots')
  @ApiOperation({
    summary: '리콜 로트 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 리콜 로트 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '리콜 로트 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/RecallLot' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllLots(@Query() query: RecallLotQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.recallService.findAllLots(query);
  }

  /**
   * 리콜 진행 상황 조회
   */
  @Get('campaigns/:recallId/progress')
  @ApiOperation({
    summary: '리콜 진행 상황 조회',
    description: '리콜 캠페인의 실시간 진행 상황을 조회합니다.',
  })
  @ApiParam({ name: 'recallId', description: '리콜 ID', example: 'REC-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '진행 상황 조회 성공',
    schema: {
      properties: {
        recallId: { type: 'string' },
        targetQty: { type: 'number' },
        completedQty: { type: 'number' },
        progressRate: { type: 'number' },
        statusBreakdown: { type: 'object' },
        byCustomer: { type: 'array' },
      },
    },
  })
  async getRecallProgress(@Param('recallId') recallId: string): Promise<{
    recallId: string;
    targetQty: number;
    completedQty: number;
    progressRate: number;
    statusBreakdown: Record<string, number>;
    byCustomer: any[];
  }> {
    return this.recallService.getRecallProgress(recallId);
  }

  /**
   * 리콜 로트 상태 업데이트
   */
  @Put('lots/:recallLotId/status')
  @ApiOperation({
    summary: '리콜 로트 상태 업데이트',
    description: '개별 리콜 로트의 상태를 업데이트합니다.',
  })
  @ApiParam({ name: 'recallLotId', description: '리콜 로트 ID', example: 'RL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '상태 업데이트 성공',
  })
  async updateLotStatus(
    @Param('recallLotId') recallLotId: string,
    @Body() dto: UpdateRecallLotStatusDto
  ) {
    return this.recallService.updateLotStatus(recallLotId, dto);
  }

  /**
   * 리콜 비용 조회
   */
  @Get('campaigns/:recallId/costs')
  @ApiOperation({
    summary: '리콜 비용 조회',
    description: '리콜 캠페인의 예상 대비 실제 비용을 조회합니다.',
  })
  @ApiParam({ name: 'recallId', description: '리콜 ID', example: 'REC-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '비용 조회 성공',
    schema: {
      properties: {
        estimatedCost: { type: 'number' },
        actualCost: { type: 'number' },
        variance: { type: 'number' },
        varianceRate: { type: 'number' },
        costBreakdown: { type: 'object' },
      },
    },
  })
  async getRecallCosts(@Param('recallId') recallId: string): Promise<{
    estimatedCost: number;
    actualCost: number;
    variance: number;
    varianceRate: number;
    costBreakdown: {
      disposalCost: number;
      replacementCost: number;
      repairCost: number;
      shippingCost: number;
    };
  }> {
    return this.recallService.calculateRecallCosts(recallId);
  }

  /**
   * 리콜 통계 조회
   */
  @Get('statistics')
  @ApiOperation({
    summary: '리콜 통계 조회',
    description: '전체 리콜 통계를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        totalCampaigns: { type: 'number' },
        activeCampaigns: { type: 'number' },
        completedCampaigns: { type: 'number' },
        byRiskLevel: { type: 'object' },
        avgCompletionRate: { type: 'number' },
        totalEstimatedCost: { type: 'number' },
        totalActualCost: { type: 'number' },
      },
    },
  })
  async getRecallStatistics(): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    completedCampaigns: number;
    byRiskLevel: Record<string, number>;
    avgCompletionRate: number;
    totalEstimatedCost: number;
    totalActualCost: number;
  }> {
    return this.recallService.getRecallStatistics();
  }

  /**
   * 리콜 보고서 생성
   */
  @Get('campaigns/:recallId/report')
  @ApiOperation({
    summary: '리콜 보고서 생성',
    description: '경영진용 리콜 보고서를 생성합니다.',
  })
  @ApiParam({ name: 'recallId', description: '리콜 ID', example: 'REC-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '보고서 생성 성공',
    schema: {
      properties: {
        campaign: { type: 'object' },
        progress: { type: 'object' },
        costs: { type: 'object' },
        summary: { type: 'object' },
      },
    },
  })
  async generateRecallReport(@Param('recallId') recallId: string): Promise<{
    campaign: any;
    progress: any;
    costs: any;
    summary: {
      completionStatus: string;
      costStatus: string;
      daysElapsed: number;
      daysRemaining: number;
    };
  }> {
    return this.recallService.generateRecallReport(recallId);
  }
}
