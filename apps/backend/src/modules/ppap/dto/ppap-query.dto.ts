import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PpapStatus, PpapSubmissionLevel } from '../entities/ppap-submission.entity';

/**
 * PPAP 조회 DTO
 */
export class PpapQueryDto {
  @ApiPropertyOptional({
    description: '제출 ID',
    example: 'PPAP-20240319-001',
  })
  @IsOptional()
  @IsString()
  submissionId?: string;

  @ApiPropertyOptional({
    description: '프로젝트 번호',
    example: 'APQP-20240319-001',
  })
  @IsOptional()
  @IsString()
  projectNo?: string;

  @ApiPropertyOptional({
    description: '제출 번호',
    example: 'SUB-001',
  })
  @IsOptional()
  @IsString()
  submissionNo?: string;

  @ApiPropertyOptional({
    description: '제출 레벨',
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
    description: '상태',
    enum: PpapStatus,
    example: PpapStatus.SUBMITTED,
  })
  @IsOptional()
  @IsEnum(PpapStatus)
  status?: PpapStatus;

  @ApiPropertyOptional({
    description: 'PSW 번호',
    example: 'PSW-20240319-001',
  })
  @IsOptional()
  @IsString()
  pswNo?: string;

  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지 크기',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '정렬 기준',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
