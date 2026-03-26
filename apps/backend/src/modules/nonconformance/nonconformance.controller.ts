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
import { NonconformanceService } from './nonconformance.service';
import {
  CreateNcrDto,
  UpdateNcrDto,
  CreateMrbReviewDto,
  ExecuteDispositionDto,
  NcrQueryDto,
} from './dto';
import { NcrStatus } from './entities/ncr.entity';

/**
 * 부적합 관리 컨트롤러
 */
@ApiTags('Nonconformance')
@Controller('ncr')
export class NonconformanceController {
  constructor(private readonly nonconformanceService: NonconformanceService) {}

  /**
   * NCR 생성
   */
  @Post('ncrs')
  @ApiOperation({
    summary: 'NCR 생성',
    description: '새로운 부적합 보고서를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'NCR 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 NCR 번호' })
  async createNcr(@Body() dto: CreateNcrDto) {
    return this.nonconformanceService.createNcr(dto);
  }

  /**
   * NCR 목록 조회
   */
  @Get('ncrs')
  @ApiOperation({
    summary: 'NCR 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 NCR 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'NCR 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/Ncr' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllNcrs(@Query() query: NcrQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.nonconformanceService.findAllNcrs(query);
  }

  /**
   * NCR 단건 조회
   */
  @Get('ncrs/:ncrNo')
  @ApiOperation({
    summary: 'NCR 상세 조회',
    description: '특정 NCR의 상세 정보와 MRB 심의 내역을 조회합니다.',
  })
  @ApiParam({ name: 'ncrNo', description: 'NCR 번호', example: 'NCR-20240319-001' })
  @ApiResponse({
    status: 200,
    description: 'NCR 조회 성공',
  })
  @ApiResponse({ status: 404, description: 'NCR을 찾을 수 없음' })
  async findOneNcr(@Param('ncrNo') ncrNo: string) {
    return this.nonconformanceService.findOneNcr(ncrNo);
  }

  /**
   * NCR 수정
   */
  @Put('ncrs/:ncrNo')
  @ApiOperation({
    summary: 'NCR 수정',
    description: '기존 NCR의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'ncrNo', description: 'NCR 번호', example: 'NCR-20240319-001' })
  @ApiResponse({
    status: 200,
    description: 'NCR 수정 성공',
  })
  @ApiResponse({ status: 404, description: 'NCR을 찾을 수 없음' })
  @ApiResponse({ status: 400, description: '종결된 NCR은 수정 불가' })
  async updateNcr(
    @Param('ncrNo') ncrNo: string,
    @Body() dto: UpdateNcrDto
  ) {
    return this.nonconformanceService.updateNcr(ncrNo, dto);
  }

  /**
   * NCR 삭제
   */
  @Delete('ncrs/:ncrNo')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'NCR 삭제',
    description: 'NCR을 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'ncrNo', description: 'NCR 번호', example: 'NCR-20240319-001' })
  @ApiResponse({ status: 204, description: 'NCR 삭제 성공' })
  @ApiResponse({ status: 404, description: 'NCR을 찾을 수 없음' })
  async deleteNcr(
    @Param('ncrNo') ncrNo: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.nonconformanceService.deleteNcr(ncrNo, deletedBy);
  }

  /**
   * MRB 심의 생성
   */
  @Post('mrb-reviews')
  @ApiOperation({
    summary: 'MRB 심의 생성',
    description: 'NCR에 대한 MRB 심의를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'MRB 심의 생성 성공',
  })
  @ApiResponse({ status: 404, description: 'NCR을 찾을 수 없음' })
  async createMrbReview(@Body() dto: CreateMrbReviewDto) {
    return this.nonconformanceService.createMrbReview(dto);
  }

  /**
   * NCR별 MRB 심의 목록 조회
   */
  @Get('ncrs/:ncrNo/mrb-reviews')
  @ApiOperation({
    summary: 'NCR별 MRB 심의 목록',
    description: '특정 NCR에 대한 모든 MRB 심의 내역을 조회합니다.',
  })
  @ApiParam({ name: 'ncrNo', description: 'NCR 번호', example: 'NCR-20240319-001' })
  @ApiResponse({
    status: 200,
    description: 'MRB 심의 목록 조회 성공',
  })
  async findMrbReviewsByNcr(@Param('ncrNo') ncrNo: string) {
    return this.nonconformanceService.findMrbReviewsByNcr(ncrNo);
  }

  /**
   * MRB 심의 승인
   */
  @Post('mrb-reviews/:reviewId/approve')
  @ApiOperation({
    summary: 'MRB 심의 승인',
    description: 'MRB 심의를 승인합니다.',
  })
  @ApiParam({ name: 'reviewId', description: '심의 ID', example: 'MRB-20240319-001-01' })
  @ApiQuery({
    name: 'approvedBy',
    description: '승인자',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'MRB 심의 승인 성공',
  })
  async approveMrbReview(
    @Param('reviewId') reviewId: string,
    @Query('approvedBy') approvedBy: string
  ) {
    return this.nonconformanceService.approveMrbReview(reviewId, approvedBy);
  }

  /**
   * MRB 심의 반려
   */
  @Post('mrb-reviews/:reviewId/reject')
  @ApiOperation({
    summary: 'MRB 심의 반려',
    description: 'MRB 심의를 반려합니다.',
  })
  @ApiParam({ name: 'reviewId', description: '심의 ID', example: 'MRB-20240319-001-01' })
  @ApiQuery({
    name: 'reason',
    description: '반려 사유',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'MRB 심의 반려 성공',
  })
  async rejectMrbReview(
    @Param('reviewId') reviewId: string,
    @Query('reason') reason?: string
  ) {
    return this.nonconformanceService.rejectMrbReview(reviewId, reason);
  }

  /**
   * 처분 실행
   */
  @Put('mrb-reviews/:reviewId/disposition')
  @ApiOperation({
    summary: '처분 실행',
    description: '승인된 MRB 처분을 실행합니다.',
  })
  @ApiParam({ name: 'reviewId', description: '심의 ID', example: 'MRB-20240319-001-01' })
  @ApiResponse({
    status: 200,
    description: '처분 실행 성공',
  })
  @ApiResponse({ status: 400, description: '승인되지 않은 심의' })
  async executeDisposition(
    @Param('reviewId') reviewId: string,
    @Body() dto: ExecuteDispositionDto
  ) {
    return this.nonconformanceService.executeDisposition(reviewId, dto);
  }

  /**
   * NCR 종결
   */
  @Post('ncrs/:ncrNo/close')
  @ApiOperation({
    summary: 'NCR 종결',
    description: 'NCR을 종결 처리합니다.',
  })
  @ApiParam({ name: 'ncrNo', description: 'NCR 번호', example: 'NCR-20240319-001' })
  @ApiQuery({
    name: 'closedBy',
    description: '종결자',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'NCR 종결 성공',
  })
  @ApiResponse({ status: 400, description: '처리되지 않은 MRB 심의 있음' })
  async closeNcr(
    @Param('ncrNo') ncrNo: string,
    @Query('closedBy') closedBy: string,
    @Body() options?: {
      rootCause?: string;
      correctiveAction?: string;
      preventiveAction?: string;
    }
  ) {
    return this.nonconformanceService.closeNcr(ncrNo, closedBy, options);
  }

  /**
   * NCR 통계 조회
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'NCR 통계 조회',
    description: 'NCR 통계 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        totalNcrs: { type: 'number' },
        byStatus: { type: 'object' },
        byDefectType: { type: 'object' },
        bySource: { type: 'object' },
        openNcrs: { type: 'number' },
        closedNcrs: { type: 'number' },
      },
    },
  })
  async getStatistics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('source') source?: string
  ): Promise<{
    totalNcrs: number;
    byStatus: Record<NcrStatus, number>;
    byDefectType: Record<string, number>;
    bySource: Record<string, number>;
    openNcrs: number;
    closedNcrs: number;
  }> {
    return this.nonconformanceService.getStatistics({
      dateFrom,
      dateTo,
      source: source as any,
    });
  }
}
