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
import { ApqpService } from './apqp.service';
import {
  CreateApqpProjectDto,
  UpdateApqpProjectDto,
  CreatePhaseDto,
  UpdatePhaseDto,
  SubmitDeliverableDto,
  ApproveDeliverableDto,
  CreateDeliverableDto,
  ApprovePhaseDto,
  RejectPhaseDto,
  ApqpQueryDto,
  PhaseQueryDto,
} from './dto';

/**
 * APQP 관리 컨트롤러
 */
@ApiTags('APQP')
@Controller('apqp')
export class ApqpController {
  constructor(private readonly apqpService: ApqpService) {}

  // ==================== Project Endpoints ====================

  /**
   * APQP 프로젝트 생성
   */
  @Post('projects')
  @ApiOperation({
    summary: 'APQP 프로젝트 생성',
    description: '새로운 APQP 프로젝트를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'APQP 프로젝트 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 프로젝트 번호' })
  async createProject(@Body() dto: CreateApqpProjectDto) {
    return this.apqpService.createProject(dto);
  }

  /**
   * APQP 프로젝트 목록 조회
   */
  @Get('projects')
  @ApiOperation({
    summary: 'APQP 프로젝트 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 APQP 프로젝트 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '프로젝트 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/ApqpProject' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllProjects(@Query() query: ApqpQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.apqpService.findAllProjects(query);
  }

  /**
   * APQP 프로젝트 단건 조회
   */
  @Get('projects/:projectNo')
  @ApiOperation({
    summary: 'APQP 프로젝트 상세 조회',
    description: '특정 APQP 프로젝트의 상세 정보와 단계, 산출물을 조회합니다.',
  })
  @ApiParam({ name: 'projectNo', description: '프로젝트 번호', example: 'APQP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '프로젝트 조회 성공',
  })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  async findOneProject(@Param('projectNo') projectNo: string) {
    return this.apqpService.findOneProject(projectNo);
  }

  /**
   * APQP 프로젝트 수정
   */
  @Put('projects/:projectNo')
  @ApiOperation({
    summary: 'APQP 프로젝트 수정',
    description: '기존 APQP 프로젝트의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'projectNo', description: '프로젝트 번호', example: 'APQP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '프로젝트 수정 성공',
  })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  async updateProject(
    @Param('projectNo') projectNo: string,
    @Body() dto: UpdateApqpProjectDto
  ) {
    return this.apqpService.updateProject(projectNo, dto);
  }

  /**
   * APQP 프로젝트 삭제
   */
  @Delete('projects/:projectNo')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'APQP 프로젝트 삭제',
    description: 'APQP 프로젝트를 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'projectNo', description: '프로젝트 번호', example: 'APQP-20240319-001' })
  @ApiResponse({ status: 204, description: '프로젝트 삭제 성공' })
  @ApiResponse({ status: 404, description: '프로젝트를 찾을 수 없음' })
  async deleteProject(
    @Param('projectNo') projectNo: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.apqpService.deleteProject(projectNo, deletedBy);
  }

  // ==================== Phase Endpoints ====================

  /**
   * APQP 단계 생성
   */
  @Post('projects/:projectNo/phases')
  @ApiOperation({
    summary: 'APQP 단계 생성',
    description: '프로젝트에 새로운 단계를 추가합니다.',
  })
  @ApiParam({ name: 'projectNo', description: '프로젝트 번호', example: 'APQP-20240319-001' })
  @ApiResponse({
    status: 201,
    description: '단계 생성 성공',
  })
  async createPhase(
    @Param('projectNo') projectNo: string,
    @Body() dto: CreatePhaseDto
  ) {
    return this.apqpService.createPhase(projectNo, dto);
  }

  /**
   * APQP 단계 목록 조회
   */
  @Get('projects/:projectNo/phases')
  @ApiOperation({
    summary: 'APQP 단계 목록 조회',
    description: '프로젝트의 모든 단계를 조회합니다.',
  })
  @ApiParam({ name: 'projectNo', description: '프로젝트 번호', example: 'APQP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '단계 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/ApqpPhase' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findPhasesByProject(
    @Param('projectNo') projectNo: string,
    @Query() query: PhaseQueryDto
  ): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.apqpService.findPhasesByProject(projectNo, query);
  }

  /**
   * APQP 단계 수정
   */
  @Put('phases/:phaseId')
  @ApiOperation({
    summary: 'APQP 단계 수정',
    description: '기존 APQP 단계의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'phaseId', description: '단계 ID', example: 'PHASE-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '단계 수정 성공',
  })
  async updatePhase(
    @Param('phaseId') phaseId: string,
    @Body() dto: UpdatePhaseDto
  ) {
    return this.apqpService.updatePhase(phaseId, dto);
  }

  /**
   * APQP 단계 승인
   */
  @Post('phases/:phaseId/approve')
  @ApiOperation({
    summary: 'APQP 단계 승인',
    description: 'APQP 단계를 승인합니다. 모든 필수 산출물이 제출되어야 합니다.',
  })
  @ApiParam({ name: 'phaseId', description: '단계 ID', example: 'PHASE-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '단계 승인 성공',
  })
  async approvePhase(
    @Param('phaseId') phaseId: string,
    @Body() dto: ApprovePhaseDto
  ) {
    return this.apqpService.approvePhase(phaseId, dto);
  }

  /**
   * APQP 단계 반려
   */
  @Post('phases/:phaseId/reject')
  @ApiOperation({
    summary: 'APQP 단계 반려',
    description: 'APQP 단계를 반려합니다.',
  })
  @ApiParam({ name: 'phaseId', description: '단계 ID', example: 'PHASE-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '단계 반려 성공',
  })
  async rejectPhase(
    @Param('phaseId') phaseId: string,
    @Body() dto: RejectPhaseDto
  ) {
    return this.apqpService.rejectPhase(phaseId, dto);
  }

  // ==================== Deliverable Endpoints ====================

  /**
   * 산출물 생성
   */
  @Post('phases/:phaseId/deliverables')
  @ApiOperation({
    summary: '산출물 생성',
    description: '단계에 새로운 산출물을 추가합니다.',
  })
  @ApiParam({ name: 'phaseId', description: '단계 ID', example: 'PHASE-20240319-001' })
  @ApiResponse({
    status: 201,
    description: '산출물 생성 성공',
  })
  async createDeliverable(
    @Param('phaseId') phaseId: string,
    @Body() dto: CreateDeliverableDto
  ) {
    return this.apqpService.createDeliverable(phaseId, dto);
  }

  /**
   * 산출물 제출
   */
  @Post('phases/:phaseId/deliverables/:deliverableId/submit')
  @ApiOperation({
    summary: '산출물 제출',
    description: '산출물을 제출합니다.',
  })
  @ApiParam({ name: 'phaseId', description: '단계 ID', example: 'PHASE-20240319-001' })
  @ApiParam({ name: 'deliverableId', description: '산출물 ID', example: 'DEL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '산출물 제출 성공',
  })
  async submitDeliverable(
    @Param('phaseId') phaseId: string,
    @Param('deliverableId') deliverableId: string,
    @Body() dto: SubmitDeliverableDto
  ) {
    return this.apqpService.submitDeliverable(phaseId, deliverableId, dto);
  }

  /**
   * 산출물 승인
   */
  @Post('phases/:phaseId/deliverables/:deliverableId/approve')
  @ApiOperation({
    summary: '산출물 승인',
    description: '제출된 산출물을 승인합니다.',
  })
  @ApiParam({ name: 'phaseId', description: '단계 ID', example: 'PHASE-20240319-001' })
  @ApiParam({ name: 'deliverableId', description: '산출물 ID', example: 'DEL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '산출물 승인 성공',
  })
  async approveDeliverable(
    @Param('phaseId') phaseId: string,
    @Param('deliverableId') deliverableId: string,
    @Body() dto: ApproveDeliverableDto
  ) {
    return this.apqpService.approveDeliverable(phaseId, deliverableId, dto);
  }

  // ==================== Analysis Endpoints ====================

  /**
   * 타겟 vs 실적 비교
   */
  @Get('projects/:projectNo/comparison')
  @ApiOperation({
    summary: '타겟 vs 실적 비교',
    description: '프로젝트의 목표 품질 수준과 실적 품질 수준을 비교합니다.',
  })
  @ApiParam({ name: 'projectNo', description: '프로젝트 번호', example: 'APQP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '비교 데이터 조회 성공',
    schema: {
      properties: {
        project: { $ref: '#/components/schemas/ApqpProject' },
        comparison: { type: 'array' },
        overallTarget: { type: 'number' },
        overallActual: { type: 'number' },
        overallVariance: { type: 'number' },
      },
    },
  })
  async compareTargetVsActual(@Param('projectNo') projectNo: string): Promise<{
    project: any;
    comparison: Array<{
      phaseId: string;
      phaseName: string;
      phaseType: string;
      targetQualityLevel: number | null;
      actualQualityLevel: number | null;
      variance: number | null;
      status: string;
    }>;
    overallTarget: number | null;
    overallActual: number | null;
    overallVariance: number | null;
  }> {
    return this.apqpService.compareTargetVsActual(projectNo);
  }

  /**
   * 프로젝트 타임라인
   */
  @Get('projects/:projectNo/timeline')
  @ApiOperation({
    summary: '프로젝트 타임라인',
    description: 'Gantt 차트용 프로젝트 타임라인 데이터를 조회합니다.',
  })
  @ApiParam({ name: 'projectNo', description: '프로젝트 번호', example: 'APQP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '타임라인 데이터 조회 성공',
    schema: {
      properties: {
        project: { $ref: '#/components/schemas/ApqpProject' },
        timeline: { type: 'array' },
      },
    },
  })
  async getProjectTimeline(@Param('projectNo') projectNo: string): Promise<{
    project: any;
    timeline: Array<{
      phaseId: string;
      phaseName: string;
      phaseType: string;
      plannedStart: Date | null;
      plannedEnd: Date | null;
      actualStart: Date | null;
      actualEnd: Date | null;
      duration: number | null;
      delay: number | null;
      status: string;
    }>;
  }> {
    return this.apqpService.getProjectTimeline(projectNo);
  }

  /**
   * APQP 통계 조회
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'APQP 통계 조회',
    description: 'APQP 프로젝트 통계 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        totalProjects: { type: 'number' },
        byStatus: { type: 'object' },
        activeProjects: { type: 'number' },
        completedProjects: { type: 'number' },
        delayedProjects: { type: 'number' },
      },
    },
  })
  async getStatistics(): Promise<{
    totalProjects: number;
    byStatus: Record<string, number>;
    activeProjects: number;
    completedProjects: number;
    delayedProjects: number;
  }> {
    return this.apqpService.getStatistics();
  }
}
