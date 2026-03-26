import { Module } from '@nestjs/common';
import { FieldAnalysisService } from './field-analysis.service';
import { FieldAnalysisController } from './field-analysis.controller';

/**
 * 필드 불량 분석 모듈
 */
@Module({
  controllers: [FieldAnalysisController],
  providers: [FieldAnalysisService],
  exports: [FieldAnalysisService],
})
export class FieldAnalysisModule {}
