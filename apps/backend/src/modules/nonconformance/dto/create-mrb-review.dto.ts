import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { DispositionType, ReviewStatus } from '../entities/mrb-review.entity';

/**
 * MRB 심의 생성 DTO
 */
export class CreateMrbReviewDto {
  @ApiProperty({
    description: '심의 ID',
    example: 'MRB-20240319-001-01',
  })
  @IsString()
  reviewId: string;

  @ApiProperty({
    description: 'NCR 번호',
    example: 'NCR-20240319-001',
  })
  @IsString()
  ncrNo: string;

  @ApiProperty({
    description: '심의자',
    example: '김심의',
  })
  @IsString()
  reviewedBy: string;

  @ApiProperty({
    description: '심의일',
    example: '2024-03-19',
  })
  @IsDateString()
  reviewDate: string;

  @ApiPropertyOptional({
    description: '처분 결정',
    enum: DispositionType,
    example: DispositionType.REWORK,
  })
  @IsOptional()
  @IsEnum(DispositionType)
  disposition?: DispositionType;

  @ApiPropertyOptional({
    description: '사유',
    example: '경미한 표면 불량으로 재작업 가능',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: '승인자',
    example: '박승인',
  })
  @IsOptional()
  @IsString()
  approvedBy?: string;

  @ApiPropertyOptional({
    description: '승인일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  approvedDate?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: ReviewStatus,
    example: ReviewStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiPropertyOptional({
    description: '첨부 파일',
    example: 'file1.pdf,file2.pdf',
  })
  @IsOptional()
  @IsString()
  attachments?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '신속 처리 필요',
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
 * 처분 실행 DTO
 */
export class ExecuteDispositionDto {
  @ApiProperty({
    description: '실행 결과',
    example: '재작업 완료, 품질 확인 완료',
  })
  @IsString()
  executionResult: string;

  @ApiPropertyOptional({
    description: '실행자',
    example: '이실행',
  })
  @IsOptional()
  @IsString()
  executedBy?: string;

  @ApiPropertyOptional({
    description: '실행일',
    example: '2024-03-20',
  })
  @IsOptional()
  @IsDateString()
  executionDate?: string;

  @ApiPropertyOptional({
    description: '수정자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
