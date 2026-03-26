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
import { PpapService } from './ppap.service';
import {
  CreatePpapSubmissionDto,
  UpdatePpapSubmissionDto,
  SubmitDocumentDto,
  ApproveDocumentDto,
  ApproveSubmissionDto,
  RejectSubmissionDto,
  ResubmitSubmissionDto,
  InterimApproveSubmissionDto,
  PpapQueryDto,
} from './dto';

/**
 * PPAP 관리 컨트롤러
 */
@ApiTags('PPAP')
@Controller('ppap')
export class PpapController {
  constructor(private readonly ppapService: PpapService) {}

  // ==================== Submission Endpoints ====================

  /**
   * PPAP 제출 생성
   */
  @Post('submissions')
  @ApiOperation({
    summary: 'PPAP 제출 생성',
    description: '새로운 PPAP 제출을 생성합니다. 레벨별 기본 문서가 자동 생성됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'PPAP 제출 생성 성공',
  })
  @ApiResponse({ status: 409, description: '중복된 제출 ID' })
  async createSubmission(@Body() dto: CreatePpapSubmissionDto) {
    return this.ppapService.createSubmission(dto);
  }

  /**
   * PPAP 제출 목록 조회
   */
  @Get('submissions')
  @ApiOperation({
    summary: 'PPAP 제출 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 PPAP 제출 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '제출 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/PpapSubmission' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllSubmissions(@Query() query: PpapQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.ppapService.findAllSubmissions(query);
  }

  /**
   * PPAP 제출 단건 조회
   */
  @Get('submissions/:submissionId')
  @ApiOperation({
    summary: 'PPAP 제출 상세 조회',
    description: '특정 PPAP 제출의 상세 정보와 문서, 승인 이력을 조회합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '제출 조회 성공',
  })
  @ApiResponse({ status: 404, description: '제출을 찾을 수 없음' })
  async findOneSubmission(@Param('submissionId') submissionId: string) {
    return this.ppapService.findOneSubmission(submissionId);
  }

  /**
   * PPAP 제출 수정
   */
  @Put('submissions/:submissionId')
  @ApiOperation({
    summary: 'PPAP 제출 수정',
    description: '기존 PPAP 제출의 정보를 수정합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '제출 수정 성공',
  })
  @ApiResponse({ status: 404, description: '제출을 찾을 수 없음' })
  async updateSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: UpdatePpapSubmissionDto
  ) {
    return this.ppapService.updateSubmission(submissionId, dto);
  }

  /**
   * PPAP 제출 삭제
   */
  @Delete('submissions/:submissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'PPAP 제출 삭제',
    description: 'PPAP 제출을 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({ status: 204, description: '제출 삭제 성공' })
  @ApiResponse({ status: 404, description: '제출을 찾을 수 없음' })
  async deleteSubmission(
    @Param('submissionId') submissionId: string,
    @Query('deletedBy') deletedBy?: string
  ): Promise<void> {
    return this.ppapService.deleteSubmission(submissionId, deletedBy);
  }

  // ==================== Document Endpoints ====================

  /**
   * PPAP 문서 제출
   */
  @Post('submissions/:submissionId/documents')
  @ApiOperation({
    summary: 'PPAP 문서 제출',
    description: 'PPAP 제출에 문서를 추가하거나 기존 문서를 업데이트합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '문서 제출 성공',
  })
  async submitDocument(
    @Param('submissionId') submissionId: string,
    @Body() dto: SubmitDocumentDto
  ) {
    return this.ppapService.submitDocument(submissionId, dto);
  }

  /**
   * PPAP 문서 승인
   */
  @Post('submissions/:submissionId/documents/:documentId/approve')
  @ApiOperation({
    summary: 'PPAP 문서 승인',
    description: '제출된 PPAP 문서를 승인합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiParam({ name: 'documentId', description: '문서 ID', example: 'DOC-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '문서 승인 성공',
  })
  async approveDocument(
    @Param('submissionId') submissionId: string,
    @Param('documentId') documentId: string,
    @Body() dto: ApproveDocumentDto
  ) {
    return this.ppapService.approveDocument(submissionId, documentId, dto);
  }

  // ==================== Approval Endpoints ====================

  /**
   * PPAP 승인
   */
  @Post('submissions/:submissionId/approve')
  @ApiOperation({
    summary: 'PPAP 승인',
    description: 'PPAP 제출을 승인합니다. 모든 필수 문서가 승인되어야 합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: 'PPAP 승인 성공',
  })
  async approveSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: ApproveSubmissionDto
  ) {
    return this.ppapService.approveSubmission(submissionId, dto);
  }

  /**
   * PPAP 반려
   */
  @Post('submissions/:submissionId/reject')
  @ApiOperation({
    summary: 'PPAP 반려',
    description: 'PPAP 제출을 반려합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: 'PPAP 반려 성공',
  })
  async rejectSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: RejectSubmissionDto
  ) {
    return this.ppapService.rejectSubmission(submissionId, dto);
  }

  /**
   * PPAP 재제출
   */
  @Post('submissions/:submissionId/resubmit')
  @ApiOperation({
    summary: 'PPAP 재제출',
    description: '반려되거나 임시 승인된 PPAP를 재제출합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: 'PPAP 재제출 성공',
  })
  async resubmitSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: ResubmitSubmissionDto
  ) {
    return this.ppapService.resubmitSubmission(submissionId, dto);
  }

  /**
   * PPAP 임시 승인
   */
  @Post('submissions/:submissionId/interim-approve')
  @ApiOperation({
    summary: 'PPAP 임시 승인',
    description: 'PPAP 제출을 조건부로 임시 승인합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: 'PPAP 임시 승인 성공',
  })
  async interimApproveSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: InterimApproveSubmissionDto
  ) {
    return this.ppapService.interimApproveSubmission(submissionId, dto);
  }

  // ==================== History Endpoints ====================

  /**
   * 승인 이력 조회
   */
  @Get('submissions/:submissionId/history')
  @ApiOperation({
    summary: 'PPAP 승인 이력 조회',
    description: '특정 PPAP 제출의 승인/반려/재제출 이력을 조회합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '승인 이력 조회 성공',
  })
  async getApprovalHistory(@Param('submissionId') submissionId: string) {
    return this.ppapService.getApprovalHistory(submissionId);
  }

  /**
   * 재제출 필요 여부 확인
   */
  @Get('submissions/:submissionId/check-resubmission')
  @ApiOperation({
    summary: '재제출 필요 여부 확인',
    description: 'PPAP 제출의 재제출 필요 여부를 자동으로 확인합니다.',
  })
  @ApiParam({ name: 'submissionId', description: '제출 ID', example: 'PPAP-20240319-001' })
  @ApiResponse({
    status: 200,
    description: '재제출 확인 성공',
    schema: {
      properties: {
        needsResubmission: { type: 'boolean' },
        reasons: { type: 'array', items: { type: 'string' } },
        daysSinceRejection: { type: 'number', nullable: true },
      },
    },
  })
  async checkResubmissionNeeded(@Param('submissionId') submissionId: string): Promise<{
    needsResubmission: boolean;
    reasons: string[];
    daysSinceRejection: number | null;
  }> {
    return this.ppapService.checkResubmissionNeeded(submissionId);
  }

  /**
   * PPAP 통계 조회
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'PPAP 통계 조회',
    description: 'PPAP 제출 통계 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        totalSubmissions: { type: 'number' },
        byStatus: { type: 'object' },
        byLevel: { type: 'object' },
        approvedCount: { type: 'number' },
        rejectedCount: { type: 'number' },
        pendingCount: { type: 'number' },
        averageResubmissionCount: { type: 'number' },
      },
    },
  })
  async getStatistics(): Promise<{
    totalSubmissions: number;
    byStatus: Record<string, number>;
    byLevel: Record<string, number>;
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
    averageResubmissionCount: number;
  }> {
    return this.ppapService.getStatistics();
  }
}
