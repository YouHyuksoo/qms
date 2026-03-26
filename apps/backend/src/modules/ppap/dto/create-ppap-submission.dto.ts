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
import { PpapSubmissionLevel, PpapStatus } from '../entities/ppap-submission.entity';

/**
 * PPAP 제출 생성 DTO
 */
export class CreatePpapSubmissionDto {
  @ApiProperty({
    description: '제출 ID',
    example: 'PPAP-20240319-001',
  })
  @IsString()
  submissionId: string;

  @ApiProperty({
    description: '프로젝트 번호',
    example: 'APQP-20240319-001',
  })
  @IsString()
  projectNo: string;

  @ApiProperty({
    description: '제출 번호',
    example: 'SUB-001',
  })
  @IsString()
  submissionNo: string;

  @ApiPropertyOptional({
    description: '제출 레벨 (1-5)',
    enum: PpapSubmissionLevel,
    example: PpapSubmissionLevel.LEVEL_3,
  })
  @IsOptional()
  @IsEnum(PpapSubmissionLevel)
  submissionLevel?: PpapSubmissionLevel;

  @ApiPropertyOptional({
    description: '제출일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  submissionDate?: string;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '고객명',
    example: '현대자동차',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'PSW 번호',
    example: 'PSW-20240319-001',
  })
  @IsOptional()
  @IsString()
  pswNo?: string;

  @ApiPropertyOptional({
    description: '승인 기한',
    example: '2024-04-19',
  })
  @IsOptional()
  @IsDateString()
  approvalDeadline?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '초기 제출',
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
 * PPAP 제출 수정 DTO
 */
export class UpdatePpapSubmissionDto {
  @ApiPropertyOptional({
    description: '제출 레벨 (1-5)',
    enum: PpapSubmissionLevel,
    example: PpapSubmissionLevel.LEVEL_3,
  })
  @IsOptional()
  @IsEnum(PpapSubmissionLevel)
  submissionLevel?: PpapSubmissionLevel;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '고객명',
    example: '현대자동차',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'PSW 번호',
    example: 'PSW-20240319-001',
  })
  @IsOptional()
  @IsString()
  pswNo?: string;

  @ApiPropertyOptional({
    description: 'PSW 파일 경로',
    example: '/documents/ppap/psw-001.pdf',
  })
  @IsOptional()
  @IsString()
  pswPath?: string;

  @ApiPropertyOptional({
    description: '승인 기한',
    example: '2024-04-19',
  })
  @IsOptional()
  @IsDateString()
  approvalDeadline?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '초기 제출',
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
