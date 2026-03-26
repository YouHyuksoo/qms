import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { InspectionResult } from '../entities/initial-sample.entity';

/**
 * 검사 항목 추가 DTO
 */
export class AddInspectionItemDto {
  @ApiProperty({
    description: '항목 ID',
    example: 'ITEM-20240319-001',
  })
  @IsString()
  itemId: string;

  @ApiProperty({
    description: '검사 항목명',
    example: '외경',
  })
  @IsString()
  inspectionItem: string;

  @ApiPropertyOptional({
    description: '검사 항목 코드',
    example: 'DIAM-01',
  })
  @IsOptional()
  @IsString()
  inspectionItemCode?: string;

  @ApiPropertyOptional({
    description: '규격 최소값',
    example: 99.5,
  })
  @IsOptional()
  @IsNumber()
  specMin?: number;

  @ApiPropertyOptional({
    description: '규격 최대값',
    example: 100.5,
  })
  @IsOptional()
  @IsNumber()
  specMax?: number;

  @ApiPropertyOptional({
    description: '규격 기준값',
    example: 100.0,
  })
  @IsOptional()
  @IsNumber()
  specNominal?: number;

  @ApiPropertyOptional({
    description: '규격 공차',
    example: 0.5,
  })
  @IsOptional()
  @IsNumber()
  specTolerance?: number;

  @ApiPropertyOptional({
    description: '단위',
    example: 'mm',
  })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({
    description: '측정값',
    example: 100.2,
  })
  @IsOptional()
  @IsNumber()
  measuredValue?: number;

  @ApiPropertyOptional({
    description: '복수 측정값 (콤마 구분)',
    example: '100.1, 100.2, 100.3, 100.1, 100.2',
  })
  @IsOptional()
  @IsString()
  measuredValues?: string;

  @ApiPropertyOptional({
    description: '판정',
    enum: InspectionResult,
    example: InspectionResult.PASS,
  })
  @IsOptional()
  @IsEnum(InspectionResult)
  judgment?: InspectionResult;

  @ApiPropertyOptional({
    description: '중요 항목 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isCritical?: boolean;

  @ApiPropertyOptional({
    description: '검사 방법',
    example: 'Caliper',
  })
  @IsOptional()
  @IsString()
  inspectionMethod?: string;

  @ApiPropertyOptional({
    description: '검사 장비',
    example: 'Digital Caliper Mitutoyo',
  })
  @IsOptional()
  @IsString()
  inspectionEquipment?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '중요 치수',
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    description: '생성자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

/**
 * 검사 항목 수정 DTO
 */
export class UpdateInspectionItemDto {
  @ApiPropertyOptional({
    description: '측정값',
    example: 100.2,
  })
  @IsOptional()
  @IsNumber()
  measuredValue?: number;

  @ApiPropertyOptional({
    description: '복수 측정값 (콤마 구분)',
    example: '100.1, 100.2, 100.3, 100.1, 100.2',
  })
  @IsOptional()
  @IsString()
  measuredValues?: string;

  @ApiPropertyOptional({
    description: '판정',
    enum: InspectionResult,
    example: InspectionResult.PASS,
  })
  @IsOptional()
  @IsEnum(InspectionResult)
  judgment?: InspectionResult;

  @ApiPropertyOptional({
    description: '비고',
    example: '측정 완료',
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    description: '수정자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
