/**
 * @file close-scar.dto.ts
 * @description SCAR 종결 DTO
 *
 * SCAR을 종결 처리할 때 사용하는 데이터 전송 객체입니다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

/**
 * SCAR 종결 DTO
 */
export class CloseScarDto {
  @ApiPropertyOptional({ description: '검토자', example: '박검토' })
  @IsOptional()
  @IsString()
  reviewedBy?: string;

  @ApiPropertyOptional({ description: '비고', example: '시정조치 효과 확인 완료' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({ description: '종결 처리자', example: 'admin' })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
