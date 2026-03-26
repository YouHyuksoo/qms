/**
 * @file equipment-query.dto.ts
 * @description 계측기 목록 조회 DTO
 *
 * 초보자 가이드:
 * - GET /equipment 요청 시 Query String으로 전달되는 필터/페이지네이션 파라미터입니다.
 * - @Type(() => Number) 는 문자열로 들어오는 쿼리 파라미터를 숫자로 변환합니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EquipmentStatus } from '../entities/equipment.entity';

/**
 * 계측기 조회 DTO
 */
export class EquipmentQueryDto {
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
    description: '계측기 관리번호',
    example: 'EQ-2026-001',
  })
  @IsOptional()
  @IsString()
  equipmentNo?: string;

  @ApiPropertyOptional({
    description: '계측기명',
    example: '디지털 캘리퍼스',
  })
  @IsOptional()
  @IsString()
  equipmentName?: string;

  @ApiPropertyOptional({
    description: '계측기 유형',
    example: '캘리퍼스',
  })
  @IsOptional()
  @IsString()
  equipmentType?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: EquipmentStatus,
    example: EquipmentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;

  @ApiPropertyOptional({
    description: '관리 부서',
    example: '품질관리부',
  })
  @IsOptional()
  @IsString()
  department?: string;
}
