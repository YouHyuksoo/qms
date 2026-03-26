/**
 * @file common-code.dto.ts
 * @description 공통코드(CommonCode) 관련 DTO (생성, 수정)
 *
 * 공통코드 CRUD 요청 시 사용되는 데이터 전송 객체입니다.
 * class-validator로 입력값 검증, Swagger 데코레이터로 API 문서화를 합니다.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * 공통코드 생성 DTO
 */
export class CreateCommonCodeDto {
  @ApiProperty({ description: '코드 그룹', example: 'DEFECT_TYPE', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  codeGroup: string;

  @ApiProperty({ description: '코드 값', example: 'SCRATCH', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  codeValue: string;

  @ApiProperty({ description: '코드명', example: '스크래치', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  codeName: string;

  @ApiPropertyOptional({ description: '영문명', example: 'Scratch', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  codeNameEn?: string;

  @ApiPropertyOptional({ description: '정렬 순서', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: '비고', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

/**
 * 공통코드 수정 DTO
 *
 * 복합키(codeGroup + codeValue)는 URL 파라미터로 전달되므로 DTO에서 제외합니다.
 */
export class UpdateCommonCodeDto {
  @ApiPropertyOptional({ description: '코드명', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  codeName?: string;

  @ApiPropertyOptional({ description: '영문명', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  codeNameEn?: string;

  @ApiPropertyOptional({ description: '정렬 순서' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: '활성 여부' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: '비고', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
