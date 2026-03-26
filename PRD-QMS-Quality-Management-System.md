# QMS 품질경영시스템 (Quality Management System)
## Product Requirements Document (PRD)

**버전:** 1.0  
**작성일:** 2026-03-19  
**상태:** 확정 (Approved)  
**타겟 사용자:** 자동차 부품 제조사 (Tier 1/2/3 공급사)

---

## 1. Problem Statement (문제 정의)

### 1.1 현재 상황의 문제점

자동차 부품 제조사들은 IATF 16949:2016 표준 준수와 고객사 요구사항 충족을 위해 QMS를 도입해야 하지만, 다음과 같은 문제에 직면해 있다:

1. **엑셀/수기 관리의 한계**
   - PPAP 문서, 검사 성적서, 부적합 보고서 등을 엑셀이나 수기로 관리하여 데이터 일관성이 없고 오류 발생 가능성이 높음
   - 이력 추적성 확보가 어려워 클레임 발생 시 원인 파악에 시간 소요

2. **흩어진 품질 데이터**
   - IQC, IPQC, FQC, OQC 데이터가 각각 다른 시스템/양식으로 관리되어 종합 분석 불가
   - APQP, PPAP, CAPA 등 핵심 프로세스 간 연계가 미흡

3. **실시간 대응 부재**
   - 부적합 발생 시 물리적 보고서 작성 및 결재로 인한 처리 지연
   - MRB 심의 및 처분 결정 과정의 비효율

4. **경영진 의사결정 지원 부족**
   - 품질 비용(CoQ), KPI, 리스크 현황 등을 실시간으로 파악하기 어려움
   - 경영 검토(Management Review)를 위한 데이터 수집에 많은 시간 소요

5. **고객사 특화 요구사항 대응 어려움**
   - 고객사별로 상이한 PPAP 제출 수준, 검사 성적서 양식 등을 유연하게 대응하기 어려움

### 1.2 해결해야 할 핵심 과제

- IATF 16949:2016 및 AIAG 5대 핵심 도구(APQP, PPAP, FMEA, MSA, SPC) 표준 준수
- 전 프로세스 품질 데이터의 디지털화 및 통합 관리
- 실시간 추적성 확보 (Forward/Backward Traceability)
- 부적합 발생 시 신속한 Closed-Loop 대응 체계 구축
- 경영진을 위한 의사결정 지원 대시보드 제공

---

## 2. Solution (솔루션)

### 2.1 시스템 개요

**QMS (Quality Management System)**는 자동차 부품 제조사를 위한 통합 품질관리 플랫폼이다. IATF 16949:2016 표준을 준수하며, AIAG 5대 핵심 도구를 지원하는 모듈러 구조로 설계되었다.

### 2.2 핵심 가치 제안

1. **전 프로세스 통합**: IQC → IPQC → FQC → OQC까지 전 공정 품질 데이터 통합 관리
2. **실시간 추적성**: 원재료 로트부터 출하 제품까지 완벽한 이력 추적
3. **폐쇄 루프(Close-Loop)**: 검사 → 부적합 → MRB → CAPA → 개선의 연결된 프로세스
4. **인터락(Interlock) 기반**: 필수 활동 미완료 시 다음 단계 진행 차단
5. **경영진 지원**: 품질 비용, KPI, 리스크 현황을 한눈에 파악하는 대시보드

### 2.3 기술 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14+)                   │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │  shadcn  │ Tailwind │ Zustand  │Recharts  │React-PDF │   │
│  │   /ui    │   CSS    │  State   │  Charts  │  Export  │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ API (REST)
┌────────────────────────▼────────────────────────────────────┐
│                   Backend (NestJS 11+)                      │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │  Auth    │  Module  │  Module  │  Module  │ Swagger  │   │
│  │  JWT/RBAC│  검사관리 │  APQP    │  CAPA    │  Docs    │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ TypeORM
┌────────────────────────▼────────────────────────────────────┐
│                  Database (Oracle)                          │
│         ┌──────────────────────────────────────┐            │
│         │   @qms/shared (Types, Enums, DTOs)   │            │
│         └──────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. User Stories (사용자 스토리)

### 3.1 검사관리 (QC Management)

1. **As a** 입고검사원(IQC Inspector), **I want** 원자재 입고 시 검사 기준에 따라 합격/불합격을 판정하고, **so that** 불합격 자재가 생산라인에 투입되는 것을 방지할 수 있다.

2. **As a** 입고검사원, **I want** 검사 결과를 입력하면 자동으로 검사성적서(COA)를 생성하고, **so that** 공급업체에게 검사 결과를 증빙할 수 있다.

3. **As a** 입고검사원, **I want** 불합격 자재를 발견하면 즉시 NCR을 생성하고 MRB 심의를 요청하고, **so that** 부적합 자재의 처분을 신속히 결정할 수 있다.

4. **As a** 공정검사원(IPQC Inspector), **I want** 공정별 순회검사 계획에 따라 정기적으로 검사를 수행하고, **so that** 공정 이상을 조기에 발견할 수 있다.

5. **As a** 공정검사원, **I want** 공정에서 이상을 발견하면 즉시 경보를 발생시키고 생산을 중지할 수 있고, **so that** 불량 확산을 방지할 수 있다.

6. **As a** 최종검사원(FQC Inspector), **I want** 생산 완료 제품에 대해 최종 검사를 수행하고, **so that** 출하 전 품질을 최종 확인할 수 있다.

7. **As a** 출하검사원(OQC Inspector), **I want** 출하 전 포장 상태와 제품을 최종 검사하고 합격증(C of C)을 발행하고, **so that** 고객에게 품질 보증을 제공할 수 있다.

8. **As a** 출하검사원, **I want** 고객사별로 상이한 검사 성적서 양식을 선택하여 발행하고, **so that** 고객사 요구사항을 유연하게 대응할 수 있다.

### 3.2 부적합 관리 (Nonconformance)

9. **As a** 품질관리자, **I want** 검사/공정/고객클레임 등에서 발생한 부적합을 NCR로 등록하고, **so that** 모든 부적합 현상을 체계적으로 추적할 수 있다.

10. **As a** MRB 위원, **I want** 부적합 자재에 대해 Rework/Repair/Use-As-Is/Scrap/RTV 중 처분 방법을 결정하고, **so that** 적절한 처분으로 비용과 리스크를 최소화할 수 있다.

11. **As a** MRB 위원, **I want** MRB 심의 결과를 시스템에 기록하고 승인자를 지정하고, **so that** 처분 결정의 책임 소재를 명확히 할 수 있다.

12. **As a** 생산관리자, **I want** MRB에서 결정된 재작업(Rework) 지시서를 받아 실행하고, **so that** 부적합 제품을 적합 상태로 개선할 수 있다.

13. **As a** 품질관리자, **I want** 부적합품을 물리적으로 격리하고 격리 상태를 시스템에 표시하고, **so that** 부적합품의 오출하/오투입을 방지할 수 있다.

14. **As a** 품질관리자, **I want** NCR 발생 현황을 유형별/기간별/공정별로 통계 분석하고, **so that** 품질 개선 우선순위를 결정할 수 있다.

### 3.3 검사성적서 관리

15. **As a** 품질관리자, **I want** IQC/IPQC/FQC/OQC 검사 결과를 기반으로 검사성적서를 자동 생성하고, **so that** 검사 결과를 공식 문서로 증빙할 수 있다.

16. **As a** 품질관리자, **I want** 고객사별/자사별로 검사성적서 양식을 미리 등록하고 관리하고, **so that** 다양한 양식 요구사항을 유연하게 대응할 수 있다.

17. **As a** 품질관리자, **I want** 발행된 성적서의 이력(발행일, 발행자, 재발행 여부)을 추적하고, **so that** 문서 관리 규정을 준수할 수 있다.

18. **As a** 출하담당자, **I want** 출하 시 해당 제품의 검사성적서를 고객사에 자동 제출하거나 출력할 수 있고, **so that** 출하 업무를 신속히 처리할 수 있다.

### 3.4 제품개발품질관리 (Design Quality) ⭐ 핵심

**APQP (제품 품질 선행 계획)**

19. **As a** APQP 책임자, **I want** 신규 제품 개발 프로젝트를 등록하고 5단계(기획→설계→공정개발→유효성확인→양산)로 관리하고, **so that** 체계적인 제품 품질 계획을 수립할 수 있다.

20. **As a** APQP 책임자, **I want** 각 Gate 진입 시 필수 산출물 제출 여부를 체크하고, 미완료 시 다음 단계 진행을 차단하고, **so that** 필수 활동의 누락을 방지할 수 있다.

21. **As a** APQP 책임자, **I want** 고객이 지정한 특수특성(SC/CC)을 등록하고 이를 FMEA, Control Plan, 작업표준서에 자동 연동하고, **so that** 중요한 품질 특성을 일관되게 관리할 수 있다.

22. **As a** APQP 책임자, **I want** 타겟(목표) 품질 수준과 실제 달성 품질을 비교하고, 미달 시 개선 조치를 요구하고, **so that** 개발 목표 달성을 보장할 수 있다.

**PPAP (생산 부품 승인 프로세스)**

23. **As a** PPAP 담당자, **I want** 고객사별로 PPAP 제출 수준(Level 1~5)을 설정하고 필요 서류 리스트를 자동 생성하고, **so that** 고객사 요구사항에 맞는 PPAP 패키지를 준비할 수 있다.

24. **As a** PPAP 담당자, **I want** PSW(Part Submission Warrant)를 작성하고 제출 이력을 관리하고, **so that** 고객사 승인 상태를 추적할 수 있다.

25. **As a** PPAP 담당자, **I want** 설계 변경이나 공정 이동 시 재승인 필요 여부를 시스템이 자동으로 알려주고, **so that** PPAP 갱신 누락을 방지할 수 있다.

26. **As a** PPAP 담당자, **I want** 고객사 승인/반려 이력을 관리하고 반려 시 재제출 계획을 수립하고, **so that** 승인 완료까지 추적할 수 있다.

**설계 검증 (Design Validation)**

27. **As a** 개발 엔지니어, **I want** 설계 검증 계획(DVP&R)을 수립하고 시험 결과를 기록하고, **so that** 설계 요구사항 충족 여부를 확인할 수 있다.

28. **As a** 개발 엔지니어, **I want** 초기 샘플(Initial Sample) 검사 결과를 등록하고 합격 여부를 판정하고, **so that** 양산 전 설계 적합성을 검증할 수 있다.

29. **As a** 개발 엔지니어, **I want** 설계 변경 시 영향받는 부품/공정을 자동으로 파악하고 관련 문서들의 수정 필요 여부를 체크하고, **so that** 변경 누락을 방지할 수 있다.

**DFMEA/PFMEA (리스크 관리)**

30. **As a** 품질엔지니어, **I want** DFMEA와 PFMEA를 작성하고 리스크를 평가하며, 고위험 항목에 대한 권고조치를 추적하고, **so that** 잠재적 고장을 사전에 예방할 수 있다.

31. **As a** 품질엔지니어, **I want** FMEA 결과가 Control Plan 및 작업표준서와 연동되는 것을 확인하고, **so that** 리스크 관리가 일관되게 적용되도록 할 수 있다.

32. **As a** 품질엔지니어, **I want** 개발 단계에서 발견된 잠재적 불량 모드를 양산 단계로 넘어가지 않도록 차단하고, **so that** 설계 단계에서 품질을 확보할 수 있다.

### 3.5 CAPA (시정/예방 조치)

29. **As a** 품질관리자, **I want** NCR로부터 CAPA를 자동 생성하거나 수동으로 등록하고, **so that** 부적합의 근본 원인을 제거할 수 있다.

30. **As a** CAPA 담당자, **I want** 5-Why 분석과 Fishbone Diagram을 작성하여 근본 원인을 분석하고, **so that** 문제의 진짜 원인을 찾을 수 있다.

31. **As a** CAPA 담당자, **I want** 8D 보고서 형식으로 CAPA를 수행하고, **so that** 표준화된 문제해결 방법론을 적용할 수 있다.

32. **As a** CAPA 담당자, **I want** 시정조치와 예방조치를 구분하여 계획하고 실행하고, **so that** 현재 문제 해결과 미래 재발 방지를 동시에 달성할 수 있다.

33. **As a** 품질관리자, **I want** CAPA 조치 완료 후 효과성 검증 일정을 자동 생성하고, 재발 여부를 확인하고, **so that** 조치의 실효성을 검증할 수 있다.

34. **As a** 품질관리자, **I want** CAPA 완료 시 관련 표준(FMEA, Control Plan) 수정 필요 여부를 체크하고, **so that** 문서가 항상 최신 상태를 유지할 수 있다.

### 3.6 변경 관리 (Change Management)

35. **As a** 엔지니어, **I want** 제품/공정 변경 요청(ECR)을 등록하고 변경 영향 분석을 수행하고, **so that** 변경의 영향 범위를 사전에 파악할 수 있다.

36. **As a** 변경관리자, **I want** 변경이 관련 문서(FMEA, CP, 도면, 작업표준서)에 미치는 영향을 자동으로 파악하고, **so that** 문서 수정 누락을 방지할 수 있다.

37. **As a** 변경관리자, **I want** 고객 승인이 필요한 변경의 경우 고객 승인이 등록되기 전까지 양산 전환을 시스템에서 차단하고, **so that** 미승인 변경의 양산 유출을 방지할 수 있다.

### 3.7 추적성 (Traceability)

38. **As a** 품질관리자, **I want** 원재료 입고 로트부터 생산 공정, 검사, 출하까지의 이력을 하나의 화면에서 조회하고, **so that** 완벽한 추적성을 확보할 수 있다.

39. **As a** 품질관리자, **I want** 고객 클레임 발생 시 해당 제품의 생산 시점 공정 조건과 투입 원재료 로트를 즉시 조회(Backward Trace)하고, **so that** 신속한 원인 파악이 가능하다.

40. **As a** 품질관리자, **I want** 특정 원재료 로트가 투입된 모든 완제품을 조회(Forward Trace)하고, **so that** 리콜이 필요한 경우 대상 제품을 즉시 파악할 수 있다.

### 3.8 계측기 관리

41. **As a** 계측기 관리자, **I want** 계측기 등록 정보와 교정 주기를 관리하고 교정 일정을 자동 알림하고, **so that** 교정 누락을 방지할 수 있다.

42. **As a** 계측기 관리자, **I want** 교정 결과가 기준치를 벗어났을 때(OOT) 해당 계측기를 사용 불가로 차단하고, **so that** 부정확한 측정을 방지할 수 있다.

43. **As a** 계측기 관리자, **I want** OOT 발생 시 해당 계측기로 측정된 로트를 자동으로 격리 대상으로 지정하고, **so that** 부정확한 측정 데이터의 영향을 최소화할 수 있다.

44. **As a** 계측기 관리자, **I want** 외부 교정 연구소의 ISO/IEC 17025 인증 정보와 인정 범위를 관리하고, **so that** 적합한 외부 교정 서비스를 이용할 수 있다.

### 3.9 인적 자원 및 역량 관리

45. **As a** 교육 담당자, **I want** 공정별로 필요한 기술 수준과 작업자의 현재 숙련도를 역량 매트릭스로 관리하고, **so that** 적격한 인력 배치가 가능하다.

46. **As a** 교육 담당자, **I want** 신규 장비 도입이나 공정 변경 시 관련 작업자에게 필요한 교육 항목을 시스템이 자동으로 추출하고, **so that** 필요한 교육이 누락되지 않는다.

47. **As a** 교육 담당자, **I want** 내부 심사원, 특수공정 작업자 등의 자격 유효기간을 관리하고 갱신 교육을 자동 알림하고, **so that** 자격 만료로 인한 업무 중단을 방지할 수 있다.

### 3.10 공급업체 품질 관리 (SQM)

48. **As a** 구매/품질 담당자, **I want** 공급업체의 PPM, 납기 준수율, 감사 결과 등을 종합한 Scorecard를 자동 산출하고, **so that** 공급업체를 객관적으로 평가할 수 있다.

49. **As a** 품질 담당자, **I want** 공급업체에 부적합 발생 시 SCAR(Supplier Corrective Action Request)을 발행하고, 공급업체가 직접 원인분석과 대책을 입력하도록 하고, **so that** 효율적인 협업이 가능하다.

50. **As a** 품질 담당자, **I want** 공급업체의 PPAP 제출 문서를 온라인으로 검토하고 승인/반려할 수 있고, **so that** 신속한 협력사 PPAP 관리가 가능하다.

### 3.11 조직의 맥락 및 리더십

51. **As a** 경영진, **I want** 조직의 내외부 이슈와 이해관계자 요구사항을 등록하고 추적하고, **so that** 조직의 맥락을 체계적으로 관리할 수 있다.

52. **As a** 경영진, **I want** 품질 방침을 게시하고 품질 목표(MBO/KPI)를 설정하고 달성 현황을 모니터링하고, **so that** 품질 경영의 방향성을 명확히 할 수 있다.

53. **As a** 경영진, **I want** 경영 검토(Management Review)를 위한 고객 만족도, 감사 결과, 프로세스 성과 지표, CAPA 현황 등을 자동으로 취합한 보고서를 생성하고, **so that** 데이터 기반 의사결정이 가능하다.

### 3.12 리스크 및 기회 관리

54. **As a** 품질관리자, **I want** 품질 리스크를 등록하고 발생 가능성/영향도를 평가하고 대응 계획을 수립하고, **so that** 잠재적 문제를 사전에 예방할 수 있다.

55. **As a** 품질관리자, **I want** 주요 장비 고장, 공급 중단, 인력 부족 등 위기 상황에 대한 비상 계획을 등록하고 훈련 결과를 기록하고, **so that** 위기 상황에 신속히 대응할 수 있다.

### 3.13 고객 불만/클레임 관리

56. **As a** CS 담당자, **I want** 고객으로부터 접수된 불만/클레임을 등록하고 NCR로 자동 연계하고, **so that** 신속한 대응이 가능하다.

57. **As a** CS 담당자, **I want** 반품(RMA) 처리 현황을 추적하고 처리 이력을 관리하고, **so that** 고객에게 처리 진행 상황을 안내할 수 있다.

### 3.14 문서관리

58. **As a** 문서관리자, **I want** 품질 관련 문서의 등록, 검토, 승인, 배포, 폐기 과정을 관리하고, **so that** 문서의 최신성과 적절한 접근 권한을 보장할 수 있다.

59. **As a** 문서관리자, **I want** 문서 변경 시 관련 문서(FMEA, Control Plan 등)의 수정 필요 여부를 체크하고, **so that** 문서 간 일관성을 유지할 수 있다.

### 3.15 감사관리

60. **As a** 내부심사원, **I want** 내부 감사 계획을 수립하고 감사 체크리스트를 작성하고 감사 결과를 기록하고, **so that** 체계적인 내부 감사가 가능하다.

61. **As a** 품질관리자, **I want** 공급업체에 대한 2자 감사 계획과 결과를 관리하고, **so that** 하위 공급망의 품질을 확보할 수 있다.

---

## 4. Implementation Decisions (구현 결정사항)

### 4.1 모듈 구조

```
qms/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── auth/              # 인증/인가
│   │       ├── common/            # 공통 유틸리티
│   │       ├── modules/
│   │       │   ├── context/       # 조직의 맥락 & 리더십
│   │       │   ├── risk/          # 리스크 및 기회 관리
│   │       │   ├── inspection/    # 검사관리 (IQC/IPQC/FQC/OQC)
│   │       │   ├── nonconformance/# 부적합 관리 (NCR/MRB)
│   │       │   ├── certificate/   # 검사성적서 관리
│   │       │   ├── apqp/          # APQP
│   │       │   ├── ppap/          # PPAP
│   │       │   ├── fmea/          # FMEA (UI Only Phase)
│   │       │   ├── msa/           # MSA (UI Only Phase)
│   │       │   ├── spc/           # SPC (UI Only Phase)
│   │       │   ├── capa/          # CAPA
│   │       │   ├── change/        # 변경 관리
│   │       │   ├── traceability/  # 추적성 관리
│   │       │   ├── equipment/     # 계측기 관리
│   │       │   ├── hr/            # 인적 자원 관리
│   │       │   ├── supplier/      # 공급업체 품질 관리
│   │       │   ├── document/      # 문서관리 (UI Only Phase)
│   │       │   ├── audit/         # 감사관리 (UI Only Phase)
│   │       │   ├── complaint/     # 고객 불만 관리
│   │       │   └── master/        # 기준정보
│   │       └── main.ts
│   └── frontend/
│       └── src/
│           ├── app/
│           │   ├── (dashboard)/   # 대시보드 레이아웃
│           │   ├── inspection/    # 검사관리 화면
│           │   ├── ncr/           # 부적합 관리 화면
│           │   ├── certificate/   # 성적서 관리 화면
│           │   ├── apqp/          # APQP 화면
│           │   ├── ppap/          # PPAP 화면
│           │   ├── capa/          # CAPA 화면
│           │   └── ...
│           └── components/
│               └── ui/            # shadcn/ui 컴포넌트
└── packages/
    └── shared/
        ├── types/                 # 공통 타입 정의
        ├── enums/                 # 공통 열거형
        ├── dto/                   # 공통 DTO
        └── utils/                 # 공통 유틸리티
```

### 4.2 핵심 엔티티 설계

```typescript
// 기준정보
- Company (고객사/공급업체)
- Item (품번)
- Process (공정)
- InspectionStandard (검사 기준)
- User, Role, Permission

// 검사관리
- InspectionLot (검사 로트)
- InspectionResult (검사 결과)
- InspectionCharacteristic (검사 특성)

// 부적합 관리
- NCR (Non-Conformance Report)
- MRBReview (MRB 심의)
- DispositionAction (처분 실행)

// 성적서
- InspectionCertificate (검사성적서)
- CertificateTemplate (성적서 양식)

// APQP
- ApqpProject (APQP 프로젝트)
- ApqpPhase (APQP 단계)
- GateReview (Gate 심의)
- SpecialCharacteristic (특수특성)

// PPAP
- PpapSubmission (PPAP 제출)
- Psw (Part Submission Warrant)

// CAPA
- Capa (시정/예방조치)
- RootCauseAnalysis (근본 원인 분석)
- EffectivenessCheck (효과성 검증)

// 추적성
- LotTrace (로트 추적)
- Genealogy (계보)

// 계측기
- Equipment (계측기)
- Calibration (교정)
- OotRecord (OOT 기록)
```

### 4.3 권한(RBAC) 설계

| 역할 | 주요 권한 |
|------|----------|
| **시스템 관리자** | 모든 기능 접근, 사용자/권한 관리 |
| **경영진** | 대시보드, 경영 검토, 리스크 관리 |
| **품질 관리자** | 모든 품질 모듈 관리, MRB 심의, CAPA 승인 |
| **품질 엔지니어** | APQP, PPAP, FMEA, MSA, SPC 관리 |
| **입고검사원** | IQC 검사, NCR 등록 |
| **공정검사원** | IPQC 검사, 공정 이상 보고 |
| **출하검사원** | FQC/OQC 검사, 성적서 발행 |
| **생산 관리자** | MRB 처분 실행, 재작업 지시 |
| **구매/SCM** | 공급업체 관리, SCAR 발행 |
| **일반 사용자** | 조회 권한 |

### 4.4 API 설계 원칙

- **RESTful API** 설계
- **Swagger/OpenAPI** 문서 자동 생성
- **버전 관리**: `/api/v1/...`
- **응답 형식**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "timestamp": "2026-03-19T08:00:00Z"
}
```

### 4.5 데이터베이스 설계 원칙

- **Oracle Database** 사용 (HANES 프로젝트와 동일)
- **TypeORM**을 통한 ORM 매핑
- **Audit Trail**: 모든 생성/수정 이력 자동 기록 (createdAt, updatedAt, createdBy, updatedBy)
- **Soft Delete**: deletedAt 필드를 통한 논리적 삭제
- **인덱싱**: 자주 조회되는 필드에 인덱스 적용

### 4.6 인터락(Interlock) 설계

| 인터락 조건 | 동작 |
|------------|------|
| APQP Gate 미승인 | 다음 단계 진행 불가 |
| 고객 승인 필요 변경 미승인 | 양산 전환 불가 |
| 계측기 교정 기한 초과 | 해당 계측기 선택 불가 |
| 교정 실패(OOT) | 해당 계측기 사용 불가, 관련 로트 자동 Hold |
| CAPA 미완료 | 관련 NCR 최종 종결 불가 |
| 필수 교육 미이수 | 해당 공정 작업 배정 불가 |

### 4.7 보안 요구사항

- **인증**: JWT 기반 인증
- **인가**: Role-Based Access Control (RBAC)
- **데이터 암호화**: 민감 정보 암호화 저장
- **Audit Trail**: 모든 데이터 변경 이력 기록
- **전자서명**: 중요 결재에 전자서명 적용 (21 CFR Part 11 준비)

---

## 5. Testing Decisions (테스트 결정사항)

### 5.1 테스트 전략

| 테스트 유형 | 도구 | 범위 |
|------------|------|------|
| **단위 테스트** | Jest | Service, Utility 함수 |
| **통합 테스트** | Jest + Supertest | API Endpoint |
| **E2E 테스트** | Playwright | 핵심 사용자 시나리오 |

### 5.2 테스트 대상 모듈 (우선순위)

**높은 우선순위 (MVP 기능)**:
1. 검사관리 (Inspection) - 합격/불합격 판정 로직
2. 부적합 관리 (NCR/MRB) - 처분 결정 워크플로우
3. CAPA - 효과성 검증 로직
4. 계측기 관리 - OOT 처리 및 격리 로직
5. 추적성 - Forward/Backward Trace 쿼리

**중간 우선순위**:
6. APQP - Gate 인터락 로직
7. PPAP - 승인 상태 추적
8. 인증/인가 - RBAC

### 5.3 테스트 작성 기준

- **외부 동작 테스트**: 내부 구현이 아닌 공개 인터페이스의 동작 검증
- **경계값 테스트**: 임계값(Threshold) 기반 로직의 경계값 검증
- **워크플로우 테스트**: 다단계 프로세스의 상태 전이 검증
- **동시성 테스트**: 다중 사용자 환경에서의 데이터 일관성 검증

### 5.4 테스트 커버리지 목표

- **MVP 모듈**: 80% 이상
- **UI Only 모듈**: 60% 이상
- **공통/유틸리티**: 90% 이상

---

## 6. Out of Scope (범위 외)

### 6.1 Phase 1에서 제외되는 기능

1. **MES 연동**: 생산실적, 설비 데이터 실시간 연동 (향후 ERP/MES 연계 프로젝트로 진행)
2. **AI/ML 예측 분석**: 불량 예측, 이상 징후 감지 (Phase 2 고려)
3. **모바일 앱**: 네이티브 모바일 앱 (웹 반응형으로 대체, 필요시 향후 개발)
4. **다중 언어 지원**: 한국어 기반 (향후 영어/중국어 등 다국어 지원 고려)
5. **고객 포탈**: 외부 고객사 직접 접근 포탈 (SCAR 포탈은 제한적 제공)
6. **전자서명 고도화**: 21 CFR Part 11 완전 준수 (기본 전자서명은 제공)

### 6.2 제외되는 통합

1. **ERP 연동**: SAP, Oracle ERP 등과의 실시간 양방향 연동
2. **PLM 연동**: 제품 설계 데이터 연동
3. **IoT/스마트팩토리**: 설비 센서 데이터 직접 수집

---

## 7. Further Notes (추가 참고사항)

### 7.1 성능 요구사항

- **응답 시간**: 평균 API 응답 시간 < 500ms (95th percentile < 1s)
- **동시 사용자**: 100명 동시 접속 처리
- **데이터 용량**: 5년간의 품질 데이터 저장 (아카이빙 정책 필요)
- **가용성**: 99.5% (계획된 유지보수 시간 제외)

### 7.2 확장성 고려사항

- **모듈러 아키텍처**: 독립적인 모듈로 구성되어 향후 기능 추가/제거 용이
- **MSA 전환 고려**: 향후 MSA로의 전환을 고려한 모듈 경계 설계
- **API 버전 관리**: 하위 호환성 유지를 위한 API 버전 관리

### 7.3 배포 및 운영

- **환경**: Development → Staging → Production
- **CI/CD**: GitHub Actions 기반 자동 빌드/배포
- **모니터링**: 로그 수집 및 알림 체계 구축
- **백업**: 일일 DB 백업 및 보관

### 7.4 교육 및 전환

- **사용자 매뉴얼**: 각 모듈별 사용 가이드 제공
- **관리자 교육**: 시스템 관리자 대상 기술 교육
- **데이터 마이그레이션**: 기존 엑셀 데이터 Import 도구 제공 (선택사항)

### 7.5 향후 로드맵 (Post-MVP)

| Phase | 기능 | 예상 시기 |
|-------|------|----------|
| Phase 2 | FMEA/MSA/SPC 고도화 (계산 로직) | MVP 완료 후 2개월 |
| Phase 3 | AI 기반 예측 분석 | Phase 2 완료 후 3개월 |
| Phase 4 | 모바일 앱, 고객 포탈 | Phase 3 완료 후 3개월 |
| Phase 5 | ERP/MES 연동 | 별도 프로젝트로 진행 |

---

## 8. Appendix (부록)

### 8.1 용어 정의

| 용어 | 정의 |
|------|------|
| **AIAG** | Automotive Industry Action Group (미국 자동차 산업 협회) |
| **APQP** | Advanced Product Quality Planning (제품 품질 선행 계획) |
| **CAPA** | Corrective and Preventive Action (시정 및 예방 조치) |
| **CoA** | Certificate of Analysis (분석 성적서) |
| **CoC** | Certificate of Conformance (적합성 성적서) |
| **Cpk** | Process Capability Index (공정능력지수) |
| **DFMEA** | Design Failure Mode and Effects Analysis (설계 FMEA) |
| **FMEA** | Failure Mode and Effects Analysis (고장 모드 영향 분석) |
| **FQC** | Final Quality Control (최종 검사) |
| **IQC** | Incoming Quality Control (수입 검사/입고 검사) |
| **IATF** | International Automotive Task Force (국제 자동차 특별 위원회) |
| **IPQC** | In-Process Quality Control (공정 검사/순회 검사) |
| **MSA** | Measurement System Analysis (측정 시스템 분석) |
| **MRB** | Material Review Board (자재 심의 위원회) |
| **NCR** | Non-Conformance Report (부적합 보고서) |
| **OOT** | Out of Tolerance (공차 범위 초과) |
| **OQC** | Outgoing Quality Control (출하 검사) |
| **PFMEA** | Process Failure Mode and Effects Analysis (공정 FMEA) |
| **PPAP** | Production Part Approval Process (생산 부품 승인 절차) |
| **PSW** | Part Submission Warrant (부품 제출 보증서) |
| **SC** | Significant Characteristic (중요 특성) |
| **CC** | Critical Characteristic (핵심 특성) |
| **SCAR** | Supplier Corrective Action Request (공급업체 시정 조치 요구) |
| **SPC** | Statistical Process Control (통계적 공정 관리) |
| **SQM** | Supplier Quality Management (공급업체 품질 관리) |

### 8.2 참조 표준

- IATF 16949:2016 Automotive Quality Management System
- ISO 9001:2015 Quality Management Systems
- AIAG Core Tools: APQP, PPAP, FMEA, MSA, SPC (4th Edition)
- AIAG-VDA FMEA Handbook (1st Edition)

---

**문서 승인**

| 역할 | 이름 | 서명 | 날짜 |
|------|------|------|------|
| 작성자 | | | 2026-03-19 |
| 검토자 | | | |
| 승인자 | | | |

---

*본 문서는 QMS 품질경영시스템 개발의 기준이 되는 요구사항 명세서입니다. 개발 진행 중 변경이 필요한 경우 변경 관리 프로세스를 통해 업데이트되어야 합니다.*
