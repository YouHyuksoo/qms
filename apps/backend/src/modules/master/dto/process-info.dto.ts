/**
 * @file process-info.dto.ts
 * @description 공정(ProcessInfo) 관련 DTO (생성, 수정, 조회)
 *
 * 공정 CRUD 요청 시 사용되는 데이터 전송 객체입니다.
 * class-validator로 입력값 검증, Swagger 데코레이터로 API 문서화를 합니다.
 */
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { ProcessType } from '../entities/process-info.entity';

/**
 * 공정 생성 DTO
 */
export class CreateProcessInfoDto {
  @ApiProperty({ description: '공정 코드', example: 'PROC-001', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  processCode: string;

  @ApiProperty({ description: '공정명', example: 'CNC 가공', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  processName: string;

  @ApiPropertyOptional({ description: '공정 유형', enum: ProcessType })
  @IsOptional()
  @IsEnum(ProcessType)
  processType?: string;

  @ApiPropertyOptional({ description: '라인 번호', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lineNo?: string;

  @ApiPropertyOptional({ description: '공정 순서' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sequence?: number;

  @ApiPropertyOptional({ description: '표준 싸이클타임(초)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  standardCycleTime?: number;

  @ApiPropertyOptional({ description: '특수공정 여부', default: false })
  @IsOptional()
  @IsBoolean()
  isSpecialProcess?: boolean;

  @ApiPropertyOptional({ description: '비고', maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  remarks?: string;

  @ApiPropertyOptional({ description: '생성자' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

/**
 * 공정 수정 DTO
 *
 * CreateProcessInfoDto의 모든 필드를 선택적(Optional)으로 만듭니다.
 * processCode는 PK이므로 수정 대상에서 제외합니다.
 */
export class UpdateProcessInfoDto extends PartialType(CreateProcessInfoDto) {
  @ApiPropertyOptional({ description: '활성 여부' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: '수정자' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}

/**
 * 공정 목록 조회 DTO
 */
export class ProcessInfoQueryDto {
  @ApiPropertyOptional({ description: '페이지 번호', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: '페이지 크기', default: 20 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: '검색어 (코드/이름)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: '활성 여부 필터' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: '공정 유형 필터', enum: ProcessType })
  @IsOptional()
  @IsEnum(ProcessType)
  processType?: string;
}
