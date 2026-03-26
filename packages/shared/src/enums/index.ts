// Inspection Status
export enum InspectionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum JudgmentResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  HOLD = 'HOLD'
}

// NCR Status
export enum NcrStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  DISPOSITION_DECIDED = 'DISPOSITION_DECIDED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED'
}

export enum DispositionType {
  REWORK = 'REWORK',
  REPAIR = 'REPAIR',
  USE_AS_IS = 'USE_AS_IS',
  SCRAP = 'SCRAP',
  RTV = 'RTV'
}

// APQP Status
export enum ApqpPhase {
  PLANNING = 'PLANNING',
  PRODUCT_DESIGN = 'PRODUCT_DESIGN',
  PROCESS_DESIGN = 'PROCESS_DESIGN',
  VALIDATION = 'VALIDATION',
  PRODUCTION = 'PRODUCTION'
}

export enum GateStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// PPAP Status
export enum PpapLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEVEL_5 = 5
}

export enum PpapStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INTERIM_APPROVED = 'INTERIM_APPROVED'
}

// CAPA Status
export enum CapaStatus {
  OPEN = 'OPEN',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  ACTION_PLANNED = 'ACTION_PLANNED',
  IMPLEMENTING = 'IMPLEMENTING',
  EFFECTIVENESS_CHECK = 'EFFECTIVENESS_CHECK',
  CLOSED = 'CLOSED'
}

// Theme
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

// Language
export enum Language {
  KO = 'ko',
  EN = 'en',
  ZH = 'zh'
}
