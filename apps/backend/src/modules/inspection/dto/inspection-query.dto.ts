import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InspectionType, InspectionJudgment, InspectionStatus } from '../entities/inspection-lot.entity';

/**
 * 검사 로트 조회 쿼리 DTO
 */
export class InspectionQueryDto {
  @ApiPropertyOptional({
    description: '로트 번호',
    example: 'LOT-20240319',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '품목명',
    example: '알루미늄 케이스',
  })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiPropertyOptional({
    description: '검사 유형',
    enum: InspectionType,
    example: InspectionType.IQC,
  })
  @IsOptional()
  @IsEnum(InspectionType)
  inspectionType?: InspectionType;

  @ApiPropertyOptional({
    description: '검사일 시작',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsDateString()
  inspectionDateFrom?: string;

  @ApiPropertyOptional({
    description: '검사일 종료',
    example: '2024-03-31',
  })
  @IsOptional()
  @IsDateString()
  inspectionDateTo?: string;

  @ApiPropertyOptional({
    description: '검사자',
    example: '김품질',
  })
  @IsOptional()
  @IsString()
  inspector?: string;

  @ApiPropertyOptional({
    description: '판정',
    enum: InspectionJudgment,
    example: InspectionJudgment.PASS,
  })
  @IsOptional()
  @IsEnum(InspectionJudgment)
  judgment?: InspectionJudgment;

  @ApiPropertyOptional({
    description: '상태',
    enum: InspectionStatus,
    example: InspectionStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(InspectionStatus)
  status?: InspectionStatus;

  @ApiPropertyOptional({
    description: '공급업체 코드',
    example: 'SUP-001',
  })
  @IsOptional()
  @IsString()
  supplierCode?: string;

  @ApiPropertyOptional({
    description: 'NCR 번호',
    example: 'NCR-20240319-001',
  })
  @IsOptional()
  @IsString()
  ncrNo?: string;

  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지 크기',
    example: 20,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '정렬 필드',
    example: 'inspectionDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'inspectionDate';

  @ApiPropertyOptional({
    description: '정렬 방향',
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
