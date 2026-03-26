# Phase 6-7: 기타 MVP + 통합 테스트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Phase 6 (CAPA, Certificate, Equipment, Traceability, Master, Supplier, HR, Change 백엔드 모듈) + Phase 7 (통합 테스트) 구현

**Architecture:** 기존 complaint/recall 모듈 패턴 준수. NestJS + TypeORM + Oracle. 각 모듈은 module/controller/service/entities/dto 구조. 프론트엔드 페이지는 Phase 2에서 이미 생성됨 — 백엔드 API 구현에 집중.

**Tech Stack:** NestJS 11, TypeORM, Oracle DB, class-validator, @nestjs/swagger

---

## Task 1: CAPA 모듈 (시정/예방 조치)

**Files:**
- Create: `apps/backend/src/modules/capa/capa.module.ts`
- Create: `apps/backend/src/modules/capa/capa.controller.ts`
- Create: `apps/backend/src/modules/capa/capa.service.ts`
- Create: `apps/backend/src/modules/capa/entities/capa.entity.ts`
- Create: `apps/backend/src/modules/capa/entities/effectiveness-check.entity.ts`
- Create: `apps/backend/src/modules/capa/entities/index.ts`
- Create: `apps/backend/src/modules/capa/dto/create-capa.dto.ts`
- Create: `apps/backend/src/modules/capa/dto/update-capa.dto.ts`
- Create: `apps/backend/src/modules/capa/dto/capa-query.dto.ts`
- Create: `apps/backend/src/modules/capa/dto/index.ts`
- Modify: `apps/backend/src/app.module.ts` — CapaModule import

**Entities:** Capa (QMS_CAPA), EffectivenessCheck (QMS_EFFECTIVENESS_CHECK)
**Enums:** CapaType (CORRECTIVE, PREVENTIVE), CapaStatus (OPEN, ANALYSIS, ACTION_PLANNED, IMPLEMENTING, VERIFICATION, CLOSED), CapaPriority (HIGH, MEDIUM, LOW)
**Endpoints:** CRUD + 효과성검증등록 + 분석통계

---

## Task 2: Certificate 모듈 (검사성적서)

**Files:**
- Create: `apps/backend/src/modules/certificate/certificate.module.ts`
- Create: `apps/backend/src/modules/certificate/certificate.controller.ts`
- Create: `apps/backend/src/modules/certificate/certificate.service.ts`
- Create: `apps/backend/src/modules/certificate/entities/inspection-certificate.entity.ts`
- Create: `apps/backend/src/modules/certificate/entities/certificate-template.entity.ts`
- Create: `apps/backend/src/modules/certificate/entities/index.ts`
- Create: `apps/backend/src/modules/certificate/dto/create-certificate.dto.ts`
- Create: `apps/backend/src/modules/certificate/dto/certificate-query.dto.ts`
- Create: `apps/backend/src/modules/certificate/dto/index.ts`
- Modify: `apps/backend/src/app.module.ts` — CertificateModule import

**Entities:** InspectionCertificate (QMS_INSPECTION_CERTIFICATE), CertificateTemplate (QMS_CERTIFICATE_TEMPLATE)
**Enums:** CertificateType (COA, COC, DIMENSIONAL, FULL), CertificateStatus (DRAFT, ISSUED, REISSUED, CANCELLED)
**Endpoints:** CRUD + 성적서발행 + 템플릿관리 + 이력조회

---

## Task 3: Equipment 모듈 (계측기 관리)

**Files:**
- Create: `apps/backend/src/modules/equipment/equipment.module.ts`
- Create: `apps/backend/src/modules/equipment/equipment.controller.ts`
- Create: `apps/backend/src/modules/equipment/equipment.service.ts`
- Create: `apps/backend/src/modules/equipment/entities/equipment.entity.ts`
- Create: `apps/backend/src/modules/equipment/entities/calibration.entity.ts`
- Create: `apps/backend/src/modules/equipment/entities/index.ts`
- Create: `apps/backend/src/modules/equipment/dto/create-equipment.dto.ts`
- Create: `apps/backend/src/modules/equipment/dto/equipment-query.dto.ts`
- Create: `apps/backend/src/modules/equipment/dto/calibration.dto.ts`
- Create: `apps/backend/src/modules/equipment/dto/index.ts`
- Modify: `apps/backend/src/app.module.ts` — EquipmentModule import

**Entities:** Equipment (QMS_EQUIPMENT), Calibration (QMS_CALIBRATION)
**Enums:** EquipmentStatus (ACTIVE, INACTIVE, CALIBRATING, OOT, SCRAPPED), CalibrationType (INTERNAL, EXTERNAL), CalibrationResult (PASS, FAIL, CONDITIONAL)
**Endpoints:** CRUD + 교정등록 + 교정이력 + OOT처리 + 교정예정알림

---

## Task 4: Traceability 모듈 (추적성 관리)

**Files:**
- Create: `apps/backend/src/modules/traceability/traceability.module.ts`
- Create: `apps/backend/src/modules/traceability/traceability.controller.ts`
- Create: `apps/backend/src/modules/traceability/traceability.service.ts`
- Create: `apps/backend/src/modules/traceability/entities/lot-trace.entity.ts`
- Create: `apps/backend/src/modules/traceability/entities/index.ts`
- Create: `apps/backend/src/modules/traceability/dto/trace-query.dto.ts`
- Create: `apps/backend/src/modules/traceability/dto/index.ts`
- Modify: `apps/backend/src/app.module.ts` — TraceabilityModule import

**Entities:** LotTrace (QMS_LOT_TRACE)
**Endpoints:** Forward Trace + Backward Trace + 로트 이력 조회 + 계보 조회

---

## Task 5: Master 모듈 (기준정보 관리)

**Files:**
- Create: `apps/backend/src/modules/master/master.module.ts`
- Create: `apps/backend/src/modules/master/master.controller.ts`
- Create: `apps/backend/src/modules/master/master.service.ts`
- Create: `apps/backend/src/modules/master/entities/customer.entity.ts`
- Create: `apps/backend/src/modules/master/entities/item.entity.ts`
- Create: `apps/backend/src/modules/master/entities/process-info.entity.ts`
- Create: `apps/backend/src/modules/master/entities/common-code.entity.ts`
- Create: `apps/backend/src/modules/master/entities/index.ts`
- Create: `apps/backend/src/modules/master/dto/` (CRUD DTOs per entity)
- Modify: `apps/backend/src/app.module.ts` — MasterModule import

**Entities:** Customer (QMS_CUSTOMER), Item (QMS_ITEM), ProcessInfo (QMS_PROCESS), CommonCode (QMS_COMMON_CODE)
**Endpoints:** 각 기준정보 CRUD + 코드 조회

---

## Task 6: Supplier 모듈 (공급업체 품질 관리)

**Files:**
- Create: `apps/backend/src/modules/supplier/supplier.module.ts`
- Create: `apps/backend/src/modules/supplier/supplier.controller.ts`
- Create: `apps/backend/src/modules/supplier/supplier.service.ts`
- Create: `apps/backend/src/modules/supplier/entities/supplier-evaluation.entity.ts`
- Create: `apps/backend/src/modules/supplier/entities/scar.entity.ts`
- Create: `apps/backend/src/modules/supplier/entities/index.ts`
- Create: `apps/backend/src/modules/supplier/dto/` (CRUD DTOs)
- Modify: `apps/backend/src/app.module.ts` — SupplierModule import

**Entities:** SupplierEvaluation (QMS_SUPPLIER_EVAL), Scar (QMS_SCAR)
**Enums:** EvalGrade (A, B, C, D, F), ScarStatus (ISSUED, RESPONDED, ACCEPTED, CLOSED)
**Endpoints:** CRUD + Scorecard + SCAR발행 + 평가이력

---

## Task 7: HR 모듈 (인적자원 관리)

**Files:**
- Create: `apps/backend/src/modules/hr/hr.module.ts`
- Create: `apps/backend/src/modules/hr/hr.controller.ts`
- Create: `apps/backend/src/modules/hr/hr.service.ts`
- Create: `apps/backend/src/modules/hr/entities/employee-competency.entity.ts`
- Create: `apps/backend/src/modules/hr/entities/training-record.entity.ts`
- Create: `apps/backend/src/modules/hr/entities/index.ts`
- Create: `apps/backend/src/modules/hr/dto/` (CRUD DTOs)
- Modify: `apps/backend/src/app.module.ts` — HrModule import

**Entities:** EmployeeCompetency (QMS_EMPLOYEE_COMPETENCY), TrainingRecord (QMS_TRAINING_RECORD)
**Enums:** CompetencyLevel (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT), TrainingStatus (PLANNED, IN_PROGRESS, COMPLETED, EXPIRED)
**Endpoints:** CRUD + 역량매트릭스 + 교육이력 + 자격만료알림

---

## Task 8: Change 모듈 (변경 관리)

**Files:**
- Create: `apps/backend/src/modules/change/change.module.ts`
- Create: `apps/backend/src/modules/change/change.controller.ts`
- Create: `apps/backend/src/modules/change/change.service.ts`
- Create: `apps/backend/src/modules/change/entities/change-request.entity.ts`
- Create: `apps/backend/src/modules/change/entities/index.ts`
- Create: `apps/backend/src/modules/change/dto/` (CRUD DTOs)
- Modify: `apps/backend/src/app.module.ts` — ChangeModule import

**Entities:** ChangeRequest (QMS_CHANGE_REQUEST)
**Enums:** ChangeType (DESIGN, PROCESS, MATERIAL, SUPPLIER), ChangeStatus (REQUESTED, REVIEWING, APPROVED, IMPLEMENTING, COMPLETED, REJECTED)
**Endpoints:** CRUD + 영향분석 + 승인워크플로우

---

## Task 9: app.module.ts 통합 등록

모든 신규 모듈을 app.module.ts의 imports 배열에 등록.

---

## Task 10: 전체 빌드 검증

- [ ] Backend `tsc --noEmit` 에러 0
- [ ] Frontend `tsc --noEmit` 에러 0
- [ ] Dev 서버 정상 기동 확인
