import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { TestResult } from '../entities/dvp-result.entity';

/**
 * DVP 결과 기록 DTO
 */
export class RecordDvpResultDto {
  @ApiProperty({
    description: '결과 ID',
    example: 'RESULT-20240319-001',
  })
  @IsString()
  resultId: string;

  @ApiPropertyOptional({
    description: '실제 시작일',
    example: '2024-04-02',
  })
  @IsOptional()
  @IsDateString()
  actualStartDate?: string;

  @ApiPropertyOptional({
    description: '실제 종료일',
    example: '2024-04-14',
  })
  @IsOptional()
  @IsDateString()
  actualEndDate?: string;

  @ApiPropertyOptional({
    description: '시험 수량',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  testedQty?: number;

  @ApiPropertyOptional({
    description: '합격 수량',
    example: 4,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  passedQty?: number;

  @ApiPropertyOptional({
    description: '불합격 수량',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  failedQty?: number;

  @ApiPropertyOptional({
    description: '시험 결과',
    enum: TestResult,
    example: TestResult.PASS,
  })
  @IsOptional()
  @IsEnum(TestResult)
  testResult?: TestResult;

  @ApiPropertyOptional({
    description: '시험 보고서 번호',
    example: 'RPT-2024-001',
  })
  @IsOptional()
  @IsString()
  testReportNo?: string;

  @ApiPropertyOptional({
    description: '시험 보고서 경로',
    example: '/reports/dvp/rpt-2024-001.pdf',
  })
  @IsOptional()
  @IsString()
  testReportPath?: string;

  @ApiPropertyOptional({
    description: '시험자',
    example: '김시험',
  })
  @IsOptional()
  @IsString()
  testedBy?: string;

  @ApiPropertyOptional({
    description: '측정값',
    example: '제동력: 3200N, 페이드: 5%',
  })
  @IsOptional()
  @IsString()
  measuredValues?: string;

  @ApiPropertyOptional({
    description: '결함 설명',
    example: '1건 제동력 미달 (2800N)',
  })
  @IsOptional()
  @IsString()
  defectDescription?: string;

  @ApiPropertyOptional({
    description: '시정 조치',
    example: '프리컴파운드 조정 후 재시험 예정',
  })
  @IsOptional()
  @IsString()
  correctiveAction?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '시험 완료',
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

/**
 * DVP 결과 수정 DTO
 */
export class UpdateDvpResultDto {
  @ApiPropertyOptional({
    description: '실제 시작일',
    example: '2024-04-02',
  })
  @IsOptional()
  @IsDateString()
  actualStartDate?: string;

  @ApiPropertyOptional({
    description: '실제 종료일',
    example: '2024-04-14',
  })
  @IsOptional()
  @IsDateString()
  actualEndDate?: string;

  @ApiPropertyOptional({
    description: '시험 수량',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  testedQty?: number;

  @ApiPropertyOptional({
    description: '합격 수량',
    example: 4,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  passedQty?: number;

  @ApiPropertyOptional({
    description: '불합격 수량',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  failedQty?: number;

  @ApiPropertyOptional({
    description: '시험 결과',
    enum: TestResult,
    example: TestResult.PASS,
  })
  @IsOptional()
  @IsEnum(TestResult)
  testResult?: TestResult;

  @ApiPropertyOptional({
    description: '시험 보고서 번호',
    example: 'RPT-2024-001',
  })
  @IsOptional()
  @IsString()
  testReportNo?: string;

  @ApiPropertyOptional({
    description: '측정값',
    example: '제동력: 3200N, 페이드: 5%',
  })
  @IsOptional()
  @IsString()
  measuredValues?: string;

  @ApiPropertyOptional({
    description: '결함 설명',
    example: '1건 제동력 미달 (2800N)',
  })
  @IsOptional()
  @IsString()
  defectDescription?: string;

  @ApiPropertyOptional({
    description: '시정 조치',
    example: '프리컴파운드 조정 후 재시험 예정',
  })
  @IsOptional()
  @IsString()
  correctiveAction?: string;

  @ApiPropertyOptional({
    description: '비고',
    example: '시험 완료',
  })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    description: '수정자',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
