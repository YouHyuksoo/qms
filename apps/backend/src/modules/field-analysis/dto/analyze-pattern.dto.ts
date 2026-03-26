import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * 패턴 분석 DTO
 */
export class AnalyzePatternDto {
  @ApiProperty({
    description: '분석 기간 시작일',
    example: '2024-01-01',
  })
  @IsDateString()
  dateFrom: string;

  @ApiProperty({
    description: '분석 기간 종료일',
    example: '2024-12-31',
  })
  @IsDateString()
  dateTo: string;

  @ApiPropertyOptional({
    description: '품목 코드 필터',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '불량 모드 필터',
    example: '균열',
  })
  @IsOptional()
  @IsString()
  failureMode?: string;

  @ApiPropertyOptional({
    description: '생산 라인 필터',
    example: 'LINE-A',
  })
  @IsOptional()
  @IsString()
  productionLine?: string;

  @ApiPropertyOptional({
    description: '장비 ID 필터',
    example: 'EQP-001',
  })
  @IsOptional()
  @IsString()
  equipmentId?: string;

  @ApiPropertyOptional({
    description: '최소 발생 횟수',
    example: 2,
  })
  @IsOptional()
  minOccurrences?: number;
}

/**
 * 공통 요인 분석 DTO
 */
export class CommonFactorsDto {
  @ApiProperty({
    description: '분석 기간 시작일',
    example: '2024-01-01',
  })
  @IsDateString()
  dateFrom: string;

  @ApiProperty({
    description: '분석 기간 종료일',
    example: '2024-12-31',
  })
  @IsDateString()
  dateTo: string;

  @ApiPropertyOptional({
    description: '품목 코드 필터',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '불량 모드 필터',
    example: '균열',
  })
  @IsOptional()
  @IsString()
  failureMode?: string;
}

/**
 * 대책 효과 검증 DTO
 */
export class VerifyCountermeasureDto {
  @ApiProperty({
    description: '불량 모드',
    example: '균열',
  })
  @IsString()
  failureMode: string;

  @ApiProperty({
    description: '대책 시행일',
    example: '2024-06-01',
  })
  @IsDateString()
  countermeasureDate: string;

  @ApiProperty({
    description: '비교 기간(일)',
    example: 90,
  })
  comparisonPeriodDays: number;

  @ApiPropertyOptional({
    description: '품목 코드 필터',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;
}

/**
 * 대책 효과 검증 결과
 */
export interface CountermeasureVerificationResult {
  failureMode: string;
  countermeasureDate: string;
  beforePeriod: {
    startDate: string;
    endDate: string;
    failureCount: number;
    avgFailuresPerMonth: number;
  };
  afterPeriod: {
    startDate: string;
    endDate: string;
    failureCount: number;
    avgFailuresPerMonth: number;
  };
  improvement: {
    absoluteReduction: number;
    percentageReduction: number;
    isEffective: boolean;
  };
}
