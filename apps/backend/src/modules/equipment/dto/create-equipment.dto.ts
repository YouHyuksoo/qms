/**
 * @file create-equipment.dto.ts
 * @description 계측기 등록 DTO
 *
 * 초보자 가이드:
 * - 새 계측기를 등록할 때 사용하는 데이터 전송 객체입니다.
 * - @ApiProperty 는 Swagger 문서 자동 생성에 활용됩니다.
 * - class-validator 데코레이터로 입력값 유효성을 검증합니다.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { EquipmentStatus } from '../entities/equipment.entity';

/**
 * 계측기 생성 DTO
 */
export class CreateEquipmentDto {
  @ApiProperty({ description: '계측기 ID', example: 'EQP-20260319-001' })
  @IsString()
  @MaxLength(50)
  equipmentId: string;

  @ApiProperty({ description: '계측기 관리번호', example: 'EQ-2026-001' })
  @IsString()
  @MaxLength(50)
  equipmentNo: string;

  @ApiProperty({ description: '계측기명', example: '디지털 캘리퍼스' })
  @IsString()
  @MaxLength(200)
  equipmentName: string;

  @ApiProperty({
    description: '계측기 유형',
    example: '캘리퍼스',
  })
  @IsString()
  @MaxLength(100)
  equipmentType: string;

  @ApiPropertyOptional({ description: '제조사', example: 'Mitutoyo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  manufacturer?: string;

  @ApiPropertyOptional({ description: '모델번호', example: 'CD-15CPX' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  modelNo?: string;

  @ApiPropertyOptional({ description: '시리얼번호', example: 'SN-12345678' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialNo?: string;

  @ApiPropertyOptional({
    description: '사양 (측정 범위/분해능)',
    example: '0-150mm / 0.01mm',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specification?: string;

  @ApiPropertyOptional({ description: '사용 위치', example: '품질검사실 A동' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ description: '관리 부서', example: '품질관리부' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: EquipmentStatus,
    default: EquipmentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;

  @ApiPropertyOptional({ description: '구매일', example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional({
    description: '교정주기 (일)',
    example: 365,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  calibrationCycle?: number;

  @ApiPropertyOptional({ description: '최종 교정일', example: '2025-06-01' })
  @IsOptional()
  @IsDateString()
  lastCalibrationDate?: string;

  @ApiPropertyOptional({ description: '차기 교정 예정일', example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  nextCalibrationDate?: string;

  @ApiPropertyOptional({
    description: '교정기관명',
    example: '한국표준과학연구원',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  calibrationLabName?: string;

  @ApiPropertyOptional({
    description: 'ISO 17025 인증번호',
    example: 'KOLAS-T-1234',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  calibrationLabCert?: string;

  @ApiPropertyOptional({ description: '비고', example: '정밀 측정 전용' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;

  @ApiPropertyOptional({ description: '생성자', example: 'admin' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
