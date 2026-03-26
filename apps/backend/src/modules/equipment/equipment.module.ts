/**
 * @file equipment.module.ts
 * @description 계측기 관리 모듈
 *
 * 초보자 가이드:
 * - NestJS 모듈로, PrismaService를 통해 Equipment와 Calibration 데이터에 접근합니다.
 * - EquipmentController(API)와 EquipmentService(비즈니스 로직)를 묶어줍니다.
 */
import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';

/**
 * 계측기 관리 모듈
 */
@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService],
})
export class EquipmentModule {}
