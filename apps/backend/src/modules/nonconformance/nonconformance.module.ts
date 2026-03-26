import { Module } from '@nestjs/common';
import { NonconformanceService } from './nonconformance.service';
import { NonconformanceController } from './nonconformance.controller';

/**
 * 부적합 관리 모듈
 *
 * NCR 및 MRB 심의를 관리합니다.
 */
@Module({
  controllers: [NonconformanceController],
  providers: [NonconformanceService],
  exports: [NonconformanceService],
})
export class NonconformanceModule {}
