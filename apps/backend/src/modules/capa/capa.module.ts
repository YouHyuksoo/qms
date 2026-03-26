/**
 * @file capa.module.ts
 * @description CAPA(시정/예방 조치) 모듈
 *
 * CAPA 관련 서비스, 컨트롤러를 묶는 NestJS 모듈입니다.
 * Prisma를 통해 DB에 접근합니다.
 *
 * 초보자 가이드:
 * - PrismaModule을 import하여 PrismaService를 주입받습니다.
 * - CapaService를 exports하여 다른 모듈에서도 사용할 수 있게 합니다.
 */
import { Module } from '@nestjs/common';
import { CapaService } from './capa.service';
import { CapaController } from './capa.controller';
import { PrismaModule } from '../../prisma';

/**
 * CAPA 관리 모듈
 */
@Module({
  imports: [PrismaModule],
  controllers: [CapaController],
  providers: [CapaService],
  exports: [CapaService],
})
export class CapaModule {}
