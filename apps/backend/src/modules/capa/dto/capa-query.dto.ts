/**
 * @file capa-query.dto.ts
 * @description CAPA 조회 쿼리 DTO
 *
 * CAPA 목록 조회 시 페이지네이션과 필터링에 사용하는 데이터 전송 객체입니다.
 *
 * 초보자 가이드:
 * - page/limit으로 페이지네이션을 제어합니다.
 * - capaNo, capaType, status, priority, assignedTo 등으로 필터링합니다.
 * - dueDateFrom/dueDateTo로 기한 범위를 지정합니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CapaType, CapaPriority, CapaStatus } from '../entities/capa.entity';

/**
 * CAPA 조회 쿼리 DTO
 */
export class CapaQueryDto {
  @ApiPropertyOptional({ description: '페이지 번호', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '페이지 크기', example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '정렬 기준 필드',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'CAPA 번호', example: 'CAPA-2026-001' })
  @IsOptional()
  @IsString()
  capaNo?: string;

  @ApiPropertyOptional({ description: 'CAPA 유형', enum: CapaType })
  @IsOptional()
  @IsEnum(CapaType)
  capaType?: CapaType;

  @ApiPropertyOptional({ description: '상태', enum: CapaStatus })
  @IsOptional()
  @IsEnum(CapaStatus)
  status?: CapaStatus;

  @ApiPropertyOptional({ description: '우선순위', enum: CapaPriority })
  @IsOptional()
  @IsEnum(CapaPriority)
  priority?: CapaPriority;

  @ApiPropertyOptional({ description: '담당자', example: '이조치' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ description: '기한 시작일', example: '2026-03-01' })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @ApiPropertyOptional({ description: '기한 종료일', example: '2026-03-31' })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;
}
