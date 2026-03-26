/**
 * @file equipment.controller.ts
 * @description 계측기 관리 컨트롤러
 *
 * 초보자 가이드:
 * - REST API 엔드포인트를 정의합니다.
 * - 계측기 CRUD, 교정 등록/조회, 교정 예정, OOT, 통계 API를 제공합니다.
 * - 정적 경로(calibration-due, oot, statistics)는 동적 경로(:equipmentId)보다
 *   먼저 선언해야 NestJS가 올바르게 라우팅합니다.
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
import { EquipmentService } from './equipment.service';
import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
  EquipmentQueryDto,
  CreateCalibrationDto,
} from './dto';

/**
 * 계측기 관리 컨트롤러
 */
@ApiTags('Equipment')
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  /**
   * 계측기 등록
   */
  @Post()
  @ApiOperation({
    summary: '계측기 등록',
    description: '새로운 계측기를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '계측기가 성공적으로 등록되었습니다.',
  })
  @ApiResponse({ status: 409, description: '중복된 계측기 ID 또는 번호' })
  async createEquipment(
    @Body() dto: CreateEquipmentDto,
  ) {
    return this.equipmentService.createEquipment(dto);
  }

  /**
   * 교정 예정 계측기 조회
   */
  @Get('calibration-due')
  @ApiOperation({
    summary: '교정 예정 계측기 조회',
    description: 'N일 이내 교정 예정인 계측기 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'daysAhead',
    required: false,
    description: '조회 기간 (일)',
    example: 30,
  })
  @ApiResponse({
    status: 200,
    description: '교정 예정 계측기 목록 조회 성공',
  })
  async getCalibrationDue(
    @Query('daysAhead') daysAhead?: number,
  ) {
    return this.equipmentService.getCalibrationDue(
      daysAhead ? Number(daysAhead) : 30,
    );
  }

  /**
   * OOT 목록 조회
   */
  @Get('oot')
  @ApiOperation({
    summary: 'OOT 목록 조회',
    description: 'OOT(허용 오차 초과) 교정 기록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OOT 목록 조회 성공',
  })
  async getOotEquipment() {
    return this.equipmentService.getOotEquipment();
  }

  /**
   * 통계 조회
   */
  @Get('statistics')
  @ApiOperation({
    summary: '계측기 통계',
    description: '상태별/부서별 계측기 통계를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '통계 조회 성공',
    schema: {
      properties: {
        byStatus: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              count: { type: 'number' },
            },
          },
        },
        byDepartment: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              department: { type: 'string' },
              count: { type: 'number' },
            },
          },
        },
        total: { type: 'number' },
        calibrationDueSoon: { type: 'number' },
      },
    },
  })
  async getStatistics(): Promise<{
    byStatus: Array<{ status: string; count: number }>;
    byDepartment: Array<{ department: string; count: number }>;
    total: number;
    calibrationDueSoon: number;
  }> {
    return this.equipmentService.getStatistics();
  }

  /**
   * 계측기 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: '계측기 목록 조회',
    description: '필터링/페이지네이션이 적용된 계측기 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '계측기 목록 조회 성공',
    schema: {
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/Equipment' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllEquipment(@Query() query: EquipmentQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.equipmentService.findAllEquipment(query);
  }

  /**
   * 계측기 상세 조회
   */
  @Get(':equipmentId')
  @ApiOperation({
    summary: '계측기 상세 조회',
    description: '특정 계측기의 상세 정보를 교정 이력과 함께 조회합니다.',
  })
  @ApiParam({
    name: 'equipmentId',
    description: '계측기 ID',
    example: 'EQP-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '계측기 조회 성공',
  })
  @ApiResponse({ status: 404, description: '계측기를 찾을 수 없음' })
  async findOneEquipment(
    @Param('equipmentId') equipmentId: string,
  ) {
    return this.equipmentService.findOneEquipment(equipmentId);
  }

  /**
   * 계측기 수정
   */
  @Put(':equipmentId')
  @ApiOperation({
    summary: '계측기 수정',
    description: '기존 계측기의 정보를 수정합니다.',
  })
  @ApiParam({
    name: 'equipmentId',
    description: '계측기 ID',
    example: 'EQP-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '계측기 수정 성공',
  })
  @ApiResponse({ status: 404, description: '계측기를 찾을 수 없음' })
  async updateEquipment(
    @Param('equipmentId') equipmentId: string,
    @Body() dto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.updateEquipment(equipmentId, dto);
  }

  /**
   * 계측기 삭제
   */
  @Delete(':equipmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '계측기 삭제',
    description: '계측기를 소프트 삭제합니다.',
  })
  @ApiParam({
    name: 'equipmentId',
    description: '계측기 ID',
    example: 'EQP-20260319-001',
  })
  @ApiResponse({ status: 204, description: '계측기 삭제 성공' })
  @ApiResponse({ status: 404, description: '계측기를 찾을 수 없음' })
  async deleteEquipment(
    @Param('equipmentId') equipmentId: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.equipmentService.deleteEquipment(equipmentId, deletedBy);
  }

  /**
   * 교정 결과 등록
   */
  @Post(':equipmentId/calibrations')
  @ApiOperation({
    summary: '교정 결과 등록',
    description: '계측기의 교정 결과를 등록합니다.',
  })
  @ApiParam({
    name: 'equipmentId',
    description: '계측기 ID',
    example: 'EQP-20260319-001',
  })
  @ApiResponse({
    status: 201,
    description: '교정 결과가 성공적으로 등록되었습니다.',
  })
  @ApiResponse({ status: 404, description: '계측기를 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '중복된 교정 번호' })
  async createCalibration(
    @Param('equipmentId') equipmentId: string,
    @Body() dto: CreateCalibrationDto,
  ) {
    return this.equipmentService.createCalibration(equipmentId, dto);
  }

  /**
   * 교정 이력 조회
   */
  @Get(':equipmentId/calibrations')
  @ApiOperation({
    summary: '교정 이력 조회',
    description: '특정 계측기의 교정 이력을 조회합니다.',
  })
  @ApiParam({
    name: 'equipmentId',
    description: '계측기 ID',
    example: 'EQP-20260319-001',
  })
  @ApiResponse({
    status: 200,
    description: '교정 이력 조회 성공',
  })
  @ApiResponse({ status: 404, description: '계측기를 찾을 수 없음' })
  async findCalibrations(
    @Param('equipmentId') equipmentId: string,
  ) {
    return this.equipmentService.findCalibrations(equipmentId);
  }
}
