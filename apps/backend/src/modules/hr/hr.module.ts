/**
 * @file hr.module.ts
 * @description HR(인적자원 관리) 모듈
 *
 * 직원 역량/자격 관리 및 교육 이력 관리 기능을 제공하는 NestJS 모듈입니다.
 * PrismaService를 통해 데이터베이스에 접근합니다.
 * - EmployeeCompetency: 직원 역량/자격
 * - TrainingRecord: 교육 이력
 */
import { Module } from '@nestjs/common';
import { HrCompetencyService } from './hr-competency.service';
import { HrTrainingService } from './hr-training.service';
import { HrController } from './hr.controller';

/**
 * HR 모듈
 */
@Module({
  controllers: [HrController],
  providers: [HrCompetencyService, HrTrainingService],
  exports: [HrCompetencyService, HrTrainingService],
})
export class HrModule {}
