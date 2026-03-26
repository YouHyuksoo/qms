import { Module } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { InspectionController } from './inspection.controller';

/**
 * 검사 관리 모듈
 *
 * IQC, IPQC, FQC, OQC 등의 검사 로트 및 결과를 관리합니다.
 */
@Module({
  controllers: [InspectionController],
  providers: [InspectionService],
  exports: [InspectionService],
})
export class InspectionModule {}
