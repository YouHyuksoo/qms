/**
 * @file update-evaluation.dto.ts
 * @description 공급업체 평가 수정 DTO
 *
 * 기존 공급업체 평가를 수정할 때 사용하는 데이터 전송 객체입니다.
 * 모든 필드가 선택적(optional)입니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { EvalGrade } from '../entities/supplier-evaluation.entity';

/**
 * 공급업체 평가 수정 DTO
 */
export class UpdateEvaluationDto {
  @ApiPropertyOptional({ description: '공급업체 코드', example: 'SUP-001' })
  @IsOptional()
  @IsString()
  supplierCode?: string;

  @ApiPropertyOptional({ description: '공급업체명', example: '대한부품' })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiPropertyOptional({ description: '평가 기간', example: '2024-Q1' })
  @IsOptional()
  @IsString()
  evaluationPeriod?: string;

  @ApiPropertyOptional({ description: '품질 점수 (0-100)', example: 85.5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  qualityScore?: number;

  @ApiPropertyOptional({ description: '납기 점수 (0-100)', example: 90.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  deliveryScore?: number;

  @ApiPropertyOptional({ description: '가격 점수 (0-100)', example: 75.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priceScore?: number;

  @ApiPropertyOptional({ description: '협조 점수 (0-100)', example: 88.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  cooperationScore?: number;

  @ApiPropertyOptional({ description: '종합 점수 (0-100)', example: 84.6 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  totalScore?: number;

  @ApiPropertyOptional({ description: '등급', enum: EvalGrade, example: EvalGrade.B })
  @IsOptional()
  @IsEnum(EvalGrade)
  grade?: EvalGrade;

  @ApiPropertyOptional({ description: 'PPM', example: 150.5 })
  @IsOptional()
  @IsNumber()
  ppm?: number;

  @ApiPropertyOptional({ description: '부적합 건수', example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  ncrCount?: number;

  @ApiPropertyOptional({ description: 'SCAR 건수', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  scarCount?: number;

  @ApiPropertyOptional({ description: '평가자', example: '김품질' })
  @IsOptional()
  @IsString()
  evaluatedBy?: string;

  @ApiPropertyOptional({ description: '평가일', example: '2024-03-31' })
  @IsOptional()
  @IsDateString()
  evaluationDate?: string;

  @ApiPropertyOptional({ description: '비고', example: '정기 분기 평가' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '수정자', example: 'admin' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
