/**
 * @file traceability.module.ts
 * @description 추적성 관리 모듈
 *
 * PrismaService를 통해 LotTrace 데이터에 접근하고,
 * TraceabilityService와 TraceabilityController를 제공합니다.
 */
import { Module } from '@nestjs/common';
import { TraceabilityService } from './traceability.service';
import { TraceabilityController } from './traceability.controller';

/**
 * 추적성 관리 모듈
 */
@Module({
  controllers: [TraceabilityController],
  providers: [TraceabilityService],
  exports: [TraceabilityService],
})
export class TraceabilityModule {}
