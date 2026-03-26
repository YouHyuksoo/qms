import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { InspectionResult, SampleStatus } from '../entities/initial-sample.entity';

/**
 * 초기 샘플 생성 DTO
 */
export class CreateInitialSampleDto {
  @ApiProperty({
    description: '샘플 ID',
    example: 'IS-20240319-001',
  })
  @IsString()
  sampleId: string;

  @ApiProperty({
    description: '프로젝트 번호',
    example: 'APQP-20240319-001',
  })
  @IsString()
  projectNo: string;

  @ApiProperty({
    description: '샘플 번호',
    example: 'SAMPLE-001',
  })
  @IsString()
  sampleNo: string;

  @ApiProperty({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsString()
  itemCode: string;

  @ApiPropertyOptional({
    description: '품목명',
    example: '브레이크 패드',
  })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiPropertyOptional({
    description: '샘플 수량',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  sampleQty?: number;

  @ApiProperty({
    description: '제출일',
    example: '2024-03-19',
  })
  @IsDateString()
  submissionDate: string;

  @ApiPropertyOptional({
    description: '검사자',
    example: '김검사',
  })
  @IsOptional()
  @IsString()
  inspector?: string;

  @ApiPropertyOptional({
    description: '치수 검사 보고서 번호',
    example: 'DIM-2024-001',
  })
  @IsOptional()
  @IsString()
  dimensionalReportNo?: string;

  @ApiPropertyOptional({
    description: '재질 검사 보고서 번호',
    example: 'MAT-2024-001',
  })
  @IsOptional()
  @IsString()
  materialReportNo?: string;

  @ApiPropertyOptional({
    description: '성능 검사 보고서 번호',
    example: 'PERF-2024-001',
  })
  @IsOptional()
  @IsString()
  performanceReportNo?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '초기 샘플 제출',
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
 * 초기 샘플 수정 DTO
 */
export class UpdateInitialSampleDto {
  @ApiPropertyOptional({
    description: '샘플 수량',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  sampleQty?: number;

  @ApiPropertyOptional({
    description: '검사자',
    example: '김검사',
  })
  @IsOptional()
  @IsString()
  inspector?: string;

  @ApiPropertyOptional({
    description: '검사 결과',
    enum: InspectionResult,
    example: InspectionResult.PASS,
  })
  @IsOptional()
  @IsEnum(InspectionResult)
  inspectionResult?: InspectionResult;

  @ApiPropertyOptional({
    description: '상태',
    enum: SampleStatus,
    example: SampleStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(SampleStatus)
  status?: SampleStatus;

  @ApiPropertyOptional({
    description: '검사일',
    example: '2024-03-20',
  })
  @IsOptional()
  @IsDateString()
  inspectionDate?: string;

  @ApiPropertyOptional({
    description: '치수 검사 보고서 번호',
    example: 'DIM-2024-001',
  })
  @IsOptional()
  @IsString()
  dimensionalReportNo?: string;

  @ApiPropertyOptional({
    description: '재질 검사 보고서 번호',
    example: 'MAT-2024-001',
  })
  @IsOptional()
  @IsString()
  materialReportNo?: string;

  @ApiPropertyOptional({
    description: '성능 검사 보고서 번호',
    example: 'PERF-2024-001',
  })
  @IsOptional()
  @IsString()
  performanceReportNo?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '초기 샘플 제출',
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
