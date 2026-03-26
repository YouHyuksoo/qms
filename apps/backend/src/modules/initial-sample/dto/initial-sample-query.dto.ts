import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InspectionResult, SampleStatus } from '../entities/initial-sample.entity';

/**
 * 초기 샘플 조회 DTO
 */
export class InitialSampleQueryDto {
  @ApiPropertyOptional({
    description: '샘플 ID',
    example: 'IS-20240319-001',
  })
  @IsOptional()
  @IsString()
  sampleId?: string;

  @ApiPropertyOptional({
    description: '프로젝트 번호',
    example: 'APQP-20240319-001',
  })
  @IsOptional()
  @IsString()
  projectNo?: string;

  @ApiPropertyOptional({
    description: '샘플 번호',
    example: 'SAMPLE-001',
  })
  @IsOptional()
  @IsString()
  sampleNo?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

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
    example: SampleStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(SampleStatus)
  status?: SampleStatus;

  @ApiPropertyOptional({
    description: '검사자',
    example: '김검사',
  })
  @IsOptional()
  @IsString()
  inspector?: string;

  @ApiPropertyOptional({
    description: '승인자',
    example: '김승인',
  })
  @IsOptional()
  @IsString()
  approvedBy?: string;

  @ApiPropertyOptional({
    description: '제출일 (시작)',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsString()
  submissionDateFrom?: string;

  @ApiPropertyOptional({
    description: '제출일 (종료)',
    example: '2024-03-31',
  })
  @IsOptional()
  @IsString()
  submissionDateTo?: string;

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
    description: '정렬 기준',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
