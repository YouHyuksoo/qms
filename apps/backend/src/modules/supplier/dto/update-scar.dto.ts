/**
 * @file update-scar.dto.ts
 * @description SCAR 수정 DTO
 *
 * SCAR을 수정할 때 사용하는 데이터 전송 객체입니다.
 * 공급업체 응답(원인분석/시정조치/예방조치) 기록도 이 DTO로 처리합니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ScarStatus } from '../entities/scar.entity';

/**
 * SCAR 수정 DTO
 */
export class UpdateScarDto {
  @ApiPropertyOptional({ description: '공급업체 코드', example: 'SUP-001' })
  @IsOptional()
  @IsString()
  supplierCode?: string;

  @ApiPropertyOptional({ description: '공급업체명', example: '대한부품' })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiPropertyOptional({ description: '관련 NCR ID', example: 'NCR-2024-001' })
  @IsOptional()
  @IsString()
  ncrId?: string;

  @ApiPropertyOptional({ description: '품목 코드', example: 'ITEM-001' })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({ description: '기한일', example: '2024-04-19' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: '상태', enum: ScarStatus })
  @IsOptional()
  @IsEnum(ScarStatus)
  status?: ScarStatus;

  @ApiPropertyOptional({ description: '문제 설명' })
  @IsOptional()
  @IsString()
  issueDescription?: string;

  @ApiPropertyOptional({ description: '공급업체 응답 (원인분석/대책)' })
  @IsOptional()
  @IsString()
  supplierResponse?: string;

  @ApiPropertyOptional({ description: '근본 원인' })
  @IsOptional()
  @IsString()
  rootCause?: string;

  @ApiPropertyOptional({ description: '시정 조치' })
  @IsOptional()
  @IsString()
  correctiveAction?: string;

  @ApiPropertyOptional({ description: '예방 조치' })
  @IsOptional()
  @IsString()
  preventiveAction?: string;

  @ApiPropertyOptional({ description: '응답일', example: '2024-04-01' })
  @IsOptional()
  @IsDateString()
  responseDate?: string;

  @ApiPropertyOptional({ description: '검토자', example: '박검토' })
  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @ApiPropertyOptional({ description: '검토일', example: '2024-04-05' })
  @IsOptional()
  @IsDateString()
  reviewDate?: string;

  @ApiPropertyOptional({ description: '비고' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '수정자', example: 'admin' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
