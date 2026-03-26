import { Module } from '@nestjs/common';
import { ApqpService } from './apqp.service';
import { ApqpController } from './apqp.controller';
import { PrismaModule } from '../../prisma';

/**
 * APQP 관리 모듈
 *
 * APQP (Advanced Product Quality Planning) 프로젝트, 단계, 산출물을 관리합니다.
 */
@Module({
  imports: [PrismaModule],
  controllers: [ApqpController],
  providers: [ApqpService],
  exports: [ApqpService],
})
export class ApqpModule {}
