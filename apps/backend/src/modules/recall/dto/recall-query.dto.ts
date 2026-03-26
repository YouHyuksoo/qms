import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { RecallRiskLevel, RecallStatus } from '../entities/recall-campaign.entity';

/**
 * 리콜 조회 DTO
 */
export class RecallQueryDto {
  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수',
    example: 20,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '정렬 기준 필드',
    example: 'startDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'startDate';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: '리콜 ID',
    example: 'REC-20240319-001',
  })
  @IsOptional()
  @IsString()
  recallId?: string;

  @ApiPropertyOptional({
    description: '리콜 번호',
    example: 'RCL-2024-001',
  })
  @IsOptional()
  @IsString()
  recallNo?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '위험 등급',
    enum: RecallRiskLevel,
  })
  @IsOptional()
  @IsEnum(RecallRiskLevel)
  riskLevel?: RecallRiskLevel;

  @ApiPropertyOptional({
    description: '상태',
    enum: RecallStatus,
  })
  @IsOptional()
  @IsEnum(RecallStatus)
  status?: RecallStatus;

  @ApiPropertyOptional({
    description: '시작일 범위 시작',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @ApiPropertyOptional({
    description: '시작일 범위 종료',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  startDateTo?: string;
}

/**
 * 리콜 로트 조회 DTO
 */
export class RecallLotQueryDto {
  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지당 항목 수',
    example: 20,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '리콜 ID',
    example: 'REC-20240319-001',
  })
  @IsOptional()
  @IsString()
  recallId?: string;

  @ApiPropertyOptional({
    description: '로트 번호',
    example: 'LOT-20240315-001',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '상태',
    example: 'IDENTIFIED',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
