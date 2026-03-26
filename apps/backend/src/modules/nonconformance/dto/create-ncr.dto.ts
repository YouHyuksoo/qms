import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { DefectType, NcrSource } from '../entities/ncr.entity';

/**
 * NCR 생성 DTO
 */
export class CreateNcrDto {
  @ApiProperty({
    description: 'NCR 번호',
    example: 'NCR-20240319-001',
  })
  @IsString()
  ncrNo: string;

  @ApiProperty({
    description: '제목',
    example: '외관 결함 발견',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: '상세 설명',
    example: '표면에 스크래치가 발견되었습니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '발생일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  occurrenceDate?: string;

  @ApiPropertyOptional({
    description: '연결된 로트 번호',
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
    description: '불량 수량',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defectQty?: number;

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
    description: '보고일',
    example: '2024-03-19',
  })
  @IsOptional()
  @IsDateString()
  reportedDate?: string;

  @ApiPropertyOptional({
    description: '담당자',
    example: '이개선',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({
    description: '완료 예정일',
    example: '2024-03-26',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: '근본 원인',
    example: '공구 마모로 인한 표면 불량',
  })
  @IsOptional()
  @IsString()
  rootCause?: string;

  @ApiPropertyOptional({
    description: '시정 조치',
    example: '공구 교체 및 작업 재개',
  })
  @IsOptional()
  @IsString()
  correctiveAction?: string;

  @ApiPropertyOptional({
    description: '예방 조치',
    example: '공구 수명 관리 체계 도입',
  })
  @IsOptional()
  @IsString()
  preventiveAction?: string;

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
