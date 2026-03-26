/**
 * @file supplier.controller.ts
 * @description 공급업체 품질 관리 컨트롤러
 *
 * 공급업체 평가(Evaluation)와 SCAR(시정 조치 요구서)를 관리하는 API를 제공합니다.
 *
 * **평가 API:**
 * - POST   /suppliers/evaluations          - 평가 등록
 * - GET    /suppliers/evaluations          - 평가 목록
 * - GET    /suppliers/evaluations/:id      - 평가 상세
 * - PUT    /suppliers/evaluations/:id      - 평가 수정
 * - GET    /suppliers/scorecard/:code      - 스코어카드
 *
 * **SCAR API:**
 * - POST   /suppliers/scar                - SCAR 발행
 * - GET    /suppliers/scar                - SCAR 목록
 * - GET    /suppliers/scar/:id            - SCAR 상세
 * - PUT    /suppliers/scar/:id            - SCAR 수정
 * - POST   /suppliers/scar/:id/close      - SCAR 종결
 *
 * **통계:**
 * - GET    /suppliers/statistics           - 등급분포, 평균 PPM
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SupplierEvaluationService } from './supplier-evaluation.service';
import { SupplierScarService } from './supplier-scar.service';
import {
  CreateEvaluationDto,
  UpdateEvaluationDto,
  EvaluationQueryDto,
  CreateScarDto,
  UpdateScarDto,
  ScarQueryDto,
  CloseScarDto,
} from './dto';

/**
 * 공급업체 품질 관리 컨트롤러
 */
@ApiTags('Supplier Quality')
@Controller('suppliers')
export class SupplierController {
  constructor(
    private readonly evalService: SupplierEvaluationService,
    private readonly scarService: SupplierScarService,
  ) {}

  // ─── 평가(Evaluation) API ────────────────────────────────

  /** 평가 등록 */
  @Post('evaluations')
  @ApiOperation({ summary: '공급업체 평가 등록', description: '새로운 공급업체 평가를 등록합니다.' })
  @ApiResponse({ status: 201, description: '평가 등록 성공' })
  @ApiResponse({ status: 409, description: '중복된 평가 ID' })
  async createEvaluation(@Body() dto: CreateEvaluationDto) {
    return this.evalService.createEvaluation(dto);
  }

  /** 평가 목록 조회 */
  @Get('evaluations')
  @ApiOperation({ summary: '평가 목록 조회', description: '필터링/페이지네이션이 적용된 평가 목록을 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '평가 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/SupplierEvaluation' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllEvaluations(@Query() query: EvaluationQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.evalService.findAllEvaluations(query);
  }

  /** 평가 상세 조회 */
  @Get('evaluations/:evaluationId')
  @ApiOperation({ summary: '평가 상세 조회', description: '특정 평가의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'evaluationId', description: '평가 ID', example: 'EVAL-2024-Q1-001' })
  @ApiResponse({ status: 200, description: '평가 조회 성공' })
  @ApiResponse({ status: 404, description: '평가를 찾을 수 없음' })
  async findOneEvaluation(@Param('evaluationId') evaluationId: string) {
    return this.evalService.findOneEvaluation(evaluationId);
  }

  /** 평가 수정 */
  @Put('evaluations/:evaluationId')
  @ApiOperation({ summary: '평가 수정', description: '기존 평가 정보를 수정합니다.' })
  @ApiParam({ name: 'evaluationId', description: '평가 ID', example: 'EVAL-2024-Q1-001' })
  @ApiResponse({ status: 200, description: '평가 수정 성공' })
  @ApiResponse({ status: 404, description: '평가를 찾을 수 없음' })
  async updateEvaluation(
    @Param('evaluationId') evaluationId: string,
    @Body() dto: UpdateEvaluationDto,
  ) {
    return this.evalService.updateEvaluation(evaluationId, dto);
  }

  /** 스코어카드 조회 */
  @Get('scorecard/:supplierCode')
  @ApiOperation({ summary: '스코어카드 조회', description: '특정 공급업체의 최근 평가 + 이력을 조회합니다.' })
  @ApiParam({ name: 'supplierCode', description: '공급업체 코드', example: 'SUP-001' })
  @ApiResponse({
    status: 200,
    description: '스코어카드 조회 성공',
    schema: {
      properties: {
        latest: { $ref: '#/components/schemas/SupplierEvaluation' },
        history: { type: 'array', items: { $ref: '#/components/schemas/SupplierEvaluation' } },
      },
    },
  })
  async getScorecard(@Param('supplierCode') supplierCode: string): Promise<{
    latest: any;
    history: any[];
  }> {
    return this.evalService.getScorecard(supplierCode);
  }

  // ─── SCAR API ────────────────────────────────────────────

  /** SCAR 발행 */
  @Post('scar')
  @ApiOperation({ summary: 'SCAR 발행', description: '새로운 SCAR을 발행합니다.' })
  @ApiResponse({ status: 201, description: 'SCAR 발행 성공' })
  @ApiResponse({ status: 409, description: '중복된 SCAR ID 또는 번호' })
  async createScar(@Body() dto: CreateScarDto) {
    return this.scarService.createScar(dto);
  }

  /** SCAR 목록 조회 */
  @Get('scar')
  @ApiOperation({ summary: 'SCAR 목록 조회', description: '필터링/페이지네이션이 적용된 SCAR 목록을 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: 'SCAR 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/Scar' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllScars(@Query() query: ScarQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.scarService.findAllScars(query);
  }

  /** SCAR 상세 조회 */
  @Get('scar/:scarId')
  @ApiOperation({ summary: 'SCAR 상세 조회', description: '특정 SCAR의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'scarId', description: 'SCAR ID', example: 'SCAR-2024-001' })
  @ApiResponse({ status: 200, description: 'SCAR 조회 성공' })
  @ApiResponse({ status: 404, description: 'SCAR을 찾을 수 없음' })
  async findOneScar(@Param('scarId') scarId: string) {
    return this.scarService.findOneScar(scarId);
  }

  /** SCAR 수정 (공급업체 응답 포함) */
  @Put('scar/:scarId')
  @ApiOperation({ summary: 'SCAR 수정', description: 'SCAR 정보를 수정합니다. 공급업체 응답 기록도 포함됩니다.' })
  @ApiParam({ name: 'scarId', description: 'SCAR ID', example: 'SCAR-2024-001' })
  @ApiResponse({ status: 200, description: 'SCAR 수정 성공' })
  @ApiResponse({ status: 404, description: 'SCAR을 찾을 수 없음' })
  async updateScar(
    @Param('scarId') scarId: string,
    @Body() dto: UpdateScarDto,
  ) {
    return this.scarService.updateScar(scarId, dto);
  }

  /** SCAR 종결 */
  @Post('scar/:scarId/close')
  @ApiOperation({ summary: 'SCAR 종결', description: 'ACCEPTED 상태의 SCAR을 종결합니다.' })
  @ApiParam({ name: 'scarId', description: 'SCAR ID', example: 'SCAR-2024-001' })
  @ApiResponse({ status: 200, description: 'SCAR 종결 성공' })
  @ApiResponse({ status: 404, description: 'SCAR을 찾을 수 없음' })
  @ApiResponse({ status: 409, description: 'ACCEPTED 상태가 아닌 SCAR' })
  async closeScar(
    @Param('scarId') scarId: string,
    @Body() dto: CloseScarDto,
  ) {
    return this.scarService.closeScar(scarId, dto);
  }

  // ─── 통계 API ────────────────────────────────────────────

  /** 통계 - 등급분포, 평균 PPM */
  @Get('statistics')
  @ApiOperation({ summary: '공급업체 통계', description: '등급 분포 및 평균 PPM 통계를 조회합니다.' })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        gradeDistribution: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              grade: { type: 'string' },
              count: { type: 'number' },
            },
          },
        },
        avgPpm: { type: 'number' },
        totalSuppliers: { type: 'number' },
      },
    },
  })
  async getStatistics(): Promise<{
    gradeDistribution: Array<{ grade: string; count: number }>;
    avgPpm: number;
    totalSuppliers: number;
  }> {
    return this.evalService.getStatistics();
  }
}
