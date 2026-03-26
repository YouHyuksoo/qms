/**
 * @file inspection-lot.entity.ts
 * @description 검사 로트 관련 enum 정의
 */

export enum InspectionType {
  IQC = 'IQC',
  IPQC = 'IPQC',
  FQC = 'FQC',
  OQC = 'OQC',
}

export enum InspectionJudgment {
  PASS = 'PASS',
  FAIL = 'FAIL',
  HOLD = 'HOLD',
}

export enum InspectionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
