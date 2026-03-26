/**
 * @file create-scar.dto.ts
 * @description SCAR(공급업체 시정 조치 요구서) 생성 DTO
 *
 * 새로운 SCAR을 발행할 때 사용하는 데이터 전송 객체입니다.
 * 공급업체/문제 설명/기한 등 필수 정보를 포함합니다.
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * SCAR 생성 DTO
 */
export class CreateScarDto {
  @ApiProperty({ description: 'SCAR ID', example: 'SCAR-2024-001' })
  @IsString()
  scarId: string;

  @ApiProperty({ description: 'SCAR 번호', example: 'SCAR-NO-2024-001' })
  @IsString()
  scarNo: string;

  @ApiProperty({ description: '공급업체 코드', example: 'SUP-001' })
  @IsString()
  supplierCode: string;

  @ApiPropertyOptional({ description: '공급업체명', example: '대한부품' })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiPropertyOptional({ description: '관련 NCR ID', example: 'NCR-2024-001' })
  @IsOptional()
  @IsString()
  ncrId?: string;

  @ApiPropertyOptional({ description: '품목 코드', example: 'ITEM-001' })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiProperty({ description: '발행일', example: '2024-03-19' })
  @IsDateString()
  issueDate: string;

  @ApiProperty({ description: '기한일', example: '2024-04-19' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ description: '문제 설명', example: '납품 부품 치수 불량 다수 발생' })
  @IsString()
  issueDescription: string;

  @ApiPropertyOptional({ description: '비고', example: '긴급 대응 필요' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '생성자', example: 'admin' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
