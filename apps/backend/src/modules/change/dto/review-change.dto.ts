/**
 * @file review-change.dto.ts
 * @description 변경 요청 검토/승인/실행/완료 관련 DTO
 *
 * 변경 요청의 워크플로우 전환에 사용되는 DTO들입니다.
 * - ReviewChangeDto: 검토 시작
 * - ApproveChangeDto: 승인/반려
 * - ImplementChangeDto: 실행 시작
 * - CompleteChangeDto: 완료 처리
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * 변경 요청 검토 DTO
 */
export class ReviewChangeDto {
  @ApiProperty({ description: '검토자', example: '박검토' })
  @IsString()
  @MaxLength(50)
  reviewedBy: string;

  @ApiPropertyOptional({ description: '비고', example: '검토 시작합니다.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}

/**
 * 변경 요청 승인 DTO
 */
export class ApproveChangeDto {
  @ApiProperty({ description: '승인자', example: '이승인' })
  @IsString()
  @MaxLength(50)
  approvedBy: string;

  @ApiPropertyOptional({ description: '비고', example: '승인합니다.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}

/**
 * 변경 요청 실행 시작 DTO
 */
export class ImplementChangeDto {
  @ApiPropertyOptional({ description: '수정자', example: 'admin' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  updatedBy?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '실행을 시작합니다.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}

/**
 * 변경 요청 완료 DTO
 */
export class CompleteChangeDto {
  @ApiPropertyOptional({ description: '수정자', example: 'admin' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  updatedBy?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '변경 완료되었습니다.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}
