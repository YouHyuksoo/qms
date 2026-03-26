import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { ResultJudgment } from '../entities/inspection-result.entity';

/**
 * 검사 결과 생성 DTO
 */
export class CreateInspectionResultDto {
  @ApiProperty({
    description: '결과 ID',
    example: 'RES-20240319-001-01',
  })
  @IsString()
  resultId: string;

  @ApiProperty({
    description: '로트 번호',
    example: 'LOT-20240319-001',
  })
  @IsString()
  lotNo: string;

  @ApiProperty({
    description: '검사 특성명',
    example: '외관 (긁힘)',
  })
  @IsString()
  characteristicName: string;

  @ApiPropertyOptional({
    description: '검사 특성 번호',
    example: 'CHAR-001',
  })
  @IsOptional()
  @IsString()
  characteristicNo?: string;

  @ApiPropertyOptional({
    description: '규격 하한',
    example: 10.0,
  })
  @IsOptional()
  @IsDecimal()
  specMin?: number;

  @ApiPropertyOptional({
    description: '규격 상한',
    example: 20.0,
  })
  @IsOptional()
  @IsDecimal()
  specMax?: number;

  @ApiPropertyOptional({
    description: '규격 텍스트',
    example: '무결점',
  })
  @IsOptional()
  @IsString()
  specText?: string;

  @ApiPropertyOptional({
    description: '측정값',
    example: 15.5,
  })
  @IsOptional()
  @IsDecimal()
  measuredValue?: number;

  @ApiPropertyOptional({
    description: '측정 텍스트',
    example: '양호',
  })
  @IsOptional()
  @IsString()
  measuredText?: string;

  @ApiPropertyOptional({
    description: '판정',
    enum: ResultJudgment,
    example: ResultJudgment.PASS,
  })
  @IsOptional()
  @IsEnum(ResultJudgment)
  judgment?: ResultJudgment;

  @ApiPropertyOptional({
    description: '검사 방법',
    example: '시각검사',
  })
  @IsOptional()
  @IsString()
  inspectionMethod?: string;

  @ApiPropertyOptional({
    description: '검사 장비',
    example: '마이크로미터',
  })
  @IsOptional()
  @IsString()
  inspectionEquipment?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '측정 시 주의 필요',
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    description: '순번',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sequenceNo?: number;

  @ApiPropertyOptional({
    description: '생성자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

/**
 * 검사 결과 벌크 생성 DTO
 */
export class BulkCreateInspectionResultDto {
  @ApiProperty({
    description: '검사 결과 목록',
    type: [CreateInspectionResultDto],
  })
  results: CreateInspectionResultDto[];
}
