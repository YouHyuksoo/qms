/**
 * @file item.dto.ts
 * @description 품번(Item) 관련 DTO (생성, 수정, 조회)
 *
 * 품번 CRUD 요청 시 사용되는 데이터 전송 객체입니다.
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
} from 'class-validator';
import { ItemType } from '../entities/item.entity';

/**
 * 품번 생성 DTO
 */
export class CreateItemDto {
  @ApiProperty({ description: '품번 코드', example: 'ITEM-001', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  itemCode: string;

  @ApiProperty({ description: '품번명', example: 'Brake Pad Assembly', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  itemName: string;

  @ApiPropertyOptional({ description: '품번 유형', enum: ItemType })
  @IsOptional()
  @IsEnum(ItemType)
  itemType?: string;

  @ApiPropertyOptional({ description: '사양', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specification?: string;

  @ApiPropertyOptional({ description: '도면번호', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  drawingNo?: string;

  @ApiPropertyOptional({ description: '단위', example: 'EA', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unitOfMeasure?: string;

  @ApiPropertyOptional({ description: '고객 코드', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerCode?: string;

  @ApiPropertyOptional({ description: '공급업체 코드', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  supplierCode?: string;

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
 * 품번 수정 DTO
 *
 * CreateItemDto의 모든 필드를 선택적(Optional)으로 만듭니다.
 * itemCode는 PK이므로 수정 대상에서 제외합니다.
 */
export class UpdateItemDto extends PartialType(CreateItemDto) {
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
 * 품번 목록 조회 DTO
 */
export class ItemQueryDto {
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

  @ApiPropertyOptional({ description: '품번 유형 필터', enum: ItemType })
  @IsOptional()
  @IsEnum(ItemType)
  itemType?: string;
}
