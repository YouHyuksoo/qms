/**
 * @file trace-query.dto.ts
 * @description 추적 데이터 목록 조회 DTO
 *
 * 로트 추적 데이터를 필터링하여 조회할 때 사용합니다.
 * lotNo, itemCode, traceType, 날짜 범위로 필터링할 수 있으며,
 * 페이지네이션과 정렬을 지원합니다.
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
import { TraceType } from '../entities/lot-trace.entity';

/**
 * 추적 데이터 조회 DTO
 */
export class TraceQueryDto {
  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지 크기',
    example: 20,
    default: 20,
  })
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

  @ApiPropertyOptional({
    description: '로트번호',
    example: 'LOT-20260319-001',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '추적 유형',
    enum: TraceType,
    example: TraceType.PRODUCTION,
  })
  @IsOptional()
  @IsEnum(TraceType)
  traceType?: TraceType;

  @ApiPropertyOptional({
    description: '생산일 (시작)',
    example: '2026-03-01',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: '생산일 (종료)',
    example: '2026-03-31',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
