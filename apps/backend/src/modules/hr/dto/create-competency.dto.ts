/**
 * @file create-competency.dto.ts
 * @description 역량 등록 DTO
 *
 * 새로운 직원 역량/자격 정보를 등록할 때 사용합니다.
 * 필수: competencyId, employeeId, employeeName, skillName
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { CompetencyLevel } from '../entities/employee-competency.entity';

/**
 * 역량 생성 DTO
 */
export class CreateCompetencyDto {
  @ApiProperty({ description: '역량 ID', example: 'COMP-EMP-001' })
  @IsString()
  competencyId: string;

  @ApiProperty({ description: '직원 ID', example: 'EMP-001' })
  @IsString()
  employeeId: string;

  @ApiProperty({ description: '직원명', example: '김철수' })
  @IsString()
  employeeName: string;

  @ApiPropertyOptional({ description: '부서', example: '품질관리팀' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: '담당 공정 코드', example: 'PROC-001' })
  @IsOptional()
  @IsString()
  processCode?: string;

  @ApiProperty({ description: '기술/역량 명', example: '용접 기술' })
  @IsString()
  skillName: string;

  @ApiPropertyOptional({
    description: '역량 수준',
    enum: CompetencyLevel,
    example: CompetencyLevel.INTERMEDIATE,
    default: CompetencyLevel.BEGINNER,
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

  @ApiPropertyOptional({
    description: '자격 유효 여부',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isQualified?: boolean;

  @ApiPropertyOptional({ description: '비고', example: '특수공정 자격' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '생성자', example: 'admin' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
