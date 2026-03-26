/**
 * @file change.module.ts
 * @description 변경 관리 모듈
 *
 * NestJS 모듈로, PrismaService를 통해 ChangeRequest 데이터에 접근하고,
 * ChangeService, ChangeController를 등록합니다.
 */
import { Module } from '@nestjs/common';
import { ChangeService } from './change.service';
import { ChangeController } from './change.controller';

/**
 * 변경 관리 모듈
 */
@Module({
  controllers: [ChangeController],
  providers: [ChangeService],
  exports: [ChangeService],
})
export class ChangeModule {}
