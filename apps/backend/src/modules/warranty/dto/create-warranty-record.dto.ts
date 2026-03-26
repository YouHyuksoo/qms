import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

/**
 * 보증 기록 생성 DTO
 */
export class CreateWarrantyRecordDto {
  @ApiProperty({
    description: '보증 ID',
    example: 'WAR-20240319-001',
  })
  @IsString()
  warrantyId: string;

  @ApiProperty({
    description: '보증 번호',
    example: 'WRT-2024-001',
  })
  @IsString()
  warrantyNo: string;

  @ApiProperty({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsString()
  itemCode: string;

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

  @ApiProperty({
    description: '판매일',
    example: '2024-03-19',
  })
  @IsDateString()
  saleDate: string;

  @ApiPropertyOptional({
    description: '보증 기간(월)',
    example: 12,
    minimum: 1,
    default: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  warrantyPeriodMonths?: number = 12;

  @ApiProperty({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsString()
  customerCode: string;

  @ApiPropertyOptional({
    description: '고객명',
    example: 'ABC Electronics',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: '판매주문번호',
    example: 'SO-20240319-001',
  })
  @IsOptional()
  @IsString()
  salesOrderNo?: string;

  @ApiPropertyOptional({
    description: '인보이스 번호',
    example: 'INV-20240319-001',
  })
  @IsOptional()
  @IsString()
  invoiceNo?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '특수 보증 적용',
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
