import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApqpProjectStatus } from '../entities/apqp-project.entity';
import { ApqpPhaseType, ApqpPhaseStatus } from '../entities/apqp-phase.entity';

/**
 * APQP 프로젝트 조회 DTO
 */
export class ApqpQueryDto {
  @ApiPropertyOptional({
    description: '프로젝트 번호',
    example: 'APQP-20240319-001',
  })
  @IsOptional()
  @IsString()
  projectNo?: string;

  @ApiPropertyOptional({
    description: '프로젝트명',
    example: '신규 자동차 부품',
  })
  @IsOptional()
  @IsString()
  projectName?: string;

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
    description: '프로젝트 상태',
    enum: ApqpProjectStatus,
    example: ApqpProjectStatus.PLANNING,
  })
  @IsOptional()
  @IsEnum(ApqpProjectStatus)
  status?: ApqpProjectStatus;

  @ApiPropertyOptional({
    description: '프로젝트 책임자',
    example: '김프로',
  })
  @IsOptional()
  @IsString()
  projectManager?: string;

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
    description: '정렬 기준',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}

/**
 * APQP 단계 조회 DTO
 */
export class PhaseQueryDto {
  @ApiPropertyOptional({
    description: '단계 유형',
    enum: ApqpPhaseType,
    example: ApqpPhaseType.PLANNING,
  })
  @IsOptional()
  @IsEnum(ApqpPhaseType)
  phaseType?: ApqpPhaseType;

  @ApiPropertyOptional({
    description: '단계 상태',
    enum: ApqpPhaseStatus,
    example: ApqpPhaseStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(ApqpPhaseStatus)
  status?: ApqpPhaseStatus;

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
}
