/**
 * @file certificate.module.ts
 * @description 검사성적서 관리 모듈
 *
 * 검사성적서(Inspection Certificate)와 템플릿(Certificate Template) 관련
 * 컨트롤러, 서비스를 하나의 NestJS 모듈로 구성합니다.
 * Prisma를 통해 DB에 접근합니다.
 */
import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { PrismaModule } from '../../prisma';

/**
 * 검사성적서 관리 모듈
 */
@Module({
  imports: [PrismaModule],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
