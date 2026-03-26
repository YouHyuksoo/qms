/**
 * @file evaluation-query.dto.ts
 * @description 공급업체 평가 조회 DTO
 *
 * 평가 목록을 조회할 때 사용하는 필터/페이지네이션 DTO입니다.
 * supplierCode, period, grade로 필터링할 수 있습니다.
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
import { EvalGrade } from '../entities/supplier-evaluation.entity';

/**
 * 공급업체 평가 조회 DTO
 */
export class EvaluationQueryDto {
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

  @ApiPropertyOptional({ description: '정렬 기준', example: 'evaluationDate', default: 'evaluationDate' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'evaluationDate';

  @ApiPropertyOptional({ description: '정렬 순서', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: '공급업체 코드', example: 'SUP-001' })
  @IsOptional()
  @IsString()
  supplierCode?: string;

  @ApiPropertyOptional({ description: '평가 기간', example: '2024-Q1' })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({ description: '등급', enum: EvalGrade, example: EvalGrade.A })
  @IsOptional()
  @IsEnum(EvalGrade)
  grade?: EvalGrade;
}
