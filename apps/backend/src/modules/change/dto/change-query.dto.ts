/**
 * @file change-query.dto.ts
 * @description 변경 요청 조회 DTO
 *
 * 변경 요청 목록을 조회할 때 사용하는 필터/페이지네이션 DTO입니다.
 * changeNo, changeType, status, itemCode, customerCode, 날짜범위 등으로 필터링할 수 있습니다.
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
import { ChangeType, ChangeStatus } from '../entities/change-request.entity';

/**
 * 변경 요청 조회 DTO
 */
export class ChangeQueryDto {
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
    example: 'requestDate',
    default: 'requestDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'requestDate';

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
    description: '변경 번호',
    example: 'ECN-2026-001',
  })
  @IsOptional()
  @IsString()
  changeNo?: string;

  @ApiPropertyOptional({
    description: '변경 유형',
    enum: ChangeType,
    example: ChangeType.DESIGN,
  })
  @IsOptional()
  @IsEnum(ChangeType)
  changeType?: ChangeType;

  @ApiPropertyOptional({
    description: '상태',
    enum: ChangeStatus,
    example: ChangeStatus.REQUESTED,
  })
  @IsOptional()
  @IsEnum(ChangeStatus)
  status?: ChangeStatus;

  @ApiPropertyOptional({ description: '품목 코드', example: 'ITEM-001' })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({ description: '고객 코드', example: 'CUST-001' })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '요청일 (시작)',
    example: '2026-03-01',
  })
  @IsOptional()
  @IsDateString()
  requestDateFrom?: string;

  @ApiPropertyOptional({
    description: '요청일 (종료)',
    example: '2026-03-31',
  })
  @IsOptional()
  @IsDateString()
  requestDateTo?: string;
}
