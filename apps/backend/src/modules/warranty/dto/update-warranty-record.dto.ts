import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { WarrantyStatus } from '../entities/warranty-record.entity';

/**
 * 보증 기록 수정 DTO
 */
export class UpdateWarrantyRecordDto {
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
    description: '시리얼 번호',
    example: 'SN123456789',
  })
  @IsOptional()
  @IsString()
  serialNo?: string;

  @ApiPropertyOptional({
    description: '판매일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  saleDate?: string;

  @ApiPropertyOptional({
    description: '보증 기간(월)',
    example: 12,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  warrantyPeriodMonths?: number;

  @ApiPropertyOptional({
    description: '보증 만료일',
    example: '2025-03-19',
  })
  @IsOptional()
  @IsDateString()
  warrantyExpiryDate?: string;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '고객명',
    example: 'ABC Electronics',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: WarrantyStatus,
    example: WarrantyStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(WarrantyStatus)
  status?: WarrantyStatus;

  @ApiPropertyOptional({
    description: '비고',
    example: '특수 보증 적용',
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
