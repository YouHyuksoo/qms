# QMS 메뉴 구조 (Menu Structure)
## 개발품질 + 필드품질 강화 버전

**작성일:** 2026-03-19  
**버전:** 2.0 (품질 기능 강화)

---

## 📊 메뉴 구조 개요

```
QMS 품질경영시스템
│
├── 🏠 대시보드
│   ├── 품질 종합 현황 (MVP)
│   ├── 경영 검토 리포트 (MVP)
│   └── 품질 비용(CoQ) 대시보드 [UI Only]
│
├── 🎯 조직의 맥락 & 리더십
│   ├── 조직 내외부 이슈 관리 (MVP)
│   ├── 품질 방침 관리 (MVP)
│   └── 경영 검토(Management Review) (MVP)
│
├── ⚠️ 리스크 및 기회 관리
│   ├── 리스크 등록부(Risk Register) (MVP)
│   └── 비상 계획(Contingency Plans) 관리 (MVP)
│
├── 🔍 검사관리 (QC Management) - 현장 품질
│   ├── IQC (수입검사/원자재검사) (MVP)
│   ├── IPQC (공정검사/순회검사) (MVP)
│   ├── FQC (최종검사) (MVP)
│   └── OQC (출하검사) (MVP)
│
├── ⚠️ 부적합 관리 (Nonconformance) - 현장 품질
│   ├── NCR 등록 (Non-Conformance Report) (MVP)
│   ├── MRB 심의 (Material Review Board) (MVP)
│   ├── 부적합품 처분 실행 (MVP)
│   └── NCR 현황/통계 (MVP)
│
├── 📄 검사성적서 관리 (Inspection Certificate)
│   ├── 검사성적서 발행 (MVP)
│   ├── 성적서 양식 관리 (MVP)
│   └── 성적서 이력/추적 (MVP)
│
├── 🛠️ 제품개발품질관리 (Design Quality) ⭐ 강화
│   │
│   ├── APQP (제품 품질 계획) (MVP)
│   │   ├── APQP 프로젝트 관리 (MVP)
│   │   ├── Gate 관리 (산출물 체크) (MVP)
│   │   ├── 특수 특성(SC/CC) 관리 (MVP)
│   │   └── 타겟 vs 실적 품질 비교 (MVP) ⭐ NEW
│   │
│   ├── PPAP (생산 부품 승인) (MVP)
│   │   ├── PPAP 제출 관리 (MVP)
│   │   ├── 제출 수준(Level 1~5) 설정 (MVP)
│   │   ├── PSW 관리 (MVP)
│   │   └── 승인/반려 이력 및 재제출 관리 (MVP) ⭐ NEW
│   │
│   ├── 설계 검증 (Design Validation) (MVP) ⭐ NEW
│   │   ├── DVP&R (설계 검증 계획 및 결과) (MVP)
│   │   └── 초기 샘플 검사 관리 (MVP)
│   │
│   ├── FMEA (고장 모드 영향 분석)
│   │   ├── DFMEA (설계 FMEA) [UI Only]
│   │   ├── PFMEA (공정 FMEA) [UI Only]
│   │   └── 위험 순위 관리 (RPN) [UI Only]
│   │
│   └── MSA (측정 시스템 분석) [UI Only]
│       ├── Gage R&R [UI Only]
│       ├── 편의/선형성/안정성 [UI Only]
│       └── MSA 계획 및 이력 [UI Only]
│
├── 🔧 CAPA (시정/예방 조치) (MVP)
│   ├── CAPA 요청 (NCR 자동 연계) (MVP)
│   ├── 근본 원인 분석 (5-Why, Fishbone) (MVP)
│   ├── 8D 보고서 (MVP)
│   ├── 조치 계획 수립/실행 (MVP)
│   ├── 효과성 검증(Effectiveness Check) (MVP)
│   └── CAPA 현황/통계 (MVP)
│
├── 🔧 변경 관리(Change Management)
│   ├── 변경 요청(ECR) 등록 [UI Only]
│   ├── 변경 영향 분석(Impact Analysis) [UI Only]
│   └── 변경 승인 워크플로우 [UI Only]
│
├── 📍 추적성(Traceability) 관리 (MVP)
│   ├── 로트(Lot) 추적 (MVP)
│   ├── 순방향 추적(Forward) (MVP)
│   └── 역방향 추적(Backward) (MVP)
│
├── 📐 계측기 관리 (MVP)
│   ├── 계측기 등록/이력 (MVP)
│   ├── 교정 스케줄링 (MVP)
│   ├── 교정 결과 관리 (MVP)
│   └── OOT(Out of Tolerance) 처리 (MVP)
│
├── 👥 인적 자원 및 역량 관리 (MVP)
│   ├── 역량 매트릭스(Skill Matrix) (MVP)
│   ├── 교육 훈련 관리 (MVP)
│   └── 자격/인증 관리 (MVP)
│
├── 🏭 공급업체 품질 관리(SQM) (MVP)
│   ├── 협력사 등록/평가 (MVP)
│   ├── SCAR 포탈 (Supplier CAPA) (MVP)
│   └── 공급사 PPAP 관리 (MVP)
│
├── 📞 필드품질관리 (Field Quality) ⭐ 강화
│   │
│   ├── 고객 불만/클리 관리 (Customer Complaint) (MVP)
│   │   ├── 클레임 등록 및 NCR 연계 (MVP)
│   │   ├── 클레임 분석 (제품별/고객사별/트렌드) (MVP) ⭐ NEW
│   │   ├── 클레임 처리 시간 분석 (MVP) ⭐ NEW
│   │   └── 반품(RMA) 관리 (MVP)
│   │
│   ├── 보증 관리 (Warranty Management) (MVP) ⭐ NEW
│   │   ├── 보증 불량 등록 및 비용 추적 (MVP)
│   │   ├── 보증 불량률(Warranty PPM) 모니터링 (MVP)
│   │   └── 보증 만료 알림 및 점검 (MVP)
│   │
│   ├── 필드 불량 분석 (Field Failure Analysis) (MVP) ⭐ NEW
│   │   ├── 필드 불량 생산 이력 역추적 (MVP)
│   │   ├── 동일 원인 불량 그룹화/패턴 분석 (MVP)
│   │   └── 필드 대책 적용 및 효과 검증 (MVP)
│   │
│   └── 리콜 관리 (Recall Management) (MVP) ⭐ NEW
│       ├── 리콜 대상 범위 파악 (MVP)
│       ├── 리콜 진행 상황 모니터링 (MVP)
│       └── 리콜 비용/진행 현황 리포트 (MVP)
│
├── 📄 문서관리 (Document Control) [UI Only]
│   ├── 문서 등록/결재 [UI Only]
│   ├── 문서 배포/회수 [UI Only]
│   └── 버전 관리 [UI Only]
│
├── 🔍 감사관리 (Audit Management) [UI Only]
│   ├── 내부 감사 계획/실시 [UI Only]
│   ├── 2자 감사(공급사) [UI Only]
│   └── 3자 감사(인증기관) [UI Only]
│
├── 📊 SPC (통계적 공정 관리) [UI Only]
│   ├── 관리도 (X-bar R, X-bar S, P, C 등) [UI Only]
│   ├── 공정능력 분석 (Cp, Cpk) [UI Only]
│   └── 이상 징후 알람 [UI Only]
│
└── ⚙️ 기준정보 (Master Data)
    ├── 품번 관리 (MVP)
    ├── 고객사 관리 (MVP)
    ├── 공급업체 관리 (MVP)
    ├── 검사 기준 관리 (MVP)
    ├── 부적합 유형/코드 관리 (MVP)
    ├── MRB 위원 관리 (MVP)
    └── 공정/라인/장비 관리 (MVP)
```

---

## 🎯 MVP 기능 강화 포인트

### 개발품질 (Design Quality) 강화

| 기능 | 설명 | 중요도 |
|------|------|--------|
| **타겟 vs 실적 품질 비교** | APQP 단계별 목표 달성도 추적 | ⭐⭐⭐ |
| **승인/반려 이력 관리** | PPAP 재제출까지 추적 | ⭐⭐⭐ |
| **DVP&R 관리** | 설계 검증 계획 및 결과 관리 | ⭐⭐⭐ |
| **초기 샘플 검사** | 양산 전 설계 적합성 검증 | ⭐⭐⭐ |

### 필드품질 (Field Quality) 강화

| 기능 | 설명 | 중요도 |
|------|------|--------|
| **클리 분석/트렌드** | 제품별/고객사별 패턴 분석 | ⭐⭐⭐ |
| **처리 시간 분석** | 클레임 대응 병목 구간 파악 | ⭐⭐⭐ |
| **보증 관리** | Warranty PPM, 비용 추적 | ⭐⭐⭐ |
| **필드 불량 역추적** | 생산 이력 연계 원인 분석 | ⭐⭐⭐ |
| **리콜 관리** | 리콜 계획 및 진행 관리 | ⭐⭐⭐ |

---

## 📋 개발 우선순위 (Phase별)

### Phase 2: 전체 메뉴 UI 구성
- 모든 메뉴 페이지 생성 (빈 화면 또는 샘플 데이터)
- MVP 메뉴 표시 (⭐ 아이콘으로 구분)
- 사이드바 네비게이션 구성

### Phase 3: 현장 품질 (Inspection + NCR)
- IQC/IPQC/FQC/OQC
- 부적합 관리 (NCR/MRB)
- 검사성적서

### Phase 4: 개발 품질 (APQP/PPAP/설계검증) ⭐ 강화
- APQP (Gate 관리, 타겟vs실적)
- PPAP (승인/반려 이력)
- **DVP&R (신규)**
- **초기 샘플 관리 (신규)**

### Phase 5: 필드 품질 (클리/보증/리콜) ⭐ 강화
- **클리 분석/트렌드 (신규)**
- **보증 관리 (신규)**
- **필드 불량 역추적 (신규)**
- **리콜 관리 (신규)**

### Phase 6: 기타 MVP + 고급 기능 UI
- 추적성, 계측기, 인적자원
- FMEA/MSA/SPC (UI Only)

---

## 🔗 주요 연계 흐름

### 개발 → 양산 연계
```
APQP (설계 단계)
  ↓
DVP&R (설계 검증)
  ↓
초기 샘플 검사
  ↓
PPAP 승인
  ↓
양산 시작
  ↓
IQC/IPQC/FQC/OQC (현장 품질)
  ↓
출하
  ↓
클리/보증 (필드 품질)
  ↓
[문제 발생 시]
  ↓
필드 불량 역추적 → NCR → CAPA → 개선
```

---

*본 문서는 전문가 조언을 반영하여 개발품질과 필드품질 기능을 강화한 메뉴 구조입니다.*
