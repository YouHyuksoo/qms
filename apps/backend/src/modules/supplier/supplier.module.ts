/**
 * @file supplier.module.ts
 * @description 공급업체 품질 관리 모듈
 *
 * 공급업체 평가(SupplierEvaluation)와 SCAR(시정 조치 요구서)를
 * 관리하는 NestJS 모듈입니다.
 * PrismaService를 통해 데이터베이스에 접근합니다.
 *
 * 초보자 가이드:
 * - 이 모듈을 app.module.ts에 등록하면 /suppliers/* API가 활성화됩니다.
 * - SupplierEvaluationService: 평가 CRUD + 스코어카드 + 통계
 * - SupplierScarService: SCAR CRUD + 종결 처리
 */
import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierEvaluationService } from './supplier-evaluation.service';
import { SupplierScarService } from './supplier-scar.service';

@Module({
  controllers: [SupplierController],
  providers: [SupplierEvaluationService, SupplierScarService],
  exports: [SupplierEvaluationService, SupplierScarService],
})
export class SupplierModule {}
