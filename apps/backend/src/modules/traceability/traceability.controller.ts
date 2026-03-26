/**
 * @file traceability.controller.ts
 * @description 추적성 관리 컨트롤러
 *
 * 로트 추적 데이터의 CRUD 엔드포인트와
 * Forward/Backward/Genealogy 추적 엔드포인트를 제공합니다.
 *
 * 초보자 가이드:
 * - POST /traceability : 추적 데이터 등록
 * - GET /traceability : 목록 조회 (필터 지원)
 * - GET /traceability/forward/:lotNo : 원자재→완제품 추적
 * - GET /traceability/backward/:lotNo : 완제품→원자재 역추적
 * - GET /traceability/genealogy/:lotNo : 양방향 계보 조회
 * - GET /traceability/:traceId : 단건 상세 조회
 * - PUT /traceability/:traceId : 수정
 * - DELETE /traceability/:traceId : 소프트 삭제
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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TraceabilityService } from './traceability.service';
import { CreateTraceDto, UpdateTraceDto, TraceQueryDto } from './dto';

/**
 * 추적성 관리 컨트롤러
 */
@ApiTags('Traceability')
@Controller('traceability')
export class TraceabilityController {
  constructor(
    private readonly traceabilityService: TraceabilityService,
  ) {}

  /**
   * 추적 데이터 생성
   */
  @Post()
  @ApiOperation({
    summary: '추적 데이터 등록',
    description: '새로운 로트 추적 데이터를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '추적 데이터가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 409, description: '중복된 추적 ID' })
  async createTrace(
    @Body() dto: CreateTraceDto,
  ) {
    return this.traceabilityService.createTrace(dto);
  }

  /**
   * 추적 데이터 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: '추적 데이터 목록 조회',
    description:
      '필터링 및 페이지네이션이 적용된 추적 데이터 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '추적 데이터 목록 조회 성공',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/LotTrace' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllTraces(@Query() query: TraceQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.traceabilityService.findAllTraces(query);
  }

  /**
   * Forward Trace (원자재 → 완제품)
   */
  @Get('forward/:lotNo')
  @ApiOperation({
    summary: 'Forward Trace',
    description:
      '해당 로트가 투입된 모든 하위/출하 로트를 최대 5단계까지 추적합니다.',
  })
  @ApiParam({
    name: 'lotNo',
    description: '추적 시작 로트번호',
    example: 'LOT-20260319-001',
  })
  @ApiResponse({ status: 200, description: 'Forward Trace 조회 성공' })
  async forwardTrace(@Param('lotNo') lotNo: string): Promise<{
    startLotNo: string;
    depth: number;
    traces: Array<{ level: number; items: any[] }>;
  }> {
    return this.traceabilityService.forwardTrace(lotNo);
  }

  /**
   * Backward Trace (완제품 → 원자재)
   */
  @Get('backward/:lotNo')
  @ApiOperation({
    summary: 'Backward Trace',
    description:
      '해당 로트의 모든 상위 원자재 로트를 최대 5단계까지 역추적합니다.',
  })
  @ApiParam({
    name: 'lotNo',
    description: '추적 시작 로트번호',
    example: 'LOT-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Backward Trace 조회 성공',
  })
  async backwardTrace(@Param('lotNo') lotNo: string): Promise<{
    startLotNo: string;
    depth: number;
    traces: Array<{ level: number; items: any[] }>;
  }> {
    return this.traceabilityService.backwardTrace(lotNo);
  }

  /**
   * Genealogy (양방향 계보 조회)
   */
  @Get('genealogy/:lotNo')
  @ApiOperation({
    summary: '계보(Genealogy) 조회',
    description:
      'Forward + Backward 추적을 합쳐 양방향 계보(Family Tree)를 조회합니다.',
  })
  @ApiParam({
    name: 'lotNo',
    description: '기준 로트번호',
    example: 'LOT-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Genealogy 조회 성공',
  })
  async getGenealogy(@Param('lotNo') lotNo: string): Promise<{
    lotNo: string;
    forward: {
      depth: number;
      traces: Array<{ level: number; items: any[] }>;
    };
    backward: {
      depth: number;
      traces: Array<{ level: number; items: any[] }>;
    };
  }> {
    return this.traceabilityService.getGenealogy(lotNo);
  }

  /**
   * 추적 데이터 단건 조회
   */
  @Get(':traceId')
  @ApiOperation({
    summary: '추적 데이터 상세 조회',
    description: '특정 추적 데이터의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'traceId',
    description: '추적 ID',
    example: 'TRC-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '추적 데이터 조회 성공',
  })
  @ApiResponse({ status: 404, description: '추적 데이터를 찾을 수 없음' })
  async findOneTrace(
    @Param('traceId') traceId: string,
  ) {
    return this.traceabilityService.findOneTrace(traceId);
  }

  /**
   * 추적 데이터 수정
   */
  @Put(':traceId')
  @ApiOperation({
    summary: '추적 데이터 수정',
    description: '기존 추적 데이터의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'traceId',
    description: '추적 ID',
    example: 'TRC-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '추적 데이터 수정 성공',
  })
  @ApiResponse({ status: 404, description: '추적 데이터를 찾을 수 없음' })
  async updateTrace(
    @Param('traceId') traceId: string,
    @Body() dto: UpdateTraceDto,
  ) {
    return this.traceabilityService.updateTrace(traceId, dto);
  }

  /**
   * 추적 데이터 삭제 (소프트 삭제)
   */
  @Delete(':traceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '추적 데이터 삭제',
    description: '추적 데이터를 소프트 삭제합니다.',
  })
  @ApiParam({
    name: 'traceId',
    description: '추적 ID',
    example: 'TRC-20260319-001',
  })
  @ApiResponse({ status: 204, description: '추적 데이터 삭제 성공' })
  @ApiResponse({ status: 404, description: '추적 데이터를 찾을 수 없음' })
  async deleteTrace(
    @Param('traceId') traceId: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.traceabilityService.deleteTrace(traceId, deletedBy);
  }
}
