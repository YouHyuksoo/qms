import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { InspectionJudgment, InspectionStatus } from '../entities/inspection-lot.entity';

/**
 * 검사 로트 수정 DTO
 */
export class UpdateInspectionLotDto {
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
    description: '검사일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  inspectionDate?: string;

  @ApiPropertyOptional({
    description: '검사자',
    example: '김품질',
  })
  @IsOptional()
  @IsString()
  inspector?: string;

  @ApiPropertyOptional({
    description: '로트 수량',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lotQty?: number;

  @ApiPropertyOptional({
    description: '검사 샘플 수량',
    example: 32,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sampleQty?: number;

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
    description: '공급업처이름',
    example: 'ABC공업',
  })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiPropertyOptional({
    description: '발주번호',
    example: 'PO-20240319-001',
  })
  @IsOptional()
  @IsString()
  poNo?: string;

  @ApiPropertyOptional({
    description: '작업지시번호',
    example: 'WO-20240319-001',
  })
  @IsOptional()
  @IsString()
  workOrderNo?: string;

  @ApiPropertyOptional({
    description: 'NCR 번호',
    example: 'NCR-20240319-001',
  })
  @IsOptional()
  @IsString()
  ncrNo?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '긴급 검사 필요',
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
