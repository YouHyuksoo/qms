import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * PPM 계산 DTO
 */
export class CalculatePpmDto {
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
    description: '고객 코드 필터',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;
}

/**
 * 비용 분석 DTO
 */
export class WarrantyCostAnalysisDto {
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
    description: '그룹화 기준',
    enum: ['ITEM', 'CUSTOMER', 'PERIOD'],
    example: 'ITEM',
    default: 'ITEM',
  })
  @IsOptional()
  @IsString()
  groupBy?: 'ITEM' | 'CUSTOMER' | 'PERIOD' = 'ITEM';
}
