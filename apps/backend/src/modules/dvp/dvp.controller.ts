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
import { DvpService } from './dvp.service';
import {
  CreateDvpPlanDto,
  UpdateDvpPlanDto,
  RecordDvpResultDto,
  UpdateDvpResultDto,
  DvpQueryDto,
} from './dto';

/**
 * DVP 관리 컨트롤러
 */
@ApiTags('DVP')
@Controller('dvp')
export class DvpController {
  constructor(private readonly dvpService: DvpService) {}

  // ==================== Plan Endpoints ====================

  /**
   * DVP 계획 생성
   */
  @Post('plans')
  @ApiOperation({
    summary: 'DVP 계획 생성',
    description: '새로운 DVP (Design Validation Plan) 계획을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'DVP 계획 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 계획 ID' })
  async createPlan(@Body() dto: CreateDvpPlanDto) {
    return this.dvpService.createPlan(dto);
  }

  /**
   * DVP 계획 목록 조회
   */
  @Get('plans')
  @ApiOperation({
    summary: 'DVP 계획 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 DVP 계획 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '계획 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/DvpPlan' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllPlans(@Query() query: DvpQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.dvpService.findAllPlans(query);
  }

  /**
   * DVP 계획 단건 조회
   */
  @Get('plans/:planId')
  @ApiOperation({
    summary: 'DVP 계획 상세 조회',
    description: '특정 DVP 계획의 상세 정보와 결과를 조회합니다.',
  })
  @ApiParam({ name: 'planId', description: '계획 ID', example: 'DVP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '계획 조회 성공',
  })
  @ApiResponse({ status: 404, description: '계획을 찾을 수 없음' })
  async findOnePlan(@Param('planId') planId: string) {
    return this.dvpService.findOnePlan(planId);
  }

  /**
   * DVP 계획 수정
   */
  @Put('plans/:planId')
  @ApiOperation({
    summary: 'DVP 계획 수정',
    description: '기존 DVP 계획의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'planId', description: '계획 ID', example: 'DVP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '계획 수정 성공',
  })
  @ApiResponse({ status: 404, description: '계획을 찾을 수 없음' })
  async updatePlan(
    @Param('planId') planId: string,
    @Body() dto: UpdateDvpPlanDto
  ) {
    return this.dvpService.updatePlan(planId, dto);
  }

  /**
   * DVP 계획 삭제
   */
  @Delete('plans/:planId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'DVP 계획 삭제',
    description: 'DVP 계획을 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'planId', description: '계획 ID', example: 'DVP-20240319-001' })
  @ApiResponse({ status: 204, description: '계획 삭제 성공' })
  @ApiResponse({ status: 404, description: '계획을 찾을 수 없음' })
  async deletePlan(
    @Param('planId') planId: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.dvpService.deletePlan(planId, deletedBy);
  }

  // ==================== Result Endpoints ====================

  /**
   * DVP 결과 기록
   */
  @Post('plans/:planId/results')
  @ApiOperation({
    summary: 'DVP 결과 기록',
    description: 'DVP 계획에 대한 시험 결과를 기록합니다.',
  })
  @ApiParam({ name: 'planId', description: '계획 ID', example: 'DVP-20240319-001' })
  @ApiResponse({
    status: 201,
    description: '결과 기록 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 결과 ID' })
  async recordResult(
    @Param('planId') planId: string,
    @Body() dto: RecordDvpResultDto
  ) {
    return this.dvpService.recordResult(planId, dto);
  }

  /**
   * DVP 결과 수정
   */
  @Put('results/:resultId')
  @ApiOperation({
    summary: 'DVP 결과 수정',
    description: '기존 DVP 결과를 수정합니다.',
  })
  @ApiParam({ name: 'resultId', description: '결과 ID', example: 'RESULT-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '결과 수정 성공',
  })
  @ApiResponse({ status: 404, description: '결과를 찾을 수 없음' })
  async updateResult(
    @Param('resultId') resultId: string,
    @Body() dto: UpdateDvpResultDto
  ) {
    return this.dvpService.updateResult(resultId, dto);
  }

  /**
   * DVP 결과 목록 조회 (계획별)
   */
  @Get('plans/:planId/results')
  @ApiOperation({
    summary: 'DVP 결과 목록 조회',
    description: '특정 계획의 모든 결과를 조회합니다.',
  })
  @ApiParam({ name: 'planId', description: '계획 ID', example: 'DVP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '결과 목록 조회 성공',
  })
  async findResultsByPlan(@Param('planId') planId: string) {
    return this.dvpService.findResultsByPlan(planId);
  }

  // ==================== Analysis Endpoints ====================

  /**
   * 검증 상태 조회
   */
  @Get('validation-status')
  @ApiOperation({
    summary: '검증 상태 조회',
    description: '전체 또는 특정 프로젝트의 DVP 검증 상태를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '검증 상태 조회 성공',
    schema: {
      properties: {
        totalPlans: { type: 'number' },
        byCategory: { type: 'object' },
        byResult: { type: 'object' },
        passRate: { type: 'number' },
        inProgressCount: { type: 'number' },
        notStartedCount: { type: 'number' },
        completedCount: { type: 'number' },
        failedCount: { type: 'number' },
      },
    },
  })
  async getValidationStatus(
    @Query('projectNo') projectNo?: string
  ): Promise<{
    totalPlans: number;
    byCategory: Record<string, number>;
    byResult: Record<string, number>;
    passRate: number;
    inProgressCount: number;
    notStartedCount: number;
    completedCount: number;
    failedCount: number;
  }> {
    return this.dvpService.getValidationStatus(projectNo);
  }

  /**
   * DVP 통계 조회
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'DVP 통계 조회',
    description: 'DVP 계획 및 결과 통계 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        totalPlans: { type: 'number' },
        totalResults: { type: 'number' },
        byCategory: { type: 'object' },
        byResult: { type: 'object' },
        averagePassRate: { type: 'number' },
      },
    },
  })
  async getStatistics(): Promise<{
    totalPlans: number;
    totalResults: number;
    byCategory: Record<string, number>;
    byResult: Record<string, number>;
    averagePassRate: number;
  }> {
    return this.dvpService.getStatistics();
  }
}
