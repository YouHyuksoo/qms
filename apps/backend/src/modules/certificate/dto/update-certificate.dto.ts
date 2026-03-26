/**
 * @file update-certificate.dto.ts
 * @description 검사성적서 수정 DTO
 *
 * 기존 검사성적서의 정보를 수정할 때 사용합니다.
 * 모든 필드가 선택사항(Optional)이며, 전달된 필드만 업데이트됩니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { CertificateType } from '../entities/inspection-certificate.entity';

/**
 * 검사성적서 수정 DTO
 */
export class UpdateCertificateDto {
  @ApiPropertyOptional({
    description: '성적서 유형',
    enum: CertificateType,
    example: CertificateType.COA,
  })
  @IsOptional()
  @IsEnum(CertificateType)
  certificateType?: CertificateType;

  @ApiPropertyOptional({
    description: '검사 로트 번호',
    example: 'LOT-20260319-001',
  })
  @IsOptional()
  @IsString()
  inspectionLotNo?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '품목명',
    example: '알루미늄 케이스',
  })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '고객명',
    example: 'ABC Electronics',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiPropertyOptional({
    description: '로트 번호',
    example: 'LOT-A001',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;

  @ApiPropertyOptional({
    description: '로트 수량',
    example: 1000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lotQty?: number;

  @ApiPropertyOptional({
    description: '검사일',
    example: '2026-03-19',
  })
  @IsOptional()
  @IsDateString()
  inspectionDate?: string;

  @ApiPropertyOptional({
    description: '발행일',
    example: '2026-03-19',
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @ApiPropertyOptional({
    description: '발행자',
    example: '김검사',
  })
  @IsOptional()
  @IsString()
  issuedBy?: string;

  @ApiPropertyOptional({
    description: '템플릿 ID',
    example: 'TMPL-001',
  })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({
    description: '검사 요약 (JSON 또는 텍스트)',
    example: '{"result": "합격", "defectRate": 0.01}',
  })
  @IsOptional()
  @IsString()
  inspectionSummary?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '특이사항 없음',
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
