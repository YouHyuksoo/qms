/**
 * @file update-competency.dto.ts
 * @description 역량 수정 DTO
 *
 * 기존 직원 역량/자격 정보를 수정할 때 사용합니다.
 * 모든 필드가 선택적(optional)입니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { CompetencyLevel } from '../entities/employee-competency.entity';

/**
 * 역량 수정 DTO
 */
export class UpdateCompetencyDto {
  @ApiPropertyOptional({ description: '직원명', example: '김철수' })
  @IsOptional()
  @IsString()
  employeeName?: string;

  @ApiPropertyOptional({ description: '부서', example: '품질관리팀' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: '담당 공정 코드', example: 'PROC-001' })
  @IsOptional()
  @IsString()
  processCode?: string;

  @ApiPropertyOptional({ description: '기술/역량 명', example: '용접 기술' })
  @IsOptional()
  @IsString()
  skillName?: string;

  @ApiPropertyOptional({
    description: '역량 수준',
    enum: CompetencyLevel,
    example: CompetencyLevel.ADVANCED,
  })
  @IsOptional()
  @IsEnum(CompetencyLevel)
  competencyLevel?: CompetencyLevel;

  @ApiPropertyOptional({ description: '자격증명', example: '용접기능사' })
  @IsOptional()
  @IsString()
  certificationName?: string;

  @ApiPropertyOptional({ description: '자격증 번호', example: 'CERT-2024-001' })
  @IsOptional()
  @IsString()
  certificationNo?: string;

  @ApiPropertyOptional({ description: '자격 취득일', example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  certificationDate?: string;

  @ApiPropertyOptional({ description: '자격 만료일', example: '2027-01-15' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({ description: '자격 유효 여부', example: true })
  @IsOptional()
  @IsBoolean()
  isQualified?: boolean;

  @ApiPropertyOptional({ description: '비고', example: '특수공정 자격' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '수정자', example: 'admin' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
