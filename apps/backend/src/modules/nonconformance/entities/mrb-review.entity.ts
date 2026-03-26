/**
 * @file mrb-review.entity.ts
 * @description MRB 심의 관련 enum 정의
 */

export enum DispositionType {
  USE_AS_IS = 'USE_AS_IS',
  REWORK = 'REWORK',
  REPAIR = 'REPAIR',
  SCRAP = 'SCRAP',
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER',
  SORT = 'SORT',
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DEFERRED = 'DEFERRED',
}
