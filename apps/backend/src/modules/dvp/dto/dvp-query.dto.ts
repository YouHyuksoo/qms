import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TestCategory } from '../entities/dvp-plan.entity';
import { TestResult } from '../entities/dvp-result.entity';

/**
 * DVP 조회 DTO
 */
export class DvpQueryDto {
  @ApiPropertyOptional({
    description: '계획 ID',
    example: 'DVP-20240319-001',
  })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiPropertyOptional({
    description: '프로젝트 번호',
    example: 'APQP-20240319-001',
  })
  @IsOptional()
  @IsString()
  projectNo?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '시험 카테고리',
    enum: TestCategory,
    example: TestCategory.FUNCTIONAL,
  })
  @IsOptional()
  @IsEnum(TestCategory)
  testCategory?: TestCategory;

  @ApiPropertyOptional({
    description: '시험 항목',
    example: '브레이크',
  })
  @IsOptional()
  @IsString()
  testItem?: string;

  @ApiPropertyOptional({
    description: '시험 결과',
    enum: TestResult,
    example: TestResult.PASS,
  })
  @IsOptional()
  @IsEnum(TestResult)
  testResult?: TestResult;

  @ApiPropertyOptional({
    description: '담당자',
    example: '김시험',
  })
  @IsOptional()
  @IsString()
  responsiblePerson?: string;

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
