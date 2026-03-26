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
import { ComplaintService } from './complaint.service';
import {
  CreateComplaintDto,
  UpdateComplaintDto,
  ComplaintQueryDto,
  AnalyzeTrendsDto,
  AnalyzeResponseTimeDto,
  ResolveComplaintDto,
  CloseComplaintDto,
} from './dto';

/**
 * 클레임 관리 컨트롤러
 */
@ApiTags('Complaint')
@Controller('complaints')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  /**
   * 클레임 생성
   */
  @Post()
  @ApiOperation({
    summary: '클레임 생성',
    description: '새로운 고객 클레임을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '클레임 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 클레임 ID 또는 번호' })
  async createComplaint(@Body() dto: CreateComplaintDto) {
    return this.complaintService.createComplaint(dto);
  }

  /**
   * 클레임 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: '클레임 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 클레임 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '클레임 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/CustomerComplaint' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllComplaints(@Query() query: ComplaintQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.complaintService.findAllComplaints(query);
  }

  /**
   * 클레임 단건 조회
   */
  @Get(':complaintId')
  @ApiOperation({
    summary: '클레임 상세 조회',
    description: '특정 클레임의 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'complaintId', description: '클레임 ID', example: 'COMP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '클레임 조회 성공',
  })
  @ApiResponse({ status: 404, description: '클레임을 찾을 수 없음' })
  async findOneComplaint(@Param('complaintId') complaintId: string) {
    return this.complaintService.findOneComplaint(complaintId);
  }

  /**
   * 클레임 수정
   */
  @Put(':complaintId')
  @ApiOperation({
    summary: '클레임 수정',
    description: '기존 클레임의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'complaintId', description: '클레임 ID', example: 'COMP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '클레임 수정 성공',
  })
  @ApiResponse({ status: 404, description: '클레임을 찾을 수 없음' })
  async updateComplaint(
    @Param('complaintId') complaintId: string,
    @Body() dto: UpdateComplaintDto
  ) {
    return this.complaintService.updateComplaint(complaintId, dto);
  }

  /**
   * 클레임 삭제
   */
  @Delete(':complaintId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '클레임 삭제',
    description: '클레임을 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'complaintId', description: '클레임 ID', example: 'COMP-20240319-001' })
  @ApiResponse({ status: 204, description: '클레임 삭제 성공' })
  @ApiResponse({ status: 404, description: '클레임을 찾을 수 없음' })
  async deleteComplaint(
    @Param('complaintId') complaintId: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.complaintService.deleteComplaint(complaintId, deletedBy);
  }

  /**
   * 트렌드 분석
   */
  @Get('analytics/trends')
  @ApiOperation({
    summary: '클레임 트렌드 분석',
    description: '기간별 클레임 트렌드를 분석합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '트렌드 분석 성공',
    schema: {
      properties: {
        trends: { type: 'array' },
        summary: {
          type: 'object',
          properties: {
            totalComplaints: { type: 'number' },
            totalDefectQty: { type: 'number' },
            avgResponseTime: { type: 'number' },
            avgSatisfaction: { type: 'number' },
          },
        },
      },
    },
  })
  async analyzeTrends(@Query() dto: AnalyzeTrendsDto): Promise<{
    trends: any[];
    summary: {
      totalComplaints: number;
      totalDefectQty: number;
      avgResponseTime: number;
      avgSatisfaction: number;
    };
  }> {
    return this.complaintService.analyzeTrends(dto);
  }

  /**
   * 응답 시간 분석
   */
  @Get('analytics/response-time')
  @ApiOperation({
    summary: '응답 시간 분석',
    description: '클레임 처리 응답 시간을 분석하고 병목을 식별합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '응답 시간 분석 성공',
    schema: {
      properties: {
        analysis: { type: 'array' },
        bottlenecks: { type: 'array' },
      },
    },
  })
  async analyzeResponseTime(@Query() dto: AnalyzeResponseTimeDto): Promise<{
    analysis: any[];
    bottlenecks: any[];
  }> {
    return this.complaintService.analyzeResponseTime(dto);
  }

  /**
   * 클레임 해결
   */
  @Post(':complaintId/resolve')
  @ApiOperation({
    summary: '클레임 해결',
    description: '클레임을 해결 상태로 변경하고 응답 시간을 계산합니다.',
  })
  @ApiParam({ name: 'complaintId', description: '클레임 ID', example: 'COMP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '클레임 해결 성공',
  })
  @ApiResponse({ status: 404, description: '클레임을 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '이미 종결된 클레임' })
  async resolveComplaint(
    @Param('complaintId') complaintId: string,
    @Body() dto: ResolveComplaintDto
  ) {
    return this.complaintService.resolveComplaint(complaintId, dto);
  }

  /**
   * 클레임 종결
   */
  @Post(':complaintId/close')
  @ApiOperation({
    summary: '클레임 종결',
    description: '클레임을 최종 종결하고 만족도를 기록합니다.',
  })
  @ApiParam({ name: 'complaintId', description: '클레임 ID', example: 'COMP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '클레임 종결 성공',
  })
  @ApiResponse({ status: 404, description: '클레임을 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '해결되지 않은 클레임' })
  async closeComplaint(
    @Param('complaintId') complaintId: string,
    @Body() dto: CloseComplaintDto
  ) {
    return this.complaintService.closeComplaint(complaintId, dto);
  }
}
