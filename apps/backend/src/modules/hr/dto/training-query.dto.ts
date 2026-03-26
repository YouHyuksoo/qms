/**
 * @file training-query.dto.ts
 * @description 교육 목록 조회 쿼리 DTO
 *
 * 교육 목록을 필터링/페이지네이션하여 조회할 때 사용합니다.
 * 필터: employeeId, trainingType, status
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
import { TrainingStatus } from '../entities/training-record.entity';

/**
 * 교육 조회 DTO
 */
export class TrainingQueryDto {
  @ApiPropertyOptional({ description: '페이지 번호', example: 1, default: 1 })
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
    example: 'trainingDate',
    default: 'trainingDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'trainingDate';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: '직원 ID', example: 'EMP-001' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({
    description: '교육 유형 (INITIAL, REFRESHER, SPECIAL_PROCESS, SAFETY, QUALITY)',
    example: 'QUALITY',
  })
  @IsOptional()
  @IsString()
  trainingType?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: TrainingStatus,
    example: TrainingStatus.PLANNED,
  })
  @IsOptional()
  @IsEnum(TrainingStatus)
  status?: TrainingStatus;
}
