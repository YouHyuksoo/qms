import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

/**
 * 필드 불량 생성 DTO
 */
export class CreateFieldFailureDto {
  @ApiProperty({
    description: '불량 ID',
    example: 'FAIL-20240319-001',
  })
  @IsString()
  failureId: string;

  @ApiProperty({
    description: '불량 번호',
    example: 'FLD-2024-001',
  })
  @IsString()
  failureNo: string;

  @ApiPropertyOptional({
    description: '연결된 클레임 ID',
    example: 'COMP-20240319-001',
  })
  @IsOptional()
  @IsString()
  complaintId?: string;

  @ApiPropertyOptional({
    description: '연결된 보증 ID',
    example: 'WAR-20240319-001',
  })
  @IsOptional()
  @IsString()
  warrantyId?: string;

  @ApiProperty({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsString()
  itemCode: string;

  @ApiPropertyOptional({
    description: '품목명',
    example: '알루미늄 케이스',
  })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiPropertyOptional({
    description: '로트 번호',
    example: 'LOT-20240315-001',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;

  @ApiPropertyOptional({
    description: '시리얼 번호',
    example: 'SN123456789',
  })
  @IsOptional()
  @IsString()
  serialNo?: string;

  @ApiProperty({
    description: '불량 발생일',
    example: '2024-03-15',
  })
  @IsDateString()
  failureDate: string;

  @ApiPropertyOptional({
    description: '불량 발견일',
    example: '2024-03-16',
  })
  @IsOptional()
  @IsDateString()
  discoveryDate?: string;

  @ApiProperty({
    description: '불량 모드',
    example: '균열',
  })
  @IsString()
  failureMode: string;

  @ApiPropertyOptional({
    description: '불량 원인',
    example: '열처리 불량',
  })
  @IsOptional()
  @IsString()
  failureCause?: string;

  @ApiPropertyOptional({
    description: '불량 상세',
    example: '제품 표면에 미세 균열이 발생함',
  })
  @IsOptional()
  @IsString()
  failureDetail?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '긴급 추적 필요',
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
