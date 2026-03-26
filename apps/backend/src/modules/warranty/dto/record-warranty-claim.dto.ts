import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

/**
 * 보증 클레임 기록 DTO
 */
export class RecordWarrantyClaimDto {
  @ApiProperty({
    description: '클레임 접수일',
    example: '2024-06-15',
  })
  @IsDateString()
  claimDate: string;

  @ApiProperty({
    description: '고장 발생일',
    example: '2024-06-14',
  })
  @IsDateString()
  failureDate: string;

  @ApiProperty({
    description: '고장 설명',
    example: '전원 불량으로 동작하지 않음',
  })
  @IsString()
  failureDescription: string;

  @ApiPropertyOptional({
    description: '고장 부품',
    example: 'Power Supply Unit',
  })
  @IsOptional()
  @IsString()
  failurePart?: string;

  @ApiPropertyOptional({
    description: '고장 원인',
    example: '과전압으로 인한 파손',
  })
  @IsOptional()
  @IsString()
  failureCause?: string;

  @ApiPropertyOptional({
    description: '수리 비용',
    example: 150000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  repairCost?: number;

  @ApiPropertyOptional({
    description: '교체 비용',
    example: 300000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  replacementCost?: number;

  @ApiPropertyOptional({
    description: '인건비',
    example: 50000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  laborCost?: number;

  @ApiPropertyOptional({
    description: '배송 비용',
    example: 20000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingCost?: number;

  @ApiPropertyOptional({
    description: '승인자',
    example: '김승인',
  })
  @IsOptional()
  @IsString()
  claimApprovedBy?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '무상 수리 완료',
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
