import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { TestCategory } from '../entities/dvp-plan.entity';

/**
 * DVP 계획 생성 DTO
 */
export class CreateDvpPlanDto {
  @ApiProperty({
    description: '계획 ID',
    example: 'DVP-20240319-001',
  })
  @IsString()
  planId: string;

  @ApiProperty({
    description: '프로젝트 번호',
    example: 'APQP-20240319-001',
  })
  @IsString()
  projectNo: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '품목명',
    example: '브레이크 패드',
  })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiProperty({
    description: '시험 카테고리',
    enum: TestCategory,
    example: TestCategory.FUNCTIONAL,
  })
  @IsEnum(TestCategory)
  testCategory: TestCategory;

  @ApiProperty({
    description: '시험 항목',
    example: '브레이크 성능 시험',
  })
  @IsString()
  testItem: string;

  @ApiPropertyOptional({
    description: '시험 방법',
    example: 'SAE J2784 기준 브레이크 성능 측정',
  })
  @IsOptional()
  @IsString()
  testMethod?: string;

  @ApiPropertyOptional({
    description: '수용 기준',
    example: '제동력 3000N 이상, 페이드 10% 이내',
  })
  @IsOptional()
  @IsString()
  acceptanceCriteria?: string;

  @ApiPropertyOptional({
    description: '시험 기관',
    example: '한국기계연구원',
  })
  @IsOptional()
  @IsString()
  testFacility?: string;

  @ApiPropertyOptional({
    description: '시험 장비',
    example: 'Dynamometer KST-500',
  })
  @IsOptional()
  @IsString()
  testEquipment?: string;

  @ApiPropertyOptional({
    description: '계획 시작일',
    example: '2024-04-01',
  })
  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @ApiPropertyOptional({
    description: '계획 종료일',
    example: '2024-04-15',
  })
  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @ApiPropertyOptional({
    description: '샘플 수량',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  sampleQty?: number;

  @ApiPropertyOptional({
    description: '담당자',
    example: '김시험',
  })
  @IsOptional()
  @IsString()
  responsiblePerson?: string;

  @ApiPropertyOptional({
    description: '참고 규격',
    example: 'SAE J2784',
  })
  @IsOptional()
  @IsString()
  referenceSpec?: string;

  @ApiPropertyOptional({
    description: '우선순위',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({
    description: '비고',
    example: '중요 안전 항목',
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    description: '생성자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}

/**
 * DVP 계획 수정 DTO
 */
export class UpdateDvpPlanDto {
  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '품목명',
    example: '브레이크 패드',
  })
  @IsOptional()
  @IsString()
  itemName?: string;

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
    example: '브레이크 성능 시험',
  })
  @IsOptional()
  @IsString()
  testItem?: string;

  @ApiPropertyOptional({
    description: '시험 방법',
    example: 'SAE J2784 기준 브레이크 성능 측정',
  })
  @IsOptional()
  @IsString()
  testMethod?: string;

  @ApiPropertyOptional({
    description: '수용 기준',
    example: '제동력 3000N 이상, 페이드 10% 이내',
  })
  @IsOptional()
  @IsString()
  acceptanceCriteria?: string;

  @ApiPropertyOptional({
    description: '시험 기관',
    example: '한국기계연구원',
  })
  @IsOptional()
  @IsString()
  testFacility?: string;

  @ApiPropertyOptional({
    description: '계획 시작일',
    example: '2024-04-01',
  })
  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @ApiPropertyOptional({
    description: '계획 종료일',
    example: '2024-04-15',
  })
  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @ApiPropertyOptional({
    description: '샘플 수량',
    example: 5,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  sampleQty?: number;

  @ApiPropertyOptional({
    description: '담당자',
    example: '김시험',
  })
  @IsOptional()
  @IsString()
  responsiblePerson?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '중요 안전 항목',
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
