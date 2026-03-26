import { Module } from '@nestjs/common';
import { InitialSampleService } from './initial-sample.service';
import { InitialSampleController } from './initial-sample.controller';
import { PrismaModule } from '../../prisma';

/**
 * 초기 샘플 관리 모듈
 *
 * 초기 샘플(Initial Sample) 등록 및 검사 결과를 관리합니다.
 */
@Module({
  imports: [PrismaModule],
  controllers: [InitialSampleController],
  providers: [InitialSampleService],
  exports: [InitialSampleService],
})
export class InitialSampleModule {}
