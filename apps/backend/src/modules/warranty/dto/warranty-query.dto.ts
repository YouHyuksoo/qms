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
import { WarrantyStatus } from '../entities/warranty-record.entity';

/**
 * 보증 기록 조회 DTO
 */
export class WarrantyQueryDto {
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
    description: '정렬 기준 필드',
    example: 'saleDate',
    default: 'saleDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'saleDate';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: '보증 ID',
    example: 'WAR-20240319-001',
  })
  @IsOptional()
  @IsString()
  warrantyId?: string;

  @ApiPropertyOptional({
    description: '보증 번호',
    example: 'WRT-2024-001',
  })
  @IsOptional()
  @IsString()
  warrantyNo?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '시리얼 번호',
    example: 'SN123456789',
  })
  @IsOptional()
  @IsString()
  serialNo?: string;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: WarrantyStatus,
    example: WarrantyStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(WarrantyStatus)
  status?: WarrantyStatus;

  @ApiPropertyOptional({
    description: '판매일 (시작)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  saleDateFrom?: string;

  @ApiPropertyOptional({
    description: '판매일 (종료)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  saleDateTo?: string;

  @ApiPropertyOptional({
    description: 'N일 내에 만료되는 보증 조회',
    example: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  expiringInDays?: number;
}
