import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsDateString,
} from 'class-validator';

/**
 * 리콜 로트 생성 DTO
 */
export class CreateRecallLotDto {
  @ApiProperty({
    description: '리콜 로트 ID',
    example: 'RL-20240319-001',
  })
  @IsString()
  recallLotId: string;

  @ApiProperty({
    description: '로트 번호',
    example: 'LOT-20240315-001',
  })
  @IsString()
  lotNo: string;

  @ApiProperty({
    description: '수량',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  qty: number;

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
    description: '출하일',
    example: '2024-03-15',
  })
  @IsOptional()
  @IsDateString()
  shipmentDate?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '특이사항',
  })
  @IsOptional()
  @IsString()
  remarks?: string;
}

/**
 * 리콜 로트 상태 업데이트 DTO
 */
export class UpdateRecallLotStatusDto {
  @ApiProperty({
    description: '상태',
    enum: ['IDENTIFIED', 'NOTIFIED', 'RETURN_REQUESTED', 'RETURNED', 'DESTROYED', 'REPLACED', 'REPAIRED', 'CLOSED'],
    example: 'RETURNED',
  })
  @IsString()
  status: string;

  @ApiPropertyOptional({
    description: '회수 수량',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  returnQty?: number;

  @ApiPropertyOptional({
    description: '비용',
    example: 500000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({
    description: '완료일',
    example: '2024-03-20',
  })
  @IsOptional()
  @IsDateString()
  completedDate?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '처리 완료',
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


