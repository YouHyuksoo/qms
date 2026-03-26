/**
 * @file update-training.dto.ts
 * @description 교육 수정 DTO
 *
 * 기존 교육 이력을 수정할 때 사용합니다.
 * 모든 필드가 선택적(optional)입니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { TrainingStatus } from '../entities/training-record.entity';

/**
 * 교육 수정 DTO
 */
export class UpdateTrainingDto {
  @ApiPropertyOptional({ description: '직원명', example: '김철수' })
  @IsOptional()
  @IsString()
  employeeName?: string;

  @ApiPropertyOptional({ description: '교육명', example: '품질관리 기초 교육' })
  @IsOptional()
  @IsString()
  trainingName?: string;

  @ApiPropertyOptional({
    description: '교육 유형 (INITIAL, REFRESHER, SPECIAL_PROCESS, SAFETY, QUALITY)',
    example: 'QUALITY',
  })
  @IsOptional()
  @IsString()
  trainingType?: string;

  @ApiPropertyOptional({ description: '교육일', example: '2024-03-20' })
  @IsOptional()
  @IsDateString()
  trainingDate?: string;

  @ApiPropertyOptional({ description: '완료일', example: '2024-03-22' })
  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: TrainingStatus,
    example: TrainingStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(TrainingStatus)
  status?: TrainingStatus;

  @ApiPropertyOptional({ description: '평가 점수', example: 85 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiPropertyOptional({ description: '합격 여부', example: true })
  @IsOptional()
  @IsBoolean()
  isPassed?: boolean;

  @ApiPropertyOptional({ description: '교육 강사', example: '박강사' })
  @IsOptional()
  @IsString()
  trainer?: string;

  @ApiPropertyOptional({ description: '교육 시간', example: 8 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  trainingHours?: number;

  @ApiPropertyOptional({
    description: '다음 교육 예정일',
    example: '2025-03-20',
  })
  @IsOptional()
  @IsDateString()
  nextTrainingDate?: string;

  @ApiPropertyOptional({ description: '비고', example: '필수 교육' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '수정자', example: 'admin' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
