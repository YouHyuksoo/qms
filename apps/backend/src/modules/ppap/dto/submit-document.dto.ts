import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { PpapDocumentType, DocumentStatus } from '../entities/ppap-document.entity';

/**
 * PPAP 문서 제출 DTO
 */
export class SubmitDocumentDto {
  @ApiProperty({
    description: '문서 ID',
    example: 'DOC-20240319-001',
  })
  @IsString()
  documentId: string;

  @ApiProperty({
    description: '문서 유형',
    enum: PpapDocumentType,
    example: PpapDocumentType.DESIGN_RECORDS,
  })
  @IsEnum(PpapDocumentType)
  documentType: PpapDocumentType;

  @ApiProperty({
    description: '문서명',
    example: '설계 기록',
  })
  @IsString()
  documentName: string;

  @ApiPropertyOptional({
    description: '문서 코드',
    example: 'DR-001',
  })
  @IsOptional()
  @IsString()
  documentCode?: string;

  @ApiPropertyOptional({
    description: '필수 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({
    description: '제출일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  submittedDate?: string;

  @ApiPropertyOptional({
    description: '문서 경로',
    example: '/documents/ppap/design-records.pdf',
  })
  @IsOptional()
  @IsString()
  documentPath?: string;

  @ApiPropertyOptional({
    description: '버전',
    example: '1.0',
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '설계 기록 문서',
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
 * PPAP 문서 승인 DTO
 */
export class ApproveDocumentDto {
  @ApiProperty({
    description: '승인자',
    example: '김승인',
  })
  @IsString()
  reviewedBy: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '문서 확인 완료',
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
