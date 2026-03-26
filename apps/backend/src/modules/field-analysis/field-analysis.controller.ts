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
import { FieldAnalysisService } from './field-analysis.service';
import {
  CreateFieldFailureDto,
  TraceProductionDto,
  AnalyzePatternDto,
  CommonFactorsDto,
  VerifyCountermeasureDto,
  FieldFailureQueryDto,
  UpdateCountermeasureDto,
} from './dto';

/**
 * 필드 불량 분석 컨트롤러
 */
@ApiTags('Field Analysis')
@Controller('field-failures')
export class FieldAnalysisController {
  constructor(private readonly fieldAnalysisService: FieldAnalysisService) {}

  /**
   * 필드 불량 생성
   */
  @Post()
  @ApiOperation({
    summary: '필드 불량 생성',
    description: '새로운 필드 불량을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '필드 불량 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 불량 ID 또는 번호' })
  async createFieldFailure(@Body() dto: CreateFieldFailureDto) {
    return this.fieldAnalysisService.createFieldFailure(dto);
  }

  /**
   * 필드 불량 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: '필드 불량 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 필드 불량 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '필드 불량 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/FieldFailure' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllFailures(@Query() query: FieldFailureQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.fieldAnalysisService.findAllFailures(query);
  }

  /**
   * 필드 불량 단건 조회
   */
  @Get(':failureId')
  @ApiOperation({
    summary: '필드 불량 상세 조회',
    description: '특정 필드 불량의 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'failureId', description: '불량 ID', example: 'FAIL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '필드 불량 조회 성공',
  })
  @ApiResponse({ status: 404, description: '필드 불량을 찾을 수 없음' })
  async findOneFailure(@Param('failureId') failureId: string) {
    return this.fieldAnalysisService.findOneFailure(failureId);
  }

  /**
   * 필드 불량 수정
   */
  @Put(':failureId')
  @ApiOperation({
    summary: '필드 불량 수정',
    description: '기존 필드 불량의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'failureId', description: '불량 ID', example: 'FAIL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '필드 불량 수정 성공',
  })
  @ApiResponse({ status: 404, description: '필드 불량을 찾을 수 없음' })
  async updateFailure(
    @Param('failureId') failureId: string,
    @Body() dto: Partial<CreateFieldFailureDto>
  ) {
    return this.fieldAnalysisService.updateFailure(failureId, dto);
  }

  /**
   * 필드 불량 삭제
   */
  @Delete(':failureId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '필드 불량 삭제',
    description: '필드 불량을 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'failureId', description: '불량 ID', example: 'FAIL-20240319-001' })
  @ApiResponse({ status: 204, description: '필드 불량 삭제 성공' })
  @ApiResponse({ status: 404, description: '필드 불량을 찾을 수 없음' })
  async deleteFailure(
    @Param('failureId') failureId: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.fieldAnalysisService.deleteFailure(failureId, deletedBy);
  }

  /**
   * 생산 이력 추적
   */
  @Get(':failureId/trace')
  @ApiOperation({
    summary: '생산 이력 추적',
    description: '특정 불량의 생산 이력을 추적합니다.',
  })
  @ApiParam({ name: 'failureId', description: '불량 ID', example: 'FAIL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '생산 이력 추적 성공',
    schema: {
      properties: {
        lotNo: { type: 'string' },
        itemCode: { type: 'string' },
        productionDate: { type: 'string' },
        productionLine: { type: 'string' },
        equipmentId: { type: 'string' },
        operatorId: { type: 'string' },
        relatedFailures: { type: 'array' },
      },
    },
  })
  @ApiResponse({ status: 404, description: '추적 정보를 찾을 수 없음' })
  async traceProductionHistory(
    @Param('failureId') failureId: string
  ): Promise<{
    lotNo: string;
    itemCode: string;
    productionDate?: string;
    productionLine?: string;
    equipmentId?: string;
    operatorId?: string;
    relatedFailures?: any[];
  }> {
    const failure = await this.fieldAnalysisService.findOneFailure(failureId);
    if (!failure.lotNo) {
      throw new NotFoundException('No lot number associated with this failure');
    }
    return this.fieldAnalysisService.traceProductionHistory({ lotNo: failure.lotNo });
  }

  /**
   * 패턴 분석
   */
  @Get('analysis/patterns')
  @ApiOperation({
    summary: '불량 패턴 분석',
    description: '기간별 불량 패턴을 분석합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '패턴 분석 성공',
    schema: {
      properties: {
        patterns: { type: 'array' },
        summary: {
          type: 'object',
          properties: {
            totalPatterns: { type: 'number' },
            topFailureMode: { type: 'string' },
            topAffectedItem: { type: 'string' },
            topProductionLine: { type: 'string' },
          },
        },
      },
    },
  })
  async analyzePatterns(@Query() dto: AnalyzePatternDto): Promise<{
    patterns: any[];
    summary: {
      totalPatterns: number;
      topFailureMode: string;
      topAffectedItem: string;
      topProductionLine: string;
    };
  }> {
    return this.fieldAnalysisService.analyzeFailurePatterns(dto);
  }

  /**
   * 공통 요인 분석
   */
  @Get('analysis/common-factors')
  @ApiOperation({
    summary: '공통 요인 분석',
    description: '불량 발생의 공통 요인을 분석합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공통 요인 분석 성공',
    schema: {
      properties: {
        commonFactors: { type: 'array' },
        recommendations: { type: 'array' },
      },
    },
  })
  async getCommonFactors(@Query() dto: CommonFactorsDto): Promise<{
    commonFactors: any[];
    recommendations: string[];
  }> {
    return this.fieldAnalysisService.getCommonFactors(dto);
  }

  /**
   * 대책 효과 검증
   */
  @Post(':failureId/verify-countermeasure')
  @ApiOperation({
    summary: '대책 효과 검증',
    description: '실시된 대책의 효과를 검증합니다.',
  })
  @ApiParam({ name: 'failureId', description: '불량 ID', example: 'FAIL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '대책 효과 검증 성공',
    schema: {
      properties: {
        failureMode: { type: 'string' },
        countermeasureDate: { type: 'string' },
        beforePeriod: { type: 'object' },
        afterPeriod: { type: 'object' },
        improvement: { type: 'object' },
      },
    },
  })
  async verifyCountermeasure(
    @Param('failureId') failureId: string,
    @Body() dto: VerifyCountermeasureDto
  ): Promise<any> {
    return this.fieldAnalysisService.verifyCountermeasureEffectiveness(dto);
  }

  /**
   * 추적성 보고서 생성
   */
  @Get(':failureId/report')
  @ApiOperation({
    summary: '추적성 보고서 생성',
    description: '필드 불량에 대한 전체 추적성 보고서를 생성합니다.',
  })
  @ApiParam({ name: 'failureId', description: '불량 ID', example: 'FAIL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '보고서 생성 성공',
    schema: {
      properties: {
        failure: { type: 'object' },
        traceability: { type: 'object' },
        relatedFailures: { type: 'array' },
        recommendations: { type: 'array' },
      },
    },
  })
  async generateTraceabilityReport(@Param('failureId') failureId: string): Promise<any> {
    return this.fieldAnalysisService.generateTraceabilityReport(failureId);
  }

  /**
   * 대책 업데이트
   */
  @Put(':failureId/countermeasure')
  @ApiOperation({
    summary: '대책 업데이트',
    description: '필드 불량의 대책을 업데이트합니다.',
  })
  @ApiParam({ name: 'failureId', description: '불량 ID', example: 'FAIL-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '대책 업데이트 성공',
  })
  async updateCountermeasure(
    @Param('failureId') failureId: string,
    @Body() dto: UpdateCountermeasureDto
  ) {
    return this.fieldAnalysisService.updateCountermeasure(failureId, dto);
  }
}

// Import NotFoundException
import { NotFoundException } from '@nestjs/common';
