/**
 * @file change.controller.ts
 * @description 변경 관리 컨트롤러
 *
 * 변경 요청(Change Request)의 REST API 엔드포인트를 정의합니다.
 *
 * 엔드포인트 목록:
 * - POST   /changes                          - 변경 요청 등록
 * - GET    /changes                          - 목록 조회 (필터/페이지네이션)
 * - GET    /changes/pending-customer-approval - 고객 승인 대기 목록
 * - GET    /changes/statistics               - 통계 (타입별/상태별)
 * - GET    /changes/:changeId                - 상세 조회
 * - PUT    /changes/:changeId                - 수정
 * - DELETE /changes/:changeId                - 소프트 삭제
 * - POST   /changes/:changeId/review         - 검토 시작
 * - POST   /changes/:changeId/approve        - 승인
 * - POST   /changes/:changeId/implement      - 실행 시작
 * - POST   /changes/:changeId/complete       - 완료
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
import { ChangeService } from './change.service';
import {
  CreateChangeDto,
  UpdateChangeDto,
  ChangeQueryDto,
  ReviewChangeDto,
  ApproveChangeDto,
  ImplementChangeDto,
  CompleteChangeDto,
} from './dto';

/**
 * 변경 관리 컨트롤러
 */
@ApiTags('Change Management')
@Controller('changes')
export class ChangeController {
  constructor(private readonly changeService: ChangeService) {}

  /**
   * 변경 요청 등록
   */
  @Post()
  @ApiOperation({
    summary: '변경 요청 등록',
    description: '새로운 변경 요청을 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '변경 요청이 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 409, description: '중복된 변경 ID 또는 번호' })
  async createChange(
    @Body() dto: CreateChangeDto,
  ) {
    return this.changeService.createChange(dto);
  }

  /**
   * 변경 요청 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: '변경 요청 목록 조회',
    description:
      '페이지네이션 및 필터링이 적용된 변경 요청 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '변경 요청 목록 조회 성공',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/ChangeRequest' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllChanges(@Query() query: ChangeQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.changeService.findAllChanges(query);
  }

  /**
   * 고객 승인 대기 중인 변경 요청 목록
   */
  @Get('pending-customer-approval')
  @ApiOperation({
    summary: '고객 승인 대기 목록',
    description: '고객 승인이 필요하고 아직 승인되지 않은 변경 요청 목록입니다.',
  })
  @ApiResponse({
    status: 200,
    description: '고객 승인 대기 목록 조회 성공',
  })
  async findPendingCustomerApproval() {
    return this.changeService.findPendingCustomerApproval();
  }

  /**
   * 변경 요청 통계
   */
  @Get('statistics')
  @ApiOperation({
    summary: '변경 요청 통계',
    description: '변경 유형별, 상태별 통계를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        byType: {
          type: 'array',
          items: {
            properties: {
              changeType: { type: 'string' },
              count: { type: 'number' },
            },
          },
        },
        byStatus: {
          type: 'array',
          items: {
            properties: {
              status: { type: 'string' },
              count: { type: 'number' },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  async getStatistics(): Promise<{
    byType: Array<{ changeType: string; count: number }>;
    byStatus: Array<{ status: string; count: number }>;
    total: number;
  }> {
    return this.changeService.getStatistics();
  }

  /**
   * 변경 요청 상세 조회
   */
  @Get(':changeId')
  @ApiOperation({
    summary: '변경 요청 상세 조회',
    description: '특정 변경 요청의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'changeId',
    description: '변경 ID',
    example: 'CHG-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '변경 요청 조회 성공',
  })
  @ApiResponse({ status: 404, description: '변경 요청을 찾을 수 없음' })
  async findOneChange(
    @Param('changeId') changeId: string,
  ) {
    return this.changeService.findOneChange(changeId);
  }

  /**
   * 변경 요청 수정
   */
  @Put(':changeId')
  @ApiOperation({
    summary: '변경 요청 수정',
    description: '기존 변경 요청의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'changeId',
    description: '변경 ID',
    example: 'CHG-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '변경 요청 수정 성공',
  })
  @ApiResponse({ status: 404, description: '변경 요청을 찾을 수 없음' })
  async updateChange(
    @Param('changeId') changeId: string,
    @Body() dto: UpdateChangeDto,
  ) {
    return this.changeService.updateChange(changeId, dto);
  }

  /**
   * 변경 요청 삭제
   */
  @Delete(':changeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '변경 요청 삭제',
    description: '변경 요청을 소프트 삭제합니다.',
  })
  @ApiParam({
    name: 'changeId',
    description: '변경 ID',
    example: 'CHG-20260319-001',
  })
  @ApiResponse({ status: 204, description: '변경 요청 삭제 성공' })
  @ApiResponse({ status: 404, description: '변경 요청을 찾을 수 없음' })
  async deleteChange(
    @Param('changeId') changeId: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.changeService.deleteChange(changeId, deletedBy);
  }

  /**
   * 변경 요청 검토 시작
   */
  @Post(':changeId/review')
  @ApiOperation({
    summary: '변경 요청 검토',
    description: '변경 요청을 검토 상태로 전환합니다.',
  })
  @ApiParam({
    name: 'changeId',
    description: '변경 ID',
    example: 'CHG-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '검토 상태로 전환 성공',
  })
  @ApiResponse({ status: 404, description: '변경 요청을 찾을 수 없음' })
  async reviewChange(
    @Param('changeId') changeId: string,
    @Body() dto: ReviewChangeDto,
  ) {
    return this.changeService.reviewChange(changeId, dto);
  }

  /**
   * 변경 요청 승인
   */
  @Post(':changeId/approve')
  @ApiOperation({
    summary: '변경 요청 승인',
    description: '변경 요청을 승인합니다.',
  })
  @ApiParam({
    name: 'changeId',
    description: '변경 ID',
    example: 'CHG-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '승인 성공',
  })
  @ApiResponse({ status: 404, description: '변경 요청을 찾을 수 없음' })
  async approveChange(
    @Param('changeId') changeId: string,
    @Body() dto: ApproveChangeDto,
  ) {
    return this.changeService.approveChange(changeId, dto);
  }

  /**
   * 변경 요청 실행 시작
   */
  @Post(':changeId/implement')
  @ApiOperation({
    summary: '변경 실행 시작',
    description:
      '변경 요청 실행을 시작합니다. 고객 승인이 필요한 경우 승인 완료 후에만 가능합니다.',
  })
  @ApiParam({
    name: 'changeId',
    description: '변경 ID',
    example: 'CHG-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '실행 시작 성공',
  })
  @ApiResponse({ status: 404, description: '변경 요청을 찾을 수 없음' })
  @ApiResponse({
    status: 409,
    description: '고객 승인이 완료되지 않아 실행 불가',
  })
  async implementChange(
    @Param('changeId') changeId: string,
    @Body() dto: ImplementChangeDto,
  ) {
    return this.changeService.implementChange(changeId, dto);
  }

  /**
   * 변경 요청 완료
   */
  @Post(':changeId/complete')
  @ApiOperation({
    summary: '변경 요청 완료',
    description: '변경 요청을 완료 처리합니다.',
  })
  @ApiParam({
    name: 'changeId',
    description: '변경 ID',
    example: 'CHG-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '완료 처리 성공',
  })
  @ApiResponse({ status: 404, description: '변경 요청을 찾을 수 없음' })
  async completeChange(
    @Param('changeId') changeId: string,
    @Body() dto: CompleteChangeDto,
  ) {
    return this.changeService.completeChange(changeId, dto);
  }
}
