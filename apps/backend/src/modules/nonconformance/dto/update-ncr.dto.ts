import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { NcrStatus, DefectType } from '../entities/ncr.entity';

/**
 * NCR 수정 DTO
 */
export class UpdateNcrDto {
  @ApiPropertyOptional({
    description: '제목',
    example: '외관 결함 발견 (수정)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: '상세 설명',
    example: '표면에 스크래치가 발견되었습니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '불량 수량',
    example: 15,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defectQty?: number;

  @ApiPropertyOptional({
    description: '불량 유형',
    enum: DefectType,
    example: DefectType.MAJOR,
  })
  @IsOptional()
  @IsEnum(DefectType)
  defectType?: DefectType;

  @ApiPropertyOptional({
    description: '상태',
    enum: NcrStatus,
    example: NcrStatus.UNDER_REVIEW,
  })
  @IsOptional()
  @IsEnum(NcrStatus)
  status?: NcrStatus;

  @ApiPropertyOptional({
    description: '담당자',
    example: '이개선',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: '완료 예정일',
    example: '2024-03-26',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: '근본 원인',
    example: '공구 마모로 인한 표면 불량',
  })
  @IsOptional()
  @IsString()
  rootCause?: string;

  @ApiPropertyOptional({
    description: '시정 조치',
    example: '공구 교체 및 작업 재개',
  })
  @IsOptional()
  @IsString()
  correctiveAction?: string;

  @ApiPropertyOptional({
    description: '예방 조치',
    example: '공구 수명 관리 체계 도입',
  })
  @IsOptional()
  @IsString()
  preventiveAction?: string;

  @ApiPropertyOptional({
    description: '종결일',
    example: '2024-03-25',
  })
  @IsOptional()
  @IsDateString()
  closedDate?: string;

  @ApiPropertyOptional({
    description: '종결자',
    example: '박관리',
  })
  @IsOptional()
  @IsString()
  closedBy?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '긴급 처리 필요',
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
