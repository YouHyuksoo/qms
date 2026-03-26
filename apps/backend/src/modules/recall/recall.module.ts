import { Module } from '@nestjs/common';
import { RecallService } from './recall.service';
import { RecallController } from './recall.controller';

/**
 * 리콜 관리 모듈
 */
@Module({
  controllers: [RecallController],
  providers: [RecallService],
  exports: [RecallService],
})
export class RecallModule {}
