/**
 * @file create-certificate.dto.ts
 * @description 검사성적서 생성 DTO
 *
 * 새로운 검사성적서를 생성할 때 필요한 필드를 정의합니다.
 * certificateId, certificateNo는 필수이며, 검사 로트 번호와 품목 정보가 포함됩니다.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
 * 검사성적서 생성 DTO
 */
export class CreateCertificateDto {
  @ApiProperty({
    description: '성적서 ID',
    example: 'CERT-20260319-001',
  })
  @IsString()
  certificateId: string;

  @ApiProperty({
    description: '성적서 번호',
    example: 'IC-2026-001',
  })
  @IsString()
  certificateNo: string;

  @ApiProperty({
    description: '성적서 유형',
    enum: CertificateType,
    example: CertificateType.COA,
  })
  @IsEnum(CertificateType)
  certificateType: CertificateType;

  @ApiProperty({
    description: '검사 로트 번호',
    example: 'LOT-20260319-001',
  })
  @IsString()
  inspectionLotNo: string;

  @ApiProperty({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsString()
  itemCode: string;

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

  @ApiProperty({
    description: '검사일',
    example: '2026-03-19',
  })
  @IsDateString()
  inspectionDate: string;

  @ApiProperty({
    description: '발행일',
    example: '2026-03-19',
  })
  @IsDateString()
  issueDate: string;

  @ApiProperty({
    description: '발행자',
    example: '김검사',
  })
  @IsString()
  issuedBy: string;

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
    description: '생성자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
