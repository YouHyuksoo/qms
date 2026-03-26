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
import { TraceabilityStatus } from '../entities/field-failure.entity';

/**
 * 필드 불량 조회 DTO
 */
export class FieldFailureQueryDto {
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
    example: 'failureDate',
    default: 'failureDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'failureDate';

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
    description: '불량 ID',
    example: 'FAIL-20240319-001',
  })
  @IsOptional()
  @IsString()
  failureId?: string;

  @ApiPropertyOptional({
    description: '불량 번호',
    example: 'FLD-2024-001',
  })
  @IsOptional()
  @IsString()
  failureNo?: string;

  @ApiPropertyOptional({
    description: '클레임 ID',
    example: 'COMP-20240319-001',
  })
  @IsOptional()
  @IsString()
  complaintId?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '로트 번호',
    example: 'LOT-20240315-001',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;

  @ApiPropertyOptional({
    description: '불량 모드',
    example: '균열',
  })
  @IsOptional()
  @IsString()
  failureMode?: string;

  @ApiPropertyOptional({
    description: '추적 상태',
    enum: TraceabilityStatus,
    example: TraceabilityStatus.TRACED,
  })
  @IsOptional()
  @IsEnum(TraceabilityStatus)
  traceabilityStatus?: TraceabilityStatus;

  @ApiPropertyOptional({
    description: '생산 라인',
    example: 'LINE-A',
  })
  @IsOptional()
  @IsString()
  productionLine?: string;

  @ApiPropertyOptional({
    description: '장비 ID',
    example: 'EQP-001',
  })
  @IsOptional()
  @IsString()
  equipmentId?: string;

  @ApiPropertyOptional({
    description: '작업자 ID',
    example: 'OP-001',
  })
  @IsOptional()
  @IsString()
  operatorId?: string;

  @ApiPropertyOptional({
    description: '불량 발생일 (시작)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  failureDateFrom?: string;

  @ApiPropertyOptional({
    description: '불량 발생일 (종료)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  failureDateTo?: string;
}

/**
 * 대책 업데이트 DTO
 */
export class UpdateCountermeasureDto {
  @ApiPropertyOptional({
    description: '즉시 대책',
    example: '불량품 회수 및 교체',
  })
  @IsOptional()
  @IsString()
  immediateAction?: string;

  @ApiPropertyOptional({
    description: '재발방지 대책',
    example: '열처리 공정 온도 관리 강화',
  })
  @IsOptional()
  @IsString()
  correctiveAction?: string;

  @ApiPropertyOptional({
    description: '예방 대책',
    example: '정기적 장비 점검',
  })
  @IsOptional()
  @IsString()
  preventiveAction?: string;

  @ApiPropertyOptional({
    description: '대책 완료 목표일',
    example: '2024-06-30',
  })
  @IsOptional()
  @IsDateString()
  actionDeadline?: string;

  @ApiPropertyOptional({
    description: '수정자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
