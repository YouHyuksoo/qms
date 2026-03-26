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
import { InspectionService } from './inspection.service';
import {
  CreateInspectionLotDto,
  UpdateInspectionLotDto,
  CreateInspectionResultDto,
  BulkCreateInspectionResultDto,
  InspectionQueryDto,
} from './dto';
import { InspectionJudgment, InspectionType } from './entities/inspection-lot.entity';

/**
 * 검사 관리 컨트롤러
 */
@ApiTags('Inspection')
@Controller('inspection')
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) {}

  /**
   * 검사 로트 생성
   */
  @Post('lots')
  @ApiOperation({
    summary: '검사 로트 생성',
    description: '새로운 검사 로트를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '검사 로트 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 로트 번호' })
  async createLot(@Body() dto: CreateInspectionLotDto) {
    return this.inspectionService.createLot(dto);
  }

  /**
   * 검사 로트 목록 조회
   */
  @Get('lots')
  @ApiOperation({
    summary: '검사 로트 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 검사 로트 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '검사 로트 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/InspectionLot' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAll(@Query() query: InspectionQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.inspectionService.findAll(query);
  }

  /**
   * 검사 로트 단건 조회
   */
  @Get('lots/:lotNo')
  @ApiOperation({
    summary: '검사 로트 상세 조회',
    description: '특정 검사 로트의 상세 정보와 검사 결과를 조회합니다.',
  })
  @ApiParam({ name: 'lotNo', description: '로트 번호', example: 'LOT-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '검사 로트 조회 성공',
  })
  @ApiResponse({ status: 404, description: '검사 로트를 찾을 수 없음' })
  async findOne(@Param('lotNo') lotNo: string) {
    return this.inspectionService.findOne(lotNo);
  }

  /**
   * 검사 로트 수정
   */
  @Put('lots/:lotNo')
  @ApiOperation({
    summary: '검사 로트 수정',
    description: '기존 검사 로트의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'lotNo', description: '로트 번호', example: 'LOT-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '검사 로트 수정 성공',
  })
  @ApiResponse({ status: 404, description: '검사 로트를 찾을 수 없음' })
  async updateLot(
    @Param('lotNo') lotNo: string,
    @Body() dto: UpdateInspectionLotDto
  ) {
    return this.inspectionService.updateLot(lotNo, dto);
  }

  /**
   * 검사 로트 삭제
   */
  @Delete('lots/:lotNo')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '검사 로트 삭제',
    description: '검사 로트를 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'lotNo', description: '로트 번호', example: 'LOT-20240319-001' })
  @ApiResponse({ status: 204, description: '검사 로트 삭제 성공' })
  @ApiResponse({ status: 404, description: '검사 로트를 찾을 수 없음' })
  async deleteLot(
    @Param('lotNo') lotNo: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.inspectionService.deleteLot(lotNo, deletedBy);
  }

  /**
   * 검사 결과 추가
   */
  @Post('lots/:lotNo/results')
  @ApiOperation({
    summary: '검사 결과 추가',
    description: '특정 검사 로트에 검사 결과를 추가합니다.',
  })
  @ApiParam({ name: 'lotNo', description: '로트 번호', example: 'LOT-20240319-001' })
  @ApiResponse({
    status: 201,
    description: '검사 결과 추가 성공',
  })
  @ApiResponse({ status: 404, description: '검사 로트를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '중복된 결과 ID' })
  async addResult(
    @Param('lotNo') lotNo: string,
    @Body() dto: CreateInspectionResultDto
  ) {
    return this.inspectionService.addResult({ ...dto, lotNo });
  }

  /**
   * 다수 검사 결과 추가
   */
  @Post('lots/:lotNo/results/bulk')
  @ApiOperation({
    summary: '다수 검사 결과 추가',
    description: '특정 검사 로트에 여러 검사 결과를 한번에 추가합니다.',
  })
  @ApiParam({ name: 'lotNo', description: '로트 번호', example: 'LOT-20240319-001' })
  @ApiResponse({
    status: 201,
    description: '다수 검사 결과 추가 성공',
  })
  async addResults(
    @Param('lotNo') lotNo: string,
    @Body() dto: BulkCreateInspectionResultDto
  ) {
    return this.inspectionService.addResults(lotNo, dto.results);
  }

  /**
   * 검사 로트 최종 판정
   */
  @Post('lots/:lotNo/judge')
  @ApiOperation({
    summary: '검사 로트 최종 판정',
    description: '검사 로트에 최종 판정을 내립니다. FAIL인 경우 자동으로 NCR 생성이 필요함을 알립니다.',
  })
  @ApiParam({ name: 'lotNo', description: '로트 번호', example: 'LOT-20240319-001' })
  @ApiQuery({
    name: 'judgment',
    enum: InspectionJudgment,
    description: '최종 판정',
    required: true,
  })
  @ApiQuery({
    name: 'judgedBy',
    description: '판정자',
    required: false,
  })
  @ApiQuery({
    name: 'remarks',
    description: '비고',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: '판정 완료',
    schema: {
      properties: {
        lot: { $ref: '#/components/schemas/InspectionLot' },
        autoNcrCreated: { type: 'boolean' },
        ncrNo: { type: 'string', nullable: true },
      },
    },
  })
  async judgeLot(
    @Param('lotNo') lotNo: string,
    @Query('judgment') judgment: InspectionJudgment,
    @Query('judgedBy') judgedBy?: string,
    @Query('remarks') remarks?: string
  ): Promise<{
    lot: any;
    autoNcrCreated: boolean;
    ncrNo?: string;
  }> {
    return this.inspectionService.judgeLot(lotNo, judgment, { judgedBy, remarks });
  }

  /**
   * 검사 통계 조회
   */
  @Get('statistics')
  @ApiOperation({
    summary: '검사 통계 조회',
    description: '검사 유형별 통계 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        totalLots: { type: 'number' },
        passCount: { type: 'number' },
        failCount: { type: 'number' },
        holdCount: { type: 'number' },
        passRate: { type: 'number' },
      },
    },
  })
  async getStatistics(
    @Query('inspectionType') inspectionType?: InspectionType,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string
  ): Promise<{
    totalLots: number;
    passCount: number;
    failCount: number;
    holdCount: number;
    passRate: number;
  }> {
    return this.inspectionService.getStatistics(
      inspectionType,
      dateFrom,
      dateTo
    );
  }
}
