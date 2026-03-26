/**
 * @file hr.controller.ts
 * @description HR(인적자원 관리) 컨트롤러
 *
 * 직원 역량/자격 관리 및 교육 이력 관리 API를 제공합니다.
 *
 * 역량 관리:
 * - POST   /hr/competencies           : 역량 등록
 * - GET    /hr/competencies           : 역량 목록 조회
 * - GET    /hr/competencies/:id       : 역량 상세 조회
 * - PUT    /hr/competencies/:id       : 역량 수정
 * - DELETE /hr/competencies/:id       : 역량 삭제
 * - GET    /hr/competency-matrix      : 역량 매트릭스
 * - GET    /hr/expiring-certifications: 만료 예정 자격
 *
 * 교육 관리:
 * - POST   /hr/training               : 교육 등록
 * - GET    /hr/training               : 교육 목록 조회
 * - GET    /hr/training/upcoming      : 예정 교육 목록
 * - GET    /hr/training/:id           : 교육 상세 조회
 * - PUT    /hr/training/:id           : 교육 수정
 * - DELETE /hr/training/:id           : 교육 삭제
 *
 * 통계:
 * - GET    /hr/statistics             : HR 통계
 */
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { HrCompetencyService } from './hr-competency.service';
import { HrTrainingService } from './hr-training.service';
import {
  CreateCompetencyDto,
  UpdateCompetencyDto,
  CompetencyQueryDto,
  CreateTrainingDto,
  UpdateTrainingDto,
  TrainingQueryDto,
} from './dto';

/**
 * HR 컨트롤러
 */
@ApiTags('Human Resources')
@Controller('hr')
export class HrController {
  constructor(
    private readonly competencyService: HrCompetencyService,
    private readonly trainingService: HrTrainingService,
  ) {}

  // ─── 역량 관리 ──────────────────────────────────────────

  /**
   * 역량 등록
   */
  @Post('competencies')
  @ApiOperation({
    summary: '역량 등록',
    description: '새로운 직원 역량/자격 정보를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '역량이 성공적으로 등록되었습니다.',
  })
  @ApiResponse({ status: 409, description: '중복된 역량 ID' })
  async createCompetency(
    @Body() dto: CreateCompetencyDto,
  ) {
    return this.competencyService.createCompetency(dto);
  }

  /**
   * 역량 목록 조회
   */
  @Get('competencies')
  @ApiOperation({
    summary: '역량 목록 조회',
    description:
      '필터링 및 페이지네이션이 적용된 역량 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '역량 목록 조회 성공' })
  async findAllCompetencies(@Query() query: CompetencyQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.competencyService.findAllCompetencies(query);
  }

  /**
   * 역량 매트릭스 조회
   */
  @Get('competency-matrix')
  @ApiOperation({
    summary: '역량 매트릭스',
    description: '부서별/공정별 역량 현황 매트릭스를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '역량 매트릭스 조회 성공' })
  async getCompetencyMatrix() {
    return this.competencyService.getCompetencyMatrix();
  }

  /**
   * 만료 예정 자격 조회
   */
  @Get('expiring-certifications')
  @ApiOperation({
    summary: '만료 예정 자격 조회',
    description:
      '지정된 기간 내 만료 예정인 자격증 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'daysAhead',
    required: false,
    type: Number,
    description: '만료까지 남은 일수 (기본값: 30)',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: '만료 예정 자격 조회 성공',
  })
  async getExpiringCertifications(
    @Query('daysAhead') daysAhead?: number,
  ) {
    return this.competencyService.getExpiringCertifications(
      daysAhead ? Number(daysAhead) : 30,
    );
  }

  /**
   * 역량 상세 조회
   */
  @Get('competencies/:competencyId')
  @ApiOperation({
    summary: '역량 상세 조회',
    description: '특정 역량의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'competencyId',
    description: '역량 ID',
    example: 'COMP-EMP-001',
  })
  @ApiResponse({ status: 200, description: '역량 조회 성공' })
  @ApiResponse({ status: 404, description: '역량을 찾을 수 없음' })
  async findOneCompetency(
    @Param('competencyId') competencyId: string,
  ) {
    return this.competencyService.findOneCompetency(competencyId);
  }

  /**
   * 역량 수정
   */
  @Put('competencies/:competencyId')
  @ApiOperation({
    summary: '역량 수정',
    description: '기존 역량 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'competencyId',
    description: '역량 ID',
    example: 'COMP-EMP-001',
  })
  @ApiResponse({ status: 200, description: '역량 수정 성공' })
  @ApiResponse({ status: 404, description: '역량을 찾을 수 없음' })
  async updateCompetency(
    @Param('competencyId') competencyId: string,
    @Body() dto: UpdateCompetencyDto,
  ) {
    return this.competencyService.updateCompetency(competencyId, dto);
  }

  /**
   * 역량 삭제
   */
  @Delete('competencies/:competencyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '역량 삭제',
    description: '역량을 소프트 삭제합니다.',
  })
  @ApiParam({
    name: 'competencyId',
    description: '역량 ID',
    example: 'COMP-EMP-001',
  })
  @ApiResponse({ status: 204, description: '역량 삭제 성공' })
  @ApiResponse({ status: 404, description: '역량을 찾을 수 없음' })
  async deleteCompetency(
    @Param('competencyId') competencyId: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.competencyService.deleteCompetency(
      competencyId,
      deletedBy,
    );
  }

  // ─── 교육 관리 ──────────────────────────────────────────

  /**
   * 교육 등록
   */
  @Post('training')
  @ApiOperation({
    summary: '교육 등록',
    description: '새로운 교육 이력을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '교육이 성공적으로 등록되었습니다.',
  })
  @ApiResponse({ status: 409, description: '중복된 교육 ID' })
  async createTraining(
    @Body() dto: CreateTrainingDto,
  ) {
    return this.trainingService.createTraining(dto);
  }

  /**
   * 교육 목록 조회
   */
  @Get('training')
  @ApiOperation({
    summary: '교육 목록 조회',
    description:
      '필터링 및 페이지네이션이 적용된 교육 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '교육 목록 조회 성공' })
  async findAllTrainings(@Query() query: TrainingQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.trainingService.findAllTrainings(query);
  }

  /**
   * 예정 교육 목록 조회
   */
  @Get('training/upcoming')
  @ApiOperation({
    summary: '예정 교육 목록',
    description: '아직 진행되지 않은 예정 교육 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '예정 교육 조회 성공' })
  async getUpcomingTrainings() {
    return this.trainingService.getUpcomingTrainings();
  }

  /**
   * 교육 상세 조회
   */
  @Get('training/:trainingId')
  @ApiOperation({
    summary: '교육 상세 조회',
    description: '특정 교육의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'trainingId',
    description: '교육 ID',
    example: 'TRN-2024-001',
  })
  @ApiResponse({ status: 200, description: '교육 조회 성공' })
  @ApiResponse({ status: 404, description: '교육을 찾을 수 없음' })
  async findOneTraining(
    @Param('trainingId') trainingId: string,
  ) {
    return this.trainingService.findOneTraining(trainingId);
  }

  /**
   * 교육 수정
   */
  @Put('training/:trainingId')
  @ApiOperation({
    summary: '교육 수정',
    description: '기존 교육 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'trainingId',
    description: '교육 ID',
    example: 'TRN-2024-001',
  })
  @ApiResponse({ status: 200, description: '교육 수정 성공' })
  @ApiResponse({ status: 404, description: '교육을 찾을 수 없음' })
  async updateTraining(
    @Param('trainingId') trainingId: string,
    @Body() dto: UpdateTrainingDto,
  ) {
    return this.trainingService.updateTraining(trainingId, dto);
  }

  /**
   * 교육 삭제
   */
  @Delete('training/:trainingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '교육 삭제',
    description: '교육을 소프트 삭제합니다.',
  })
  @ApiParam({
    name: 'trainingId',
    description: '교육 ID',
    example: 'TRN-2024-001',
  })
  @ApiResponse({ status: 204, description: '교육 삭제 성공' })
  @ApiResponse({ status: 404, description: '교육을 찾을 수 없음' })
  async deleteTraining(
    @Param('trainingId') trainingId: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.trainingService.deleteTraining(trainingId, deletedBy);
  }

  // ─── 통계 ──────────────────────────────────────────────

  /**
   * HR 통계 조회 (역량 레벨 분포 + 교육 현황)
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'HR 통계',
    description: '역량 레벨 분포 및 교육 현황 통계를 조회합니다.',
  })
  @ApiResponse({ status: 200, description: '통계 조회 성공' })
  async getStatistics(): Promise<{
    competencyLevelDistribution: Array<{
      level: string;
      count: number;
    }>;
    trainingStatistics: {
      byStatus: Array<{ status: string; count: number }>;
      byType: Array<{ type: string; count: number }>;
      completionRate: number;
      avgScore: number;
    };
  }> {
    const [levelDistribution, trainingStats] = await Promise.all([
      this.competencyService.getLevelDistribution(),
      this.trainingService.getTrainingStatistics(),
    ]);

    return {
      competencyLevelDistribution: levelDistribution,
      trainingStatistics: trainingStats,
    };
  }
}
