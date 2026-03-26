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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { InitialSampleService } from './initial-sample.service';
import {
  CreateInitialSampleDto,
  UpdateInitialSampleDto,
  AddInspectionItemDto,
  UpdateInspectionItemDto,
  InitialSampleQueryDto,
} from './dto';
import { InspectionResult } from './entities/initial-sample.entity';

/**
 * 초기 샘플 관리 컨트롤러
 */
@ApiTags('Initial Sample')
@Controller('initial-samples')
export class InitialSampleController {
  constructor(private readonly initialSampleService: InitialSampleService) {}

  // ==================== Sample Endpoints ====================

  /**
   * 초기 샘플 등록
   */
  @Post()
  @ApiOperation({
    summary: '초기 샘플 등록',
    description: '새로운 초기 샘플을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '초기 샘플 등록 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 샘플 ID' })
  async createSample(@Body() dto: CreateInitialSampleDto) {
    return this.initialSampleService.createSample(dto);
  }

  /**
   * 초기 샘플 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: '초기 샘플 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 초기 샘플 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '샘플 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/InitialSample' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllSamples(@Query() query: InitialSampleQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.initialSampleService.findAllSamples(query);
  }

  /**
   * 초기 샘플 단건 조회
   */
  @Get(':sampleId')
  @ApiOperation({
    summary: '초기 샘플 상세 조회',
    description: '특정 초기 샘플의 상세 정보와 검사 항목을 조회합니다.',
  })
  @ApiParam({ name: 'sampleId', description: '샘플 ID', example: 'IS-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '샘플 조회 성공',
  })
  @ApiResponse({ status: 404, description: '샘플을 찾을 수 없음' })
  async findOneSample(@Param('sampleId') sampleId: string) {
    return this.initialSampleService.findOneSample(sampleId);
  }

  /**
   * 초기 샘플 수정
   */
  @Put(':sampleId')
  @ApiOperation({
    summary: '초기 샘플 수정',
    description: '기존 초기 샘플의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'sampleId', description: '샘플 ID', example: 'IS-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '샘플 수정 성공',
  })
  @ApiResponse({ status: 404, description: '샘플을 찾을 수 없음' })
  async updateSample(
    @Param('sampleId') sampleId: string,
    @Body() dto: UpdateInitialSampleDto
  ) {
    return this.initialSampleService.updateSample(sampleId, dto);
  }

  /**
   * 초기 샘플 삭제
   */
  @Delete(':sampleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '초기 샘플 삭제',
    description: '초기 샘플을 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'sampleId', description: '샘플 ID', example: 'IS-20240319-001' })
  @ApiResponse({ status: 204, description: '샘플 삭제 성공' })
  @ApiResponse({ status: 404, description: '샘플을 찾을 수 없음' })
  async deleteSample(
    @Param('sampleId') sampleId: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.initialSampleService.deleteSample(sampleId, deletedBy);
  }

  // ==================== Inspection Item Endpoints ====================

  /**
   * 검사 항목 추가
   */
  @Post(':sampleId/items')
  @ApiOperation({
    summary: '검사 항목 추가',
    description: '초기 샘플에 검사 항목을 추가합니다.',
  })
  @ApiParam({ name: 'sampleId', description: '샘플 ID', example: 'IS-20240319-001' })
  @ApiResponse({
    status: 201,
    description: '검사 항목 추가 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 항목 ID' })
  async addInspectionItem(
    @Param('sampleId') sampleId: string,
    @Body() dto: AddInspectionItemDto
  ) {
    return this.initialSampleService.addInspectionItem(sampleId, dto);
  }

  /**
   * 검사 항목 수정
   */
  @Put('items/:itemId')
  @ApiOperation({
    summary: '검사 항목 수정',
    description: '검사 항목을 수정합니다.',
  })
  @ApiParam({ name: 'itemId', description: '항목 ID', example: 'ITEM-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '검사 항목 수정 성공',
  })
  @ApiResponse({ status: 404, description: '항목을 찾을 수 없음' })
  async updateInspectionItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateInspectionItemDto
  ) {
    return this.initialSampleService.updateInspectionItem(itemId, dto);
  }

  /**
   * 검사 항목 목록 조회 (샘플별)
   */
  @Get(':sampleId/items')
  @ApiOperation({
    summary: '검사 항목 목록 조회',
    description: '특정 샘플의 모든 검사 항목을 조회합니다.',
  })
  @ApiParam({ name: 'sampleId', description: '샘플 ID', example: 'IS-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '검사 항목 목록 조회 성공',
  })
  async findInspectionItemsBySample(@Param('sampleId') sampleId: string) {
    return this.initialSampleService.findInspectionItemsBySample(sampleId);
  }

  // ==================== Judgment Endpoints ====================

  /**
   * 샘플 승인
   */
  @Post(':sampleId/approve')
  @ApiOperation({
    summary: '초기 샘플 승인',
    description: '초기 샘플을 승인합니다. 모든 검사 항목이 완료되어야 합니다.',
  })
  @ApiParam({ name: 'sampleId', description: '샘플 ID', example: 'IS-20240319-001' })
  @ApiQuery({ name: 'approvedBy', description: '승인자', required: true })
  @ApiResponse({
    status: 200,
    description: '샘플 승인 성공',
  })
  async approveSample(
    @Param('sampleId') sampleId: string,
    @Query('approvedBy') approvedBy: string,
    @Body() options?: { remarks?: string; updatedBy?: string }
  ) {
    return this.initialSampleService.approveSample(sampleId, approvedBy, options?.remarks);
  }

  /**
   * 샘플 반려
   */
  @Post(':sampleId/reject')
  @ApiOperation({
    summary: '초기 샘플 반려',
    description: '초기 샘플을 반려합니다.',
  })
  @ApiParam({ name: 'sampleId', description: '샘플 ID', example: 'IS-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '샘플 반려 성공',
  })
  async rejectSample(
    @Param('sampleId') sampleId: string,
    @Body() dto: { reason: string; remarks?: string; updatedBy?: string }
  ) {
    return this.initialSampleService.rejectSample(sampleId, dto.reason, dto.remarks);
  }

  /**
   * 샘플 판정
   */
  @Post(':sampleId/judge')
  @ApiOperation({
    summary: '초기 샘플 판정',
    description: '초기 샘플에 대해 최종 판정을 내립니다.',
  })
  @ApiParam({ name: 'sampleId', description: '샘플 ID', example: 'IS-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '샘플 판정 성공',
  })
  async judgeSample(
    @Param('sampleId') sampleId: string,
    @Body() dto: {
      judgment: InspectionResult;
      approvedBy?: string;
      rejectionReason?: string;
      remarks?: string;
      updatedBy?: string;
    }
  ) {
    return this.initialSampleService.judgeSample(sampleId, dto.judgment, {
      approvedBy: dto.approvedBy,
      rejectionReason: dto.rejectionReason,
      remarks: dto.remarks,
      updatedBy: dto.updatedBy,
    });
  }

  // ==================== Statistics Endpoints ====================

  /**
   * 통계 조회
   */
  @Get('statistics/summary')
  @ApiOperation({
    summary: '초기 샘플 통계 조회',
    description: '초기 샘플 통계 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        totalSamples: { type: 'number' },
        byStatus: { type: 'object' },
        byResult: { type: 'object' },
        approvalRate: { type: 'number' },
        pendingCount: { type: 'number' },
      },
    },
  })
  async getStatistics(): Promise<{
    totalSamples: number;
    byStatus: Record<string, number>;
    byResult: Record<string, number>;
    approvalRate: number;
    pendingCount: number;
  }> {
    return this.initialSampleService.getStatistics();
  }
}
