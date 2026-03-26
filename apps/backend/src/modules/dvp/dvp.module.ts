import { Module } from '@nestjs/common';
import { DvpService } from './dvp.service';
import { DvpController } from './dvp.controller';
import { PrismaModule } from '../../prisma';

/**
 * DVP 관리 모듈
 *
 * DVP (Design Validation Plan) 계획 및 결과를 관리합니다.
 */
@Module({
  imports: [PrismaModule],
  controllers: [DvpController],
  providers: [DvpService],
  exports: [DvpService],
})
export class DvpModule {}
