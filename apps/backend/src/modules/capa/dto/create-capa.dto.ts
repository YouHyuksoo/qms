/**
 * @file create-capa.dto.ts
 * @description CAPA 생성 DTO
 *
 * 새로운 CAPA를 등록할 때 사용하는 데이터 전송 객체입니다.
 *
 * 초보자 가이드:
 * - capaId, capaNo는 필수이며 중복 불가합니다.
 * - sourceType으로 NCR, COMPLAINT, AUDIT, OTHER 중 원인 유형을 지정합니다.
 * - sourceId로 원인 문서를 연결할 수 있습니다 (선택).
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
import { CapaType, CapaPriority } from '../entities/capa.entity';

/**
 * CAPA 생성 DTO
 */
export class CreateCapaDto {
  @ApiProperty({ description: 'CAPA ID', example: 'CAPA-20260319-001' })
  @IsString()
  @MaxLength(50)
  capaId: string;

  @ApiProperty({ description: 'CAPA 번호', example: 'CAPA-2026-001' })
  @IsString()
  @MaxLength(50)
  capaNo: string;

  @ApiProperty({
    description: 'CAPA 유형',
    enum: CapaType,
    example: CapaType.CORRECTIVE,
  })
  @IsEnum(CapaType)
  capaType: CapaType;

  @ApiProperty({
    description: '원인 유형 (NCR, COMPLAINT, AUDIT, OTHER)',
    example: 'NCR',
  })
  @IsString()
  @MaxLength(50)
  sourceType: string;

  @ApiPropertyOptional({ description: '원인 문서 ID', example: 'NCR-2026-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sourceId?: string;

  @ApiProperty({ description: '제목', example: '용접 불량 시정 조치' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: '상세 설명',
    example: '용접부 크랙 발생에 대한 시정 조치',
  })
  @IsString()
  @MaxLength(4000)
  description: string;

  @ApiProperty({
    description: '우선순위',
    enum: CapaPriority,
    example: CapaPriority.HIGH,
  })
  @IsEnum(CapaPriority)
  priority: CapaPriority;

  @ApiProperty({ description: '요청자', example: '김품질' })
  @IsString()
  @MaxLength(50)
  requestedBy: string;

  @ApiPropertyOptional({ description: '담당자', example: '이조치' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  assignedTo?: string;

  @ApiProperty({ description: '목표 완료일', example: '2026-04-30' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ description: '근본 원인' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  rootCause?: string;

  @ApiPropertyOptional({
    description: '근본 원인 분석 방법',
    example: '5WHY',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  rootCauseMethod?: string;

  @ApiPropertyOptional({ description: '시정 조치 내용' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  correctiveAction?: string;

  @ApiPropertyOptional({ description: '예방 조치 내용' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  preventiveAction?: string;

  @ApiPropertyOptional({ description: '관련 문서', example: 'FMEA-001, CP-002' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  relatedDocuments?: string;

  @ApiPropertyOptional({ description: '비고' })
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
