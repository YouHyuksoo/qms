import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * PPAP 제출 승인 DTO
 */
export class ApproveSubmissionDto {
  @ApiProperty({
    description: '승인자',
    example: '김승인',
  })
  @IsString()
  reviewedBy: string;

  @ApiPropertyOptional({
    description: '승인일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  reviewDate?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '모든 문서 확인 완료',
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

/**
 * PPAP 제출 반려 DTO
 */
export class RejectSubmissionDto {
  @ApiProperty({
    description: '반려 사유',
    example: '문서 누락으로 인한 반려',
  })
  @IsString()
  reason: string;

  @ApiProperty({
    description: '반려자',
    example: '김반려',
  })
  @IsString()
  reviewedBy: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '추가 자료 필요',
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

/**
 * PPAP 재제출 DTO
 */
export class ResubmitSubmissionDto {
  @ApiProperty({
    description: '재제출자',
    example: '김재출',
  })
  @IsString()
  resubmittedBy: string;

  @ApiPropertyOptional({
    description: '재제출일',
    example: '2024-03-26',
  })
  @IsOptional()
  @IsDateString()
  resubmissionDate?: string;

  @ApiPropertyOptional({
    description: '개선 사항',
    example: '누락된 문서 추가 제출',
  })
  @IsOptional()
  @IsString()
  improvements?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '반려 사항 수정 완료',
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
 * PPAP 임시 승인 DTO
 */
export class InterimApproveSubmissionDto {
  @ApiProperty({
    description: '승인자',
    example: '김승인',
  })
  @IsString()
  reviewedBy: string;

  @ApiProperty({
    description: '조건부 승인 사유',
    example: '일부 항목 제외 조건부 승인',
  })
  @IsString()
  conditionReason: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '추가 자료 2주 내 제출 필요',
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
