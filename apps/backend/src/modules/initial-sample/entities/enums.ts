/**
 * @file enums.ts
 * @description 초도품 검사 관련 열거형 정의
 * 초보자 가이드: 순환 참조를 방지하기 위해 enum을 별도 파일로 분리한다.
 */

export enum InspectionResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  PENDING = 'PENDING',
  CONDITIONAL = 'CONDITIONAL',
}

export enum SampleStatus {
  REGISTERED = 'REGISTERED',
  INSPECTING = 'INSPECTING',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
