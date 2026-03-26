/**
 * @file capa.controller.ts
 * @description CAPA(시정/예방 조치) 컨트롤러
 *
 * CAPA CRUD, 효과성 검증, 통계 요약 엔드포인트를 제공합니다.
 *
 * 초보자 가이드:
 * - POST /capa: 새 CAPA를 등록합니다.
 * - GET /capa: 필터/페이지네이션으로 목록을 조회합니다.
 * - GET /capa/analytics/summary: 상태별/타입별/우선순위별 통계를 반환합니다.
 * - GET /capa/:capaId: 효과성 검증 이력을 포함한 상세 정보를 조회합니다.
 * - POST /capa/:capaId/effectiveness-check: 효과성 검증 기록을 추가합니다.
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
import { CapaService } from './capa.service';
import { CreateCapaDto, UpdateCapaDto, CapaQueryDto, CreateEffectivenessCheckDto } from './dto';

/**
 * CAPA 컨트롤러
 */
@ApiTags('CAPA')
@Controller('capa')
export class CapaController {
  constructor(private readonly capaService: CapaService) {}

  /**
   * CAPA 생성
   */
  @Post()
  @ApiOperation({
    summary: 'CAPA 생성',
    description: '새로운 시정/예방 조치를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: 'CAPA가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 409, description: '중복된 CAPA ID 또는 번호' })
  async createCapa(@Body() dto: CreateCapaDto) {
    return this.capaService.createCapa(dto);
  }

  /**
   * CAPA 통계 요약
   * (주의: 와일드카드 라우트보다 먼저 선언해야 합니다)
   */
  @Get('analytics/summary')
  @ApiOperation({
    summary: 'CAPA 통계 요약',
    description: '상태별, 타입별, 우선순위별 CAPA 통계를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'CAPA 통계 요약 조회 성공',
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
        byType: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              capaType: { type: 'string' },
              count: { type: 'number' },
            },
          },
        },
        byPriority: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              priority: { type: 'string' },
              count: { type: 'number' },
            },
          },
        },
        total: { type: 'number' },
      },
    },
  })
  async getCapaSummary(): Promise<{
    byStatus: Array<{ status: string; count: number }>;
    byType: Array<{ capaType: string; count: number }>;
    byPriority: Array<{ priority: string; count: number }>;
    total: number;
  }> {
    return this.capaService.getCapaSummary();
  }

  /**
   * CAPA 목록 조회
   */
  @Get()
  @ApiOperation({
    summary: 'CAPA 목록 조회',
    description: '페이지네이션 및 필터링이 적용된 CAPA 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'CAPA 목록 조회 성공',
    schema: {
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/Capa' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async findAllCapas(@Query() query: CapaQueryDto): Promise<{
    items: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.capaService.findAllCapas(query);
  }

  /**
   * CAPA 단건 조회
   */
  @Get(':capaId')
  @ApiOperation({
    summary: 'CAPA 상세 조회',
    description: '효과성 검증 이력을 포함한 CAPA 상세 정보를 조회합니다.',
  })
  @ApiParam({ name: 'capaId', description: 'CAPA ID', example: 'CAPA-20260319-001' })
  @ApiResponse({
    status: 200,
    description: 'CAPA 조회 성공',
  })
  @ApiResponse({ status: 404, description: 'CAPA를 찾을 수 없음' })
  async findOneCapa(@Param('capaId') capaId: string) {
    return this.capaService.findOneCapa(capaId);
  }

  /**
   * CAPA 수정
   */
  @Put(':capaId')
  @ApiOperation({
    summary: 'CAPA 수정',
    description: '기존 CAPA 정보를 수정합니다.',
  })
  @ApiParam({ name: 'capaId', description: 'CAPA ID', example: 'CAPA-20260319-001' })
  @ApiResponse({
    status: 200,
    description: 'CAPA 수정 성공',
  })
  @ApiResponse({ status: 404, description: 'CAPA를 찾을 수 없음' })
  async updateCapa(
    @Param('capaId') capaId: string,
    @Body() dto: UpdateCapaDto,
  ) {
    return this.capaService.updateCapa(capaId, dto);
  }

  /**
   * CAPA 삭제 (소프트 삭제)
   */
  @Delete(':capaId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'CAPA 삭제',
    description: 'CAPA를 소프트 삭제합니다.',
  })
  @ApiParam({ name: 'capaId', description: 'CAPA ID', example: 'CAPA-20260319-001' })
  @ApiResponse({ status: 204, description: 'CAPA 삭제 성공' })
  @ApiResponse({ status: 404, description: 'CAPA를 찾을 수 없음' })
  async deleteCapa(
    @Param('capaId') capaId: string,
    @Query('deletedBy') deletedBy?: string,
  ): Promise<void> {
    return this.capaService.deleteCapa(capaId, deletedBy);
  }

  /**
   * 효과성 검증 등록
   */
  @Post(':capaId/effectiveness-check')
  @ApiOperation({
    summary: '효과성 검증 등록',
    description: 'CAPA에 대한 효과성 검증 기록을 추가합니다.',
  })
  @ApiParam({ name: 'capaId', description: 'CAPA ID', example: 'CAPA-20260319-001' })
  @ApiResponse({
    status: 201,
    description: '효과성 검증이 성공적으로 등록되었습니다.',
  })
  @ApiResponse({ status: 404, description: 'CAPA를 찾을 수 없음' })
  async addEffectivenessCheck(
    @Param('capaId') capaId: string,
    @Body() dto: CreateEffectivenessCheckDto,
  ) {
    return this.capaService.addEffectivenessCheck(capaId, dto);
  }

  /**
   * 효과성 검증 이력 조회
   */
  @Get(':capaId/effectiveness-checks')
  @ApiOperation({
    summary: '효과성 검증 이력 조회',
    description: 'CAPA에 대한 효과성 검증 이력을 조회합니다.',
  })
  @ApiParam({ name: 'capaId', description: 'CAPA ID', example: 'CAPA-20260319-001' })
  @ApiResponse({
    status: 200,
    description: '효과성 검증 이력 조회 성공',
  })
  @ApiResponse({ status: 404, description: 'CAPA를 찾을 수 없음' })
  async getEffectivenessChecks(
    @Param('capaId') capaId: string,
  ) {
    return this.capaService.getEffectivenessChecks(capaId);
  }
}
