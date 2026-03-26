import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * 단계 승인 DTO
 */
export class ApprovePhaseDto {
  @ApiProperty({
    description: '승인자',
    example: '김승인',
  })
  @IsString()
  approvedBy: string;

  @ApiPropertyOptional({
    description: '승인일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  approvedDate?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '모든 산출물 확인 완료',
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
 * 단계 반려 DTO
 */
export class RejectPhaseDto {
  @ApiProperty({
    description: '반려 사유',
    example: '산출물 누락으로 인한 반려',
  })
  @IsString()
  reason: string;

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
