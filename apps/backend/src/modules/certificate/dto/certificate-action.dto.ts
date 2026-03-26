/**
 * @file certificate-action.dto.ts
 * @description 검사성적서 발행/재발행 및 템플릿 관련 DTO
 *
 * 성적서 발행(Issue), 재발행(Reissue), 템플릿 생성/수정에 필요한
 * 데이터 전송 객체를 정의합니다.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { CertificateType } from '../entities/inspection-certificate.entity';

/**
 * 성적서 발행 DTO
 */
export class IssueCertificateDto {
  @ApiPropertyOptional({
    description: '발행자',
    example: '김검사',
  })
  @IsOptional()
  @IsString()
  issuedBy?: string;
}

/**
 * 성적서 재발행 DTO
 */
export class ReissueCertificateDto {
  @ApiProperty({
    description: '재발행 사유',
    example: '검사 데이터 오류 정정',
  })
  @IsString()
  reissueReason: string;

  @ApiPropertyOptional({
    description: '발행자',
    example: '김검사',
  })
  @IsOptional()
  @IsString()
  issuedBy?: string;
}

/**
 * 템플릿 생성 DTO
 */
export class CreateTemplateDto {
  @ApiProperty({
    description: '템플릿 ID',
    example: 'TMPL-001',
  })
  @IsString()
  templateId: string;

  @ApiProperty({
    description: '템플릿 이름',
    example: 'COA 기본 양식',
  })
  @IsString()
  templateName: string;

  @ApiProperty({
    description: '템플릿 유형',
    enum: CertificateType,
    example: CertificateType.COA,
  })
  @IsEnum(CertificateType)
  templateType: CertificateType;

  @ApiPropertyOptional({
    description: '고객사 코드 (고객사별 양식)',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '설명',
    example: 'COA 표준 양식입니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '헤더 필드 (JSON)',
    example: '{"companyName": true, "logo": true}',
  })
  @IsOptional()
  @IsString()
  headerFields?: string;

  @ApiPropertyOptional({
    description: '본문 필드 (JSON)',
    example: '{"inspectionItems": true, "results": true}',
  })
  @IsOptional()
  @IsString()
  bodyFields?: string;

  @ApiPropertyOptional({
    description: '푸터 필드 (JSON)',
    example: '{"signature": true, "stamp": true}',
  })
  @IsOptional()
  @IsString()
  footerFields?: string;

  @ApiPropertyOptional({
    description: '기본 템플릿 여부',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: '생성자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

/**
 * 템플릿 수정 DTO
 */
export class UpdateTemplateDto {
  @ApiPropertyOptional({
    description: '템플릿 이름',
    example: 'COA 기본 양식 (수정)',
  })
  @IsOptional()
  @IsString()
  templateName?: string;

  @ApiPropertyOptional({
    description: '템플릿 유형',
    enum: CertificateType,
    example: CertificateType.COA,
  })
  @IsOptional()
  @IsEnum(CertificateType)
  templateType?: CertificateType;

  @ApiPropertyOptional({
    description: '고객사 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '설명',
    example: 'COA 표준 양식입니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '헤더 필드 (JSON)',
    example: '{"companyName": true, "logo": true}',
  })
  @IsOptional()
  @IsString()
  headerFields?: string;

  @ApiPropertyOptional({
    description: '본문 필드 (JSON)',
    example: '{"inspectionItems": true, "results": true}',
  })
  @IsOptional()
  @IsString()
  bodyFields?: string;

  @ApiPropertyOptional({
    description: '푸터 필드 (JSON)',
    example: '{"signature": true, "stamp": true}',
  })
  @IsOptional()
  @IsString()
  footerFields?: string;

  @ApiPropertyOptional({
    description: '기본 템플릿 여부',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: '활성 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: '수정자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}

/**
 * 발행 이력 조회 DTO
 */
export class CertificateHistoryQueryDto {
  @ApiPropertyOptional({
    description: '성적서 번호',
    example: 'IC-2026-001',
  })
  @IsOptional()
  @IsString()
  certificateNo?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;
}
