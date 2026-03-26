/**
 * @file competency-query.dto.ts
 * @description 역량 목록 조회 쿼리 DTO
 *
 * 역량 목록을 필터링/페이지네이션하여 조회할 때 사용합니다.
 * 필터: employeeId, department, processCode, competencyLevel, isQualified
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CompetencyLevel } from '../entities/employee-competency.entity';

/**
 * 역량 조회 DTO
 */
export class CompetencyQueryDto {
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

  @ApiPropertyOptional({ description: '직원 ID', example: 'EMP-001' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ description: '부서', example: '품질관리팀' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: '담당 공정 코드', example: 'PROC-001' })
  @IsOptional()
  @IsString()
  processCode?: string;

  @ApiPropertyOptional({
    description: '역량 수준',
    enum: CompetencyLevel,
    example: CompetencyLevel.ADVANCED,
  })
  @IsOptional()
  @IsEnum(CompetencyLevel)
  competencyLevel?: CompetencyLevel;

  @ApiPropertyOptional({ description: '자격 유효 여부', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isQualified?: boolean;
}
