/**
 * @file scar-query.dto.ts
 * @description SCAR 조회 DTO
 *
 * SCAR 목록을 조회할 때 사용하는 필터/페이지네이션 DTO입니다.
 * scarNo, supplierCode, status로 필터링할 수 있습니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScarStatus } from '../entities/scar.entity';

/**
 * SCAR 조회 DTO
 */
export class ScarQueryDto {
  @ApiPropertyOptional({ description: '페이지 번호', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: '페이지 크기', example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({ description: '정렬 기준', example: 'issueDate', default: 'issueDate' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'issueDate';

  @ApiPropertyOptional({ description: '정렬 순서', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'SCAR 번호', example: 'SCAR-NO-2024-001' })
  @IsOptional()
  @IsString()
  scarNo?: string;

  @ApiPropertyOptional({ description: '공급업체 코드', example: 'SUP-001' })
  @IsOptional()
  @IsString()
  supplierCode?: string;

  @ApiPropertyOptional({ description: '상태', enum: ScarStatus })
  @IsOptional()
  @IsEnum(ScarStatus)
  status?: ScarStatus;
}
