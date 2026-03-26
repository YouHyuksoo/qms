/**
 * @file create-effectiveness-check.dto.ts
 * @description 효과성 검증 등록 DTO
 *
 * CAPA에 대한 효과성 검증을 등록할 때 사용하는 데이터 전송 객체입니다.
 *
 * 초보자 가이드:
 * - checkId는 고유한 검증 ID입니다.
 * - scheduledDate는 검증 예정일, actualDate는 실제 검증일입니다.
 * - result로 EFFECTIVE, NOT_EFFECTIVE, PARTIALLY_EFFECTIVE 중 하나를 지정합니다.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';
import { EffectivenessResult } from '../entities/effectiveness-check.entity';

/**
 * 효과성 검증 등록 DTO
 */
export class CreateEffectivenessCheckDto {
  @ApiProperty({ description: '검증 ID', example: 'EC-20260319-001' })
  @IsString()
  @MaxLength(50)
  checkId: string;

  @ApiProperty({ description: '검증 차수', example: 1 })
  @IsNumber()
  @Min(1)
  checkNo: number;

  @ApiProperty({ description: '예정일', example: '2026-05-01' })
  @IsDateString()
  scheduledDate: string;

  @ApiPropertyOptional({ description: '실제 검증일', example: '2026-05-01' })
  @IsOptional()
  @IsDateString()
  actualDate?: string;

  @ApiPropertyOptional({ description: '검증자', example: '박검증' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  checkedBy?: string;

  @ApiPropertyOptional({
    description: '검증 결과',
    enum: EffectivenessResult,
  })
  @IsOptional()
  @IsEnum(EffectivenessResult)
  result?: EffectivenessResult;

  @ApiPropertyOptional({ description: '증빙 자료' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  evidence?: string;

  @ApiPropertyOptional({ description: '재발 여부', default: false })
  @IsOptional()
  @IsBoolean()
  recurrenceFound?: boolean;

  @ApiPropertyOptional({ description: '비고' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;
}
