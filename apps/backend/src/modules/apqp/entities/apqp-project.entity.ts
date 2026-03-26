/**
 * @file apqp-project.entity.ts
 * @description APQP enum
 */

export enum ApqpProjectStatus {
  PLANNING = 'PLANNING',
  PRODUCT_DESIGN = 'PRODUCT_DESIGN',
  PROCESS_DESIGN = 'PROCESS_DESIGN',
  VALIDATION = 'VALIDATION',
  PRODUCTION = 'PRODUCTION',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}
