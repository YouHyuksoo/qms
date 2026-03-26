/**
 * @file update-capa.dto.ts
 * @description CAPA 수정 DTO
 *
 * 기존 CAPA 정보를 수정할 때 사용하는 데이터 전송 객체입니다.
 * 모든 필드가 선택적이며, 전달된 필드만 업데이트됩니다.
 *
 * 초보자 가이드:
 * - 상태 변경, 근본 원인 입력, 조치 내용 업데이트 등에 활용합니다.
 * - effectivenessConfirmed를 true로 설정하면 효과성이 확인된 것입니다.
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
import { CapaType, CapaPriority, CapaStatus } from '../entities/capa.entity';

/**
 * CAPA 수정 DTO
 */
export class UpdateCapaDto {
  @ApiPropertyOptional({ description: 'CAPA 유형', enum: CapaType })
  @IsOptional()
  @IsEnum(CapaType)
  capaType?: CapaType;

  @ApiPropertyOptional({
    description: '원인 유형',
    example: 'NCR',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sourceType?: string;

  @ApiPropertyOptional({ description: '원인 문서 ID' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sourceId?: string;

  @ApiPropertyOptional({ description: '제목' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ description: '상세 설명' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiPropertyOptional({ description: '우선순위', enum: CapaPriority })
  @IsOptional()
  @IsEnum(CapaPriority)
  priority?: CapaPriority;

  @ApiPropertyOptional({ description: '상태', enum: CapaStatus })
  @IsOptional()
  @IsEnum(CapaStatus)
  status?: CapaStatus;

  @ApiPropertyOptional({ description: '담당자' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  assignedTo?: string;

  @ApiPropertyOptional({ description: '목표 완료일' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: '근본 원인' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  rootCause?: string;

  @ApiPropertyOptional({ description: '근본 원인 분석 방법' })
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

  @ApiPropertyOptional({ description: '조치 완료일' })
  @IsOptional()
  @IsDateString()
  actionCompletedDate?: string;

  @ApiPropertyOptional({ description: '검증 기한' })
  @IsOptional()
  @IsDateString()
  verificationDueDate?: string;

  @ApiPropertyOptional({ description: '검증 결과' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  verificationResult?: string;

  @ApiPropertyOptional({ description: '검증일' })
  @IsOptional()
  @IsDateString()
  verificationDate?: string;

  @ApiPropertyOptional({ description: '검증자' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  verifiedBy?: string;

  @ApiPropertyOptional({ description: '효과성 확인 여부' })
  @IsOptional()
  @IsBoolean()
  effectivenessConfirmed?: boolean;

  @ApiPropertyOptional({ description: '관련 문서' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  relatedDocuments?: string;

  @ApiPropertyOptional({ description: '비고' })
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
