import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsArray,
} from 'class-validator';

/**
 * 리콜 대상 로트 식별 DTO
 */
export class IdentifyRecallLotsDto {
  @ApiProperty({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsString()
  itemCode: string;

  @ApiPropertyOptional({
    description: '생산일 범위 시작',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  productionDateFrom?: string;

  @ApiPropertyOptional({
    description: '생산일 범위 종료',
    example: '2024-03-31',
  })
  @IsOptional()
  @IsDateString()
  productionDateTo?: string;

  @ApiPropertyOptional({
    description: '특정 로트 목록',
    example: ['LOT-20240315-001', 'LOT-20240316-002'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specificLots?: string[];

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '출하일 범위 시작',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  shipmentDateFrom?: string;

  @ApiPropertyOptional({
    description: '출하일 범위 종료',
    example: '2024-03-31',
  })
  @IsOptional()
  @IsDateString()
  shipmentDateTo?: string;
}
