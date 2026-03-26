import { Module } from '@nestjs/common';
import { PpapService } from './ppap.service';
import { PpapController } from './ppap.controller';
import { PrismaModule } from '../../prisma';

/**
 * PPAP 관리 모듈
 *
 * PPAP (Production Part Approval Process) 제출, 문서, 승인 이력을 관리합니다.
 */
@Module({
  imports: [PrismaModule],
  controllers: [PpapController],
  providers: [PpapService],
  exports: [PpapService],
})
export class PpapModule {}
