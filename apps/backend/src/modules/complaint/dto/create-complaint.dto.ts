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
import { ComplaintType, ComplaintSeverity } from '../entities/customer-complaint.entity';

/**
 * 클레임 생성 DTO
 */
export class CreateComplaintDto {
  @ApiProperty({
    description: '클레임 ID',
    example: 'COMP-20240319-001',
  })
  @IsString()
  complaintId: string;

  @ApiProperty({
    description: '클레임 번호',
    example: 'CLM-2024-001',
  })
  @IsString()
  complaintNo: string;

  @ApiProperty({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsString()
  customerCode: string;

  @ApiPropertyOptional({
    description: '고객명',
    example: 'ABC Electronics',
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
    example: '알루미늄 케이스',
  })
  @IsOptional()
  @IsString()
  itemName?: string;

  @ApiPropertyOptional({
    description: '발생일',
    example: '2024-03-15',
  })
  @IsOptional()
  @IsDateString()
  occurrenceDate?: string;

  @ApiProperty({
    description: '접수일',
    example: '2024-03-19',
  })
  @IsDateString()
  receiptDate: string;

  @ApiProperty({
    description: '클레임 유형',
    enum: ComplaintType,
    example: ComplaintType.QUALITY,
  })
  @IsEnum(ComplaintType)
  complaintType: ComplaintType;

  @ApiPropertyOptional({
    description: '심각도',
    enum: ComplaintSeverity,
    example: ComplaintSeverity.MAJOR,
  })
  @IsOptional()
  @IsEnum(ComplaintSeverity)
  severity?: ComplaintSeverity;

  @ApiProperty({
    description: '클레임 내용',
    example: '제품 표면에 스크래치가 발견되었습니다.',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: '불량 수량',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defectQty?: number;

  @ApiPropertyOptional({
    description: '연결된 로트 번호',
    example: 'LOT-20240315-001',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;

  @ApiPropertyOptional({
    description: '보고자',
    example: '김품질',
  })
  @IsOptional()
  @IsString()
  reportedBy?: string;

  @ApiPropertyOptional({
    description: '담당자',
    example: '이처리',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '긴급 처리 필요',
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
