import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * 생산 이력 추적 DTO
 */
export class TraceProductionDto {
  @ApiProperty({
    description: '로트 번호',
    example: 'LOT-20240315-001',
  })
  @IsString()
  lotNo: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;
}

/**
 * 생산 이력 추적 결과
 */
export interface TraceabilityResult {
  lotNo: string;
  itemCode: string;
  itemName?: string;
  productionDate?: string;
  productionLine?: string;
  equipmentId?: string;
  equipmentName?: string;
  operatorId?: string;
  operatorName?: string;
  inspectionLotNo?: string;
  rawMaterialLot?: string;
  supplierCode?: string;
  supplierName?: string;
  inspectionResults?: Array<{
    characteristicName: string;
    measuredValue?: number;
    judgment?: string;
  }>;
  relatedFailures?: Array<{
    failureId: string;
    failureDate: string;
    failureMode: string;
  }>;
}
