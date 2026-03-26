import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
} from 'class-validator';
import { RecallRiskLevel } from '../entities/recall-campaign.entity';

/**
 * 리콜 캠페인 생성 DTO
 */
export class CreateRecallCampaignDto {
  @ApiProperty({
    description: '리콜 ID',
    example: 'REC-20240319-001',
  })
  @IsString()
  recallId: string;

  @ApiProperty({
    description: '리콜 번호',
    example: 'RCL-2024-001',
  })
  @IsString()
  recallNo: string;

  @ApiProperty({
    description: '리콜 명칭',
    example: 'ABC 품목 안전 리콜',
  })
  @IsString()
  recallName: string;

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
    description: '영향 받은 로트 목록',
    example: ['LOT-20240315-001', 'LOT-20240316-002'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  affectedLots?: string[];

  @ApiProperty({
    description: '영향 받은 수량',
    example: 1000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  affectedQty: number;

  @ApiProperty({
    description: '리콜 사유',
    example: '안전 기준 미달 발견으로 인한 자발적 리콜',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: '위험 등급',
    enum: RecallRiskLevel,
    example: RecallRiskLevel.HIGH,
  })
  @IsEnum(RecallRiskLevel)
  riskLevel: RecallRiskLevel;

  @ApiProperty({
    description: '시작일',
    example: '2024-03-19',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: '목표 완료일',
    example: '2024-04-19',
  })
  @IsDateString()
  targetCompletionDate: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '긴급 리콜 진행',
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
