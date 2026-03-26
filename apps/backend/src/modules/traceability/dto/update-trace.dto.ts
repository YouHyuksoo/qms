/**
 * @file update-trace.dto.ts
 * @description 추적 데이터 수정 DTO
 *
 * 기존 로트 추적 데이터를 수정할 때 사용하는 DTO입니다.
 * 모든 필드가 선택적(optional)이며, 전달된 필드만 업데이트됩니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { TraceType } from '../entities/lot-trace.entity';

/**
 * 추적 데이터 수정 DTO
 */
export class UpdateTraceDto {
  @ApiPropertyOptional({
    description: '로트번호',
    example: 'LOT-20260319-001',
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
    example: '알루미늄 프레임',
  })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiPropertyOptional({
    description: '추적 유형',
    enum: TraceType,
    example: TraceType.PRODUCTION,
  })
  @IsOptional()
  @IsEnum(TraceType)
  traceType?: TraceType;

  @ApiPropertyOptional({
    description: '상위 로트번호',
    example: 'LOT-20260318-001',
  })
  @IsOptional()
  @IsString()
  parentLotNo?: string;

  @ApiPropertyOptional({
    description: '공정코드',
    example: 'PROC-001',
  })
  @IsOptional()
  @IsString()
  processCode?: string;

  @ApiPropertyOptional({
    description: '공정명',
    example: 'CNC 가공',
  })
  @IsOptional()
  @IsString()
  processName?: string;

  @ApiPropertyOptional({
    description: '설비 ID',
    example: 'EQ-001',
  })
  @IsOptional()
  @IsString()
  equipmentId?: string;

  @ApiPropertyOptional({
    description: '작업자 ID',
    example: 'OP-001',
  })
  @IsOptional()
  @IsString()
  operatorId?: string;

  @ApiPropertyOptional({
    description: '작업자명',
    example: '김작업',
  })
  @IsOptional()
  @IsString()
  operatorName?: string;

  @ApiPropertyOptional({
    description: '생산일',
    example: '2026-03-19',
  })
  @IsOptional()
  @IsDateString()
  productionDate?: string;

  @ApiPropertyOptional({
    description: '생산라인',
    example: 'LINE-A',
  })
  @IsOptional()
  @IsString()
  productionLine?: string;

  @ApiPropertyOptional({
    description: '공급업체 코드',
    example: 'SUP-001',
  })
  @IsOptional()
  @IsString()
  supplierCode?: string;

  @ApiPropertyOptional({
    description: '고객사 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '출하번호',
    example: 'SHP-20260319-001',
  })
  @IsOptional()
  @IsString()
  shipmentNo?: string;

  @ApiPropertyOptional({
    description: '출하일',
    example: '2026-03-20',
  })
  @IsOptional()
  @IsDateString()
  shipmentDate?: string;

  @ApiPropertyOptional({
    description: '수량',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  qty?: number;

  @ApiPropertyOptional({
    description: '검사 로트번호',
    example: 'INS-LOT-001',
  })
  @IsOptional()
  @IsString()
  inspectionLotNo?: string;

  @ApiPropertyOptional({
    description: '검사 결과 (PASS / FAIL)',
    example: 'PASS',
  })
  @IsOptional()
  @IsString()
  inspectionResult?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '수정됨',
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
