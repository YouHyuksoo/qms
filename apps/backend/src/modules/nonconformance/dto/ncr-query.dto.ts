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
import { NcrStatus, DefectType, NcrSource } from '../entities/ncr.entity';

/**
 * NCR 조회 쿼리 DTO
 */
export class NcrQueryDto {
  @ApiPropertyOptional({
    description: 'NCR 번호',
    example: 'NCR-20240319',
  })
  @IsOptional()
  @IsString()
  ncrNo?: string;

  @ApiPropertyOptional({
    description: '제목',
    example: '외관 결함',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: '로트 번호',
    example: 'LOT-20240319-001',
  })
  @IsOptional()
  @IsString()
  lotNo?: string;

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
    description: '상태',
    enum: NcrStatus,
    example: NcrStatus.UNDER_REVIEW,
  })
  @IsOptional()
  @IsEnum(NcrStatus)
  status?: NcrStatus;

  @ApiPropertyOptional({
    description: '불량 유형',
    enum: DefectType,
    example: DefectType.MAJOR,
  })
  @IsOptional()
  @IsEnum(DefectType)
  defectType?: DefectType;

  @ApiPropertyOptional({
    description: '발생 출처',
    enum: NcrSource,
    example: NcrSource.INSPECTION,
  })
  @IsOptional()
  @IsEnum(NcrSource)
  source?: NcrSource;

  @ApiPropertyOptional({
    description: '보고자',
    example: '김품질',
  })
  @IsOptional()
  @IsString()
  reportedBy?: string;

  @ApiPropertyOptional({
    description: '담당자',
    example: '이개선',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: '발생일 시작',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsDateString()
  occurrenceDateFrom?: string;

  @ApiPropertyOptional({
    description: '발생일 종료',
    example: '2024-03-31',
  })
  @IsOptional()
  @IsDateString()
  occurrenceDateTo?: string;

  @ApiPropertyOptional({
    description: '페이지 번호',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: '페이지 크기',
    example: 20,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: '정렬 필드',
    example: 'occurrenceDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'occurrenceDate';

  @ApiPropertyOptional({
    description: '정렬 방향',
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
