/**
 * @file update-equipment.dto.ts
 * @description 계측기 수정 DTO
 *
 * 초보자 가이드:
 * - 기존 계측기 정보를 수정할 때 사용합니다.
 * - 모든 필드가 Optional이므로, 변경이 필요한 필드만 전송하면 됩니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
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
 * 계측기 수정 DTO
 */
export class UpdateEquipmentDto {
  @ApiPropertyOptional({ description: '계측기명', example: '디지털 캘리퍼스' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  equipmentName?: string;

  @ApiPropertyOptional({ description: '계측기 유형', example: '캘리퍼스' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  equipmentType?: string;

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
    example: EquipmentStatus.ACTIVE,
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

  @ApiPropertyOptional({ description: '수정자', example: 'admin' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
