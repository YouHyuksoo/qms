import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ComplaintType, ComplaintSeverity, ComplaintStatus } from '../entities/customer-complaint.entity';

/**
 * 클레임 조회 DTO
 */
export class ComplaintQueryDto {
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
    description: '정렬 기준 필드',
    example: 'receiptDate',
    default: 'receiptDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'receiptDate';

  @ApiPropertyOptional({
    description: '정렬 순서',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    description: '클레임 ID',
    example: 'COMP-20240319-001',
  })
  @IsOptional()
  @IsString()
  complaintId?: string;

  @ApiPropertyOptional({
    description: '클레임 번호',
    example: 'CLM-2024-001',
  })
  @IsOptional()
  @IsString()
  complaintNo?: string;

  @ApiPropertyOptional({
    description: '고객 코드',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '품목 코드',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '클레임 유형',
    enum: ComplaintType,
    example: ComplaintType.QUALITY,
  })
  @IsOptional()
  @IsEnum(ComplaintType)
  complaintType?: ComplaintType;

  @ApiPropertyOptional({
    description: '심각도',
    enum: ComplaintSeverity,
    example: ComplaintSeverity.MAJOR,
  })
  @IsOptional()
  @IsEnum(ComplaintSeverity)
  severity?: ComplaintSeverity;

  @ApiPropertyOptional({
    description: '상태',
    enum: ComplaintStatus,
    example: ComplaintStatus.RECEIVED,
  })
  @IsOptional()
  @IsEnum(ComplaintStatus)
  status?: ComplaintStatus;

  @ApiPropertyOptional({
    description: '접수일 (시작)',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsDateString()
  receiptDateFrom?: string;

  @ApiPropertyOptional({
    description: '접수일 (종료)',
    example: '2024-03-31',
  })
  @IsOptional()
  @IsDateString()
  receiptDateTo?: string;

  @ApiPropertyOptional({
    description: '담당자',
    example: '이처리',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: '로트 번호',
    example: 'LOT-20240315-001',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;
}
