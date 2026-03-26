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
import { WarrantyService } from './warranty.service';
import {
  CreateWarrantyRecordDto,
  UpdateWarrantyRecordDto,
  WarrantyQueryDto,
  RecordWarrantyClaimDto,
  CalculatePpmDto,
  WarrantyCostAnalysisDto,
} from './dto';

/**
 * 보증 관리 컨트롤러
 */
@ApiTags('Warranty')
@Controller('warranty')
export class WarrantyController {
  constructor(private readonly warrantyService: WarrantyService) {}

  /**
   * 보증 기록 생성
   */
  @Post('records')
  @ApiOperation({
    summary: '보증 기록 생성',
    description: '새로운 보증 기록을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '보증 기록 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 보증 ID 또는 번호' })
  async createRecord(@Body() dto: CreateWarrantyRecordDto) {
    return this.warrantyService.createWarrantyRecord(dto);
  }

  /**
   * 보증 기록 목록 조회
   */
  @Get('records')
  @ApiOperation({
    summary: '보증 기록 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 보증 기록 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '보증 기록 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/WarrantyRecord' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllRecords(@Query() query: WarrantyQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.warrantyService.findAllRecords(query);
  }

  /**
   * 보증 기록 단건 조회
   */
  @Get('records/:warrantyId')
  @ApiOperation({
    summary: '보증 기록 상세 조회',
    description: '특정 보증 기록의 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'warrantyId', description: '보증 ID', example: 'WAR-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '보증 기록 조회 성공',
  })
  @ApiResponse({ status: 404, description: '보증 기록을 찾을 수 없음' })
  async findOneRecord(@Param('warrantyId') warrantyId: string) {
    return this.warrantyService.findOneRecord(warrantyId);
  }

  /**
   * 보증 기록 수정
   */
  @Put('records/:warrantyId')
  @ApiOperation({
    summary: '보증 기록 수정',
    description: '기존 보증 기록의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'warrantyId', description: '보증 ID', example: 'WAR-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '보증 기록 수정 성공',
  })
  @ApiResponse({ status: 404, description: '보증 기록을 찾을 수 없음' })
  async updateRecord(
    @Param('warrantyId') warrantyId: string,
    @Body() dto: UpdateWarrantyRecordDto
  ) {
    return this.warrantyService.updateRecord(warrantyId, dto);
  }

  /**
   * 보증 기록 삭제
   */
  @Delete('records/:warrantyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '보증 기록 삭제',
    description: '보증 기록을 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'warrantyId', description: '보증 ID', example: 'WAR-20240319-001' })
  @ApiResponse({ status: 204, description: '보증 기록 삭제 성공' })
  @ApiResponse({ status: 404, description: '보증 기록을 찾을 수 없음' })
  async deleteRecord(
    @Param('warrantyId') warrantyId: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.warrantyService.deleteRecord(warrantyId, deletedBy);
  }

  /**
   * 보증 클레임 기록
   */
  @Post('claims')
  @ApiOperation({
    summary: '보증 클레임 기록',
    description: '보증 클레임을 기록합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '보증 클레임 기록 성공',
  })
  @ApiResponse({ status: 404, description: '보증 기록을 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '만료된 보증' })
  async recordClaim(
    @Query('warrantyId') warrantyId: string,
    @Body() dto: RecordWarrantyClaimDto
  ) {
    return this.warrantyService.recordWarrantyClaim(warrantyId, dto);
  }

  /**
   * PPM 조회
   */
  @Get('ppm')
  @ApiOperation({
    summary: '보증 PPM 조회',
    description: '기간별 보증 PPM을 계산합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'PPM 조회 성공',
    schema: {
      properties: {
        ppm: { type: 'number' },
        totalSales: { type: 'number' },
        warrantyClaims: { type: 'number' },
        totalClaimCost: { type: 'number' },
        details: { type: 'array' },
      },
    },
  })
  async getPPM(@Query() dto: CalculatePpmDto): Promise<{
    ppm: number;
    totalSales: number;
    warrantyClaims: number;
    totalClaimCost: number;
    details: any[];
  }> {
    return this.warrantyService.calculatePPM(dto);
  }

  /**
   * PPM 트렌드 조회
   */
  @Get('ppm/trends')
  @ApiOperation({
    summary: 'PPM 트렌드 조회',
    description: '기간별 PPM 트렌드를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'PPM 트렌드 조회 성공',
    schema: {
      properties: {
        trends: { type: 'array' },
      },
    },
  })
  async getPPMTrends(@Query() dto: CalculatePpmDto): Promise<{
    trends: any[];
  }> {
    return this.warrantyService.getPPMTrends(dto);
  }

  /**
   * 비용 분석
   */
  @Get('costs')
  @ApiOperation({
    summary: '보증 비용 분석',
    description: '품목/고객/기간별 보증 비용을 분석합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '비용 분석 성공',
    schema: {
      properties: {
        analysis: { type: 'array' },
        summary: {
          type: 'object',
          properties: {
            totalClaims: { type: 'number' },
            totalCost: { type: 'number' },
            avgCostPerClaim: { type: 'number' },
          },
        },
      },
    },
  })
  async getWarrantyCosts(@Query() dto: WarrantyCostAnalysisDto): Promise<{
    analysis: any[];
    summary: {
      totalClaims: number;
      totalCost: number;
      avgCostPerClaim: number;
    };
  }> {
    return this.warrantyService.getWarrantyCosts(dto);
  }

  /**
   * 만료 예정 보증 조회
   */
  @Get('expiring')
  @ApiOperation({
    summary: '만료 예정 보증 조회',
    description: 'N일 내에 만료되는 보증 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '만료 예정 보증 조회 성공',
  })
  async getExpiringWarranties(
    @Query('days') days?: string
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.warrantyService.getExpiringWarranties(daysNum);
  }
}
