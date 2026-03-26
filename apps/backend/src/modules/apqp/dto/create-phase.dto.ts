import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApqpPhaseType, ApqpPhaseStatus } from '../entities/apqp-phase.entity';

/**
 * APQP 단계 생성 DTO
 */
export class CreatePhaseDto {
  @ApiProperty({
    description: '단계 ID',
    example: 'PHASE-20240319-001',
  })
  @IsString()
  phaseId: string;

  @ApiProperty({
    description: '단계 유형',
    enum: ApqpPhaseType,
    example: ApqpPhaseType.PLANNING,
  })
  @IsEnum(ApqpPhaseType)
  phaseType: ApqpPhaseType;

  @ApiProperty({
    description: '단계명',
    example: '계획 및 정의',
  })
  @IsString()
  phaseName: string;

  @ApiPropertyOptional({
    description: '순번',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  sequenceNo?: number;

  @ApiPropertyOptional({
    description: '계획 시작일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @ApiPropertyOptional({
    description: '계획 종료일',
    example: '2024-04-19',
  })
  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @ApiPropertyOptional({
    description: '목표 품질 수준 (%)',
    example: 99.0,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  targetQualityLevel?: number;

  @ApiPropertyOptional({
    description: '단계 상태',
    enum: ApqpPhaseStatus,
    example: ApqpPhaseStatus.NOT_STARTED,
  })
  @IsOptional()
  @IsEnum(ApqpPhaseStatus)
  status?: ApqpPhaseStatus;

  @ApiPropertyOptional({
    description: '비고',
    example: '초기 계획 단계',
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

/**
 * APQP 단계 수정 DTO
 */
export class UpdatePhaseDto {
  @ApiPropertyOptional({
    description: '단계명',
    example: '계획 및 정의',
  })
  @IsOptional()
  @IsString()
  phaseName?: string;

  @ApiPropertyOptional({
    description: '순번',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  sequenceNo?: number;

  @ApiPropertyOptional({
    description: '계획 시작일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @ApiPropertyOptional({
    description: '계획 종료일',
    example: '2024-04-19',
  })
  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @ApiPropertyOptional({
    description: '실제 시작일',
    example: '2024-03-20',
  })
  @IsOptional()
  @IsDateString()
  actualStartDate?: string;

  @ApiPropertyOptional({
    description: '실제 종료일',
    example: '2024-04-18',
  })
  @IsOptional()
  @IsDateString()
  actualEndDate?: string;

  @ApiPropertyOptional({
    description: '목표 품질 수준 (%)',
    example: 99.0,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  targetQualityLevel?: number;

  @ApiPropertyOptional({
    description: '실적 품질 수준 (%)',
    example: 98.5,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  actualQualityLevel?: number;

  @ApiPropertyOptional({
    description: '단계 상태',
    enum: ApqpPhaseStatus,
    example: ApqpPhaseStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(ApqpPhaseStatus)
  status?: ApqpPhaseStatus;

  @ApiPropertyOptional({
    description: '비고',
    example: '초기 계획 단계',
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
