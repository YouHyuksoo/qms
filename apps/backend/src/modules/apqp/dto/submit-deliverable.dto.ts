import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * 산출물 제출 DTO
 */
export class SubmitDeliverableDto {
  @ApiProperty({
    description: '제출자',
    example: '김제출',
  })
  @IsString()
  submittedBy: string;

  @ApiPropertyOptional({
    description: '제출일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  submittedDate?: string;

  @ApiPropertyOptional({
    description: '문서 경로',
    example: '/documents/apqp/design-review.pdf',
  })
  @IsOptional()
  @IsString()
  documentPath?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '설계 검토 완료',
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
 * 산출물 승인 DTO
 */
export class ApproveDeliverableDto {
  @ApiProperty({
    description: '승인자',
    example: '김승인',
  })
  @IsString()
  approvedBy: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '승인 완료',
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
 * 산출물 생성 DTO
 */
export class CreateDeliverableDto {
  @ApiProperty({
    description: '산출물 ID',
    example: 'DEL-20240319-001',
  })
  @IsString()
  deliverableId: string;

  @ApiProperty({
    description: '산출물명',
    example: '설계 검토 보고서',
  })
  @IsString()
  deliverableName: string;

  @ApiPropertyOptional({
    description: '산출물 코드',
    example: 'DR-001',
  })
  @IsOptional()
  @IsString()
  deliverableCode?: string;

  @ApiPropertyOptional({
    description: '필수 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({
    description: '비고',
    example: '필수 산출물',
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
