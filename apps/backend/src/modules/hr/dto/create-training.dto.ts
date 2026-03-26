/**
 * @file create-training.dto.ts
 * @description 교육 등록 DTO
 *
 * 새로운 교육 이력을 등록할 때 사용합니다.
 * 필수: trainingId, employeeId, employeeName, trainingName, trainingDate
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
 * 교육 생성 DTO
 */
export class CreateTrainingDto {
  @ApiProperty({ description: '교육 ID', example: 'TRN-2024-001' })
  @IsString()
  trainingId: string;

  @ApiProperty({ description: '직원 ID', example: 'EMP-001' })
  @IsString()
  employeeId: string;

  @ApiProperty({ description: '직원명', example: '김철수' })
  @IsString()
  employeeName: string;

  @ApiProperty({ description: '교육명', example: '품질관리 기초 교육' })
  @IsString()
  trainingName: string;

  @ApiPropertyOptional({
    description: '교육 유형 (INITIAL, REFRESHER, SPECIAL_PROCESS, SAFETY, QUALITY)',
    example: 'QUALITY',
  })
  @IsOptional()
  @IsString()
  trainingType?: string;

  @ApiProperty({ description: '교육일', example: '2024-03-20' })
  @IsDateString()
  trainingDate: string;

  @ApiPropertyOptional({ description: '완료일', example: '2024-03-22' })
  @IsOptional()
  @IsDateString()
  completionDate?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: TrainingStatus,
    example: TrainingStatus.PLANNED,
    default: TrainingStatus.PLANNED,
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

  @ApiPropertyOptional({ description: '생성자', example: 'admin' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
