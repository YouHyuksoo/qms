/**
 * @file update-change.dto.ts
 * @description 변경 요청 수정 DTO
 *
 * 기존 변경 요청의 정보를 수정할 때 사용하는 데이터 전송 객체입니다.
 * 모든 필드가 선택적(optional)이며, 전달된 필드만 업데이트됩니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ChangeType } from '../entities/change-request.entity';

/**
 * 변경 요청 수정 DTO
 */
export class UpdateChangeDto {
  @ApiPropertyOptional({
    description: '변경 유형',
    enum: ChangeType,
    example: ChangeType.DESIGN,
  })
  @IsOptional()
  @IsEnum(ChangeType)
  changeType?: ChangeType;

  @ApiPropertyOptional({ description: '변경 제목', example: '케이스 재질 변경' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: '변경 상세 설명',
    example: '알루미늄에서 스테인리스로 재질 변경',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiPropertyOptional({
    description: '변경 사유',
    example: '내구성 향상 및 고객 요구사항 반영',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;

  @ApiPropertyOptional({
    description: '우선순위 (HIGH, MEDIUM, LOW)',
    example: 'MEDIUM',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  priority?: string;

  @ApiPropertyOptional({ description: '품목 코드', example: 'ITEM-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  itemCode?: string;

  @ApiPropertyOptional({ description: '품목명', example: '알루미늄 케이스' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  itemName?: string;

  @ApiPropertyOptional({ description: '공정 코드', example: 'PROC-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  processCode?: string;

  @ApiPropertyOptional({ description: '고객 코드', example: 'CUST-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerCode?: string;

  @ApiPropertyOptional({
    description: '고객 승인 필요 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  customerApprovalRequired?: boolean;

  @ApiPropertyOptional({
    description: '고객 승인 상태 (PENDING, APPROVED, REJECTED)',
    example: 'APPROVED',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  customerApprovalStatus?: string;

  @ApiPropertyOptional({
    description: '고객 승인일',
    example: '2026-03-25',
  })
  @IsOptional()
  @IsDateString()
  customerApprovalDate?: string;

  @ApiPropertyOptional({
    description: '영향 분석 내용',
    example: 'FMEA 업데이트 필요',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  impactAnalysis?: string;

  @ApiPropertyOptional({
    description: '영향받는 문서 목록 (JSON)',
    example: '["FMEA-001", "CP-002"]',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  affectedDocuments?: string;

  @ApiPropertyOptional({
    description: 'PPAP 재승인 필요 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  ppapRequired?: boolean;

  @ApiPropertyOptional({ description: '비고', example: '긴급 처리 필요' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;

  @ApiPropertyOptional({ description: '수정자', example: 'admin' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  updatedBy?: string;
}
