import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApqpProjectStatus } from '../entities/apqp-project.entity';

/**
 * APQP 프로젝트 생성 DTO
 */
export class CreateApqpProjectDto {
  @ApiProperty({
    description: '프로젝트 번호',
    example: 'APQP-20240319-001',
  })
  @IsString()
  projectNo: string;

  @ApiProperty({
    description: '프로젝트명',
    example: '신규 자동차 부품 개발 프로젝트',
  })
  @IsString()
  projectName: string;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '고객명',
    example: '현대자동차',
  })
  @IsOptional()
  @IsString()
  customerName?: string;

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
    description: '계획 시작일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @ApiPropertyOptional({
    description: '계획 종료일',
    example: '2024-09-19',
  })
  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @ApiPropertyOptional({
    description: '프로젝트 책임자',
    example: '김프로',
  })
  @IsOptional()
  @IsString()
  projectManager?: string;

  @ApiPropertyOptional({
    description: '프로젝트 상태',
    enum: ApqpProjectStatus,
    example: ApqpProjectStatus.PLANNING,
  })
  @IsOptional()
  @IsEnum(ApqpProjectStatus)
  status?: ApqpProjectStatus;

  @ApiPropertyOptional({
    description: '목표 품질 수준 (%)',
    example: 99.5,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  targetQualityLevel?: number;

  @ApiPropertyOptional({
    description: '비고',
    example: '신규 차종 적용 프로젝트',
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
