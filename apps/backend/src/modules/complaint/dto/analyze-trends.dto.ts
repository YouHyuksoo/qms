import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ComplaintType, ComplaintSeverity } from '../entities/customer-complaint.entity';

/**
 * 트렌드 분석 DTO
 */
export class AnalyzeTrendsDto {
  @ApiProperty({
    description: '분석 기간 시작일',
    example: '2024-01-01',
  })
  @IsDateString()
  dateFrom: string;

  @ApiProperty({
    description: '분석 기간 종료일',
    example: '2024-12-31',
  })
  @IsDateString()
  dateTo: string;

  @ApiPropertyOptional({
    description: '그룹화 기준',
    enum: ['CUSTOMER', 'ITEM', 'TYPE', 'SEVERITY', 'MONTH'],
    example: 'MONTH',
    default: 'MONTH',
  })
  @IsOptional()
  @IsString()
  groupBy?: 'CUSTOMER' | 'ITEM' | 'TYPE' | 'SEVERITY' | 'MONTH' = 'MONTH';

  @ApiPropertyOptional({
    description: '고객 코드 필터',
    example: 'CUST-001',
  })
  @IsOptional()
  @IsString()
  customerCode?: string;

  @ApiPropertyOptional({
    description: '품목 코드 필터',
    example: 'ITEM-001',
  })
  @IsOptional()
  @IsString()
  itemCode?: string;

  @ApiPropertyOptional({
    description: '클레임 유형 필터',
    enum: ComplaintType,
    example: ComplaintType.QUALITY,
  })
  @IsOptional()
  @IsEnum(ComplaintType)
  complaintType?: ComplaintType;

  @ApiPropertyOptional({
    description: '심각도 필터',
    enum: ComplaintSeverity,
    example: ComplaintSeverity.MAJOR,
  })
  @IsOptional()
  @IsEnum(ComplaintSeverity)
  severity?: ComplaintSeverity;
}

/**
 * 응답 시간 분석 DTO
 */
export class AnalyzeResponseTimeDto {
  @ApiProperty({
    description: '분석 기간 시작일',
    example: '2024-01-01',
  })
  @IsDateString()
  dateFrom: string;

  @ApiProperty({
    description: '분석 기간 종료일',
    example: '2024-12-31',
  })
  @IsDateString()
  dateTo: string;

  @ApiPropertyOptional({
    description: '그룹화 기준',
    enum: ['CUSTOMER', 'ITEM', 'TYPE', 'SEVERITY', 'ASSIGNED_TO'],
    example: 'SEVERITY',
    default: 'SEVERITY',
  })
  @IsOptional()
  @IsString()
  groupBy?: 'CUSTOMER' | 'ITEM' | 'TYPE' | 'SEVERITY' | 'ASSIGNED_TO' = 'SEVERITY';
}

/**
 * 클레임 해결 DTO
 */
export class ResolveComplaintDto {
  @ApiProperty({
    description: '해결책',
    example: '교환 처리 완료 및 재발방지 대책 수립',
  })
  @IsString()
  resolution: string;

  @ApiPropertyOptional({
    description: '처리자',
    example: '이처리',
  })
  @IsOptional()
  @IsString()
  resolvedBy?: string;
}

/**
 * 클레임 종결 DTO
 */
export class CloseComplaintDto {
  @ApiPropertyOptional({
    description: '만족도 점수 (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  satisfactionScore?: number;

  @ApiPropertyOptional({
    description: '종결자',
    example: '김관리',
  })
  @IsOptional()
  @IsString()
  closedBy?: string;
}
