/**
 * @file create-change.dto.ts
 * @description 변경 요청 생성 DTO
 *
 * 새로운 변경 요청을 등록할 때 사용하는 데이터 전송 객체입니다.
 * 필수 필드: changeId, changeNo, changeType, title, description, reason, requestedBy, requestDate
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
 * 변경 요청 생성 DTO
 */
export class CreateChangeDto {
  @ApiProperty({ description: '변경 ID', example: 'CHG-20260319-001' })
  @IsString()
  @MaxLength(50)
  changeId: string;

  @ApiProperty({ description: '변경 번호', example: 'ECN-2026-001' })
  @IsString()
  @MaxLength(50)
  changeNo: string;

  @ApiProperty({
    description: '변경 유형',
    enum: ChangeType,
    example: ChangeType.DESIGN,
  })
  @IsEnum(ChangeType)
  changeType: ChangeType;

  @ApiProperty({ description: '변경 제목', example: '케이스 재질 변경' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: '변경 상세 설명',
    example: '알루미늄에서 스테인리스로 재질 변경',
  })
  @IsString()
  @MaxLength(4000)
  description: string;

  @ApiProperty({
    description: '변경 사유',
    example: '내구성 향상 및 고객 요구사항 반영',
  })
  @IsString()
  @MaxLength(2000)
  reason: string;

  @ApiProperty({ description: '요청자', example: '김설계' })
  @IsString()
  @MaxLength(50)
  requestedBy: string;

  @ApiProperty({ description: '요청일', example: '2026-03-19' })
  @IsDateString()
  requestDate: string;

  @ApiPropertyOptional({
    description: '우선순위 (HIGH, MEDIUM, LOW)',
    example: 'HIGH',
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
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  customerApprovalRequired?: boolean;

  @ApiPropertyOptional({
    description: '영향 분석 내용',
    example: 'FMEA 업데이트 필요, 공정 파라미터 재설정 필요',
  })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  impactAnalysis?: string;

  @ApiPropertyOptional({
    description: '영향받는 문서 목록 (JSON)',
    example: '["FMEA-001", "CP-002", "DWG-003"]',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  affectedDocuments?: string;

  @ApiPropertyOptional({
    description: 'PPAP 재승인 필요 여부',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  ppapRequired?: boolean;

  @ApiPropertyOptional({ description: '비고', example: '긴급 처리 필요' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;

  @ApiPropertyOptional({ description: '생성자', example: 'admin' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  createdBy?: string;
}
