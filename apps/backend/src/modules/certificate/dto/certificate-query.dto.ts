/**
 * @file certificate-query.dto.ts
 * @description 검사성적서 조회 쿼리 DTO
 *
 * 검사성적서 목록 조회 시 사용하는 필터/페이지네이션/정렬 파라미터를 정의합니다.
 * 성적서 번호, 유형, 고객코드, 품목코드, 상태, 날짜범위 등으로 필터링할 수 있습니다.
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
import { Type } from 'class-transformer';
import {
  CertificateType,
  CertificateStatus,
} from '../entities/inspection-certificate.entity';

/**
 * 검사성적서 조회 DTO
 */
export class CertificateQueryDto {
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
    description: '정렬 기준 필드',
    example: 'issueDate',
    default: 'issueDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'issueDate';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: '성적서 번호',
    example: 'IC-2026-001',
  })
  @IsOptional()
  @IsString()
  certificateNo?: string;

  @ApiPropertyOptional({
    description: '성적서 유형',
    enum: CertificateType,
    example: CertificateType.COA,
  })
  @IsOptional()
  @IsEnum(CertificateType)
  certificateType?: CertificateType;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '상태',
    enum: CertificateStatus,
    example: CertificateStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(CertificateStatus)
  status?: CertificateStatus;

  @ApiPropertyOptional({
    description: '발행일 (시작)',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsDateString()
  issueDateFrom?: string;

  @ApiPropertyOptional({
    description: '발행일 (종료)',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsDateString()
  issueDateTo?: string;
}
