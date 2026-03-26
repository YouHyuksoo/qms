/**
 * @file master.module.ts
 * @description 기준정보 관리 모듈
 *
 * 고객사, 품번, 공정, 공통코드의 서비스를 등록하는 NestJS 모듈입니다.
 * PrismaService를 통해 데이터베이스에 접근합니다.
 *
 * 초보자 가이드:
 * - controllers: HTTP 요청을 받는 컨트롤러 등록
 * - providers: 비즈니스 로직을 처리하는 서비스 등록
 * - exports: 다른 모듈에서 이 모듈의 서비스를 사용할 수 있도록 내보내기
 */
import { Module } from '@nestjs/common';
import { MasterController } from './master.controller';
import { CustomerService } from './customer.service';
import { ItemService } from './item.service';
import { ProcessInfoService } from './process-info.service';
import { CommonCodeService } from './common-code.service';

/**
 * 기준정보 관리 모듈
 */
@Module({
  controllers: [MasterController],
  providers: [
    CustomerService,
    ItemService,
    ProcessInfoService,
    CommonCodeService,
  ],
  exports: [
    CustomerService,
    ItemService,
    ProcessInfoService,
    CommonCodeService,
  ],
})
export class MasterModule {}
