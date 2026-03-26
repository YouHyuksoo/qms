/**
 * @file customer.dto.ts
 * @description 고객사 관련 DTO (생성, 수정, 조회)
 *
 * 고객사 CRUD 요청 시 사용되는 데이터 전송 객체입니다.
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
  Max,
} from 'class-validator';
import { CustomerType } from '../entities/customer.entity';

/**
 * 고객사 생성 DTO
 */
export class CreateCustomerDto {
  @ApiProperty({ description: '고객 코드', example: 'CUST-001', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  customerCode: string;

  @ApiProperty({ description: '고객명', example: 'ABC Electronics', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  customerName: string;

  @ApiPropertyOptional({ description: '고객 유형', enum: CustomerType })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: string;

  @ApiPropertyOptional({ description: '국가', example: 'KR', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ description: '주소', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ description: '담당자명', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contactPerson?: string;

  @ApiPropertyOptional({ description: '담당자 이메일', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactEmail?: string;

  @ApiPropertyOptional({ description: '담당자 전화번호', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'PPAP 기본 제출 수준 (1~5)', default: 3 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  ppapLevel?: number;

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
 * 고객사 수정 DTO
 *
 * CreateCustomerDto의 모든 필드를 선택적(Optional)으로 만듭니다.
 * customerCode는 PK이므로 수정 대상에서 제외합니다.
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
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
 * 고객사 목록 조회 DTO
 */
export class CustomerQueryDto {
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

  @ApiPropertyOptional({ description: '고객 유형 필터', enum: CustomerType })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: string;
}
