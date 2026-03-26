/**
 * @file prisma.module.ts
 * @description Prisma 모듈 - 전역 모듈로 등록하여 모든 서비스에서 주입 가능
 *
 * @Global() 데코레이터로 전역 등록되어 있으므로,
 * 다른 모듈에서 별도 import 없이 PrismaService를 주입받을 수 있습니다.
 * AppModule의 imports에 한 번만 추가하면 됩니다.
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
