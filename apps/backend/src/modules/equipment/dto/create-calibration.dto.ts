/**
 * @file create-calibration.dto.ts
 * @description 교정 결과 등록 DTO
 *
 * 초보자 가이드:
 * - 계측기 교정을 수행한 후 결과를 등록할 때 사용합니다.
 * - measuredValues, standardValues, affectedLots 는 JSON 문자열로 전달합니다.
 * - isOot가 true면 해당 계측기의 status가 OOT로 변경됩니다.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import {
  CalibrationType,
  CalibrationResult,
} from '../entities/calibration.entity';

/**
 * 교정 결과 등록 DTO
 */
export class CreateCalibrationDto {
  @ApiProperty({ description: '교정 ID', example: 'CAL-20260319-001' })
  @IsString()
  @MaxLength(50)
  calibrationId: string;

  @ApiProperty({ description: '교정 번호', example: 'CAL-2026-001' })
  @IsString()
  @MaxLength(50)
  calibrationNo: string;

  @ApiProperty({
    description: '교정 유형',
    enum: CalibrationType,
    example: CalibrationType.EXTERNAL,
  })
  @IsEnum(CalibrationType)
  calibrationType: CalibrationType;

  @ApiProperty({ description: '교정일', example: '2026-03-19' })
  @IsDateString()
  calibrationDate: string;

  @ApiPropertyOptional({ description: '교정 수행자', example: '김교정' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  calibratedBy?: string;

  @ApiPropertyOptional({
    description: '외부 교정기관명',
    example: '한국표준과학연구원',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  externalLabName?: string;

  @ApiProperty({
    description: '교정 결과',
    enum: CalibrationResult,
    example: CalibrationResult.PASS,
  })
  @IsEnum(CalibrationResult)
  result: CalibrationResult;

  @ApiPropertyOptional({
    description: '성적서 번호',
    example: 'CERT-2026-0001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  certificateNo?: string;

  @ApiPropertyOptional({
    description: '측정값 (JSON)',
    example: '[{"point":"50mm","value":"50.02mm"}]',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  measuredValues?: string;

  @ApiPropertyOptional({
    description: '표준값 (JSON)',
    example: '[{"point":"50mm","standard":"50.00mm"}]',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  standardValues?: string;

  @ApiPropertyOptional({
    description: '편차',
    example: '+0.02mm',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  deviation?: string;

  @ApiPropertyOptional({
    description: '불확도',
    example: 'U=0.01mm (k=2)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  uncertainty?: string;

  @ApiPropertyOptional({
    description: '차기 교정 예정일',
    example: '2027-03-19',
  })
  @IsOptional()
  @IsDateString()
  nextCalibrationDate?: string;

  @ApiPropertyOptional({
    description: 'OOT 여부',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isOot?: boolean;

  @ApiPropertyOptional({
    description: 'OOT 시 조치내용',
    example: '재교정 후 사용 재개',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  ootAction?: string;

  @ApiPropertyOptional({
    description: '영향받는 로트 (JSON)',
    example: '["LOT-2026-001","LOT-2026-002"]',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  affectedLots?: string;

  @ApiPropertyOptional({ description: '비고', example: '정기 교정' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}
