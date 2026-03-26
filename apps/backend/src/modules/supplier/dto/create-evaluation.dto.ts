/**
 * @file create-evaluation.dto.ts
 * @description 공급업체 평가 생성 DTO
 *
 * 새로운 공급업체 평가를 등록할 때 사용하는 데이터 전송 객체입니다.
 * 품질/납기/가격/협조 점수 및 종합 점수, 등급 등을 포함합니다.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
 * 공급업체 평가 생성 DTO
 */
export class CreateEvaluationDto {
  @ApiProperty({ description: '평가 ID', example: 'EVAL-2024-Q1-001' })
  @IsString()
  evaluationId: string;

  @ApiProperty({ description: '공급업체 코드', example: 'SUP-001' })
  @IsString()
  supplierCode: string;

  @ApiPropertyOptional({ description: '공급업체명', example: '대한부품' })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiProperty({ description: '평가 기간', example: '2024-Q1' })
  @IsString()
  evaluationPeriod: string;

  @ApiProperty({ description: '품질 점수 (0-100)', example: 85.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  qualityScore: number;

  @ApiProperty({ description: '납기 점수 (0-100)', example: 90.0 })
  @IsNumber()
  @Min(0)
  @Max(100)
  deliveryScore: number;

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

  @ApiProperty({ description: '종합 점수 (0-100)', example: 84.6 })
  @IsNumber()
  @Min(0)
  @Max(100)
  totalScore: number;

  @ApiProperty({ description: '등급', enum: EvalGrade, example: EvalGrade.B })
  @IsEnum(EvalGrade)
  grade: EvalGrade;

  @ApiPropertyOptional({ description: 'PPM', example: 150.5 })
  @IsOptional()
  @IsNumber()
  ppm?: number;

  @ApiPropertyOptional({ description: '부적합 건수', example: 3, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  ncrCount?: number;

  @ApiPropertyOptional({ description: 'SCAR 건수', example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  scarCount?: number;

  @ApiPropertyOptional({ description: '평가자', example: '김품질' })
  @IsOptional()
  @IsString()
  evaluatedBy?: string;

  @ApiProperty({ description: '평가일', example: '2024-03-31' })
  @IsDateString()
  evaluationDate: string;

  @ApiPropertyOptional({ description: '비고', example: '정기 분기 평가' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '생성자', example: 'admin' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
