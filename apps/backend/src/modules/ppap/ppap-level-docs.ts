/**
 * @file ppap-level-docs.ts
 * @description PPAP 레벨별 기본 문서 정의
 *
 * PPAP 제출 레벨(Level 1~5)에 따라 필요한 기본 문서 목록을 반환합니다.
 * 공통 문서와 레벨별 추가 문서를 합쳐서 반환합니다.
 *
 * 초보자 가이드:
 * - PPAP_LEVEL_DOCS(level) 호출 시 해당 레벨에 필요한 전체 문서 배열을 반환합니다.
 */
import { PpapDocumentType } from './entities/ppap-document.entity';
import { PpapSubmissionLevel } from './entities/ppap-submission.entity';

interface DocDef {
  documentType: string;
  documentName: string;
  isRequired: boolean;
}

/** 모든 레벨 공통 문서 */
const COMMON_DOCS: DocDef[] = [
  { documentType: PpapDocumentType.DESIGN_RECORDS, documentName: '설계 기록', isRequired: true },
  { documentType: PpapDocumentType.FMEA, documentName: 'FMEA', isRequired: true },
  { documentType: PpapDocumentType.CONTROL_PLAN, documentName: '관리 계획서', isRequired: true },
  { documentType: PpapDocumentType.MSA, documentName: '측정시스템 분석', isRequired: true },
  { documentType: PpapDocumentType.DIMENSIONAL_RESULTS, documentName: '치수 결과', isRequired: true },
  { documentType: PpapDocumentType.PSW, documentName: '부품 제출 보증서(PSW)', isRequired: true },
];

/** 레벨별 추가 문서 */
const LEVEL_DOCS: Record<string, DocDef[]> = {
  [PpapSubmissionLevel.LEVEL_1]: [
    { documentType: PpapDocumentType.AAR, documentName: '외관 승인 보고서', isRequired: true },
  ],
  [PpapSubmissionLevel.LEVEL_2]: [
    { documentType: PpapDocumentType.AAR, documentName: '외관 승인 보고서', isRequired: true },
    { documentType: PpapDocumentType.MATERIAL_PERFORMANCE, documentName: '재질 및 성능 시험 결과', isRequired: true },
  ],
  [PpapSubmissionLevel.LEVEL_3]: [
    { documentType: PpapDocumentType.AAR, documentName: '외관 승인 보고서', isRequired: true },
    { documentType: PpapDocumentType.MATERIAL_PERFORMANCE, documentName: '재질 및 성능 시험 결과', isRequired: true },
    { documentType: PpapDocumentType.INITIAL_PROCESS_STUDIES, documentName: '초기 공정능력 연구', isRequired: true },
    { documentType: PpapDocumentType.QUALIFIED_LAB_DOCUMENTATION, documentName: '공인 시험소 문서', isRequired: true },
  ],
  [PpapSubmissionLevel.LEVEL_4]: [
    { documentType: PpapDocumentType.AAR, documentName: '외관 승인 보고서', isRequired: true },
    { documentType: PpapDocumentType.CUSTOMER_SPECIFIC, documentName: '고객 특정 요구사항', isRequired: true },
  ],
  [PpapSubmissionLevel.LEVEL_5]: [
    { documentType: PpapDocumentType.AAR, documentName: '외관 승인 보고서', isRequired: true },
    { documentType: PpapDocumentType.MATERIAL_PERFORMANCE, documentName: '재질 및 성능 시험 결과', isRequired: true },
    { documentType: PpapDocumentType.INITIAL_PROCESS_STUDIES, documentName: '초기 공정능력 연구', isRequired: true },
    { documentType: PpapDocumentType.QUALIFIED_LAB_DOCUMENTATION, documentName: '공인 시험소 문서', isRequired: true },
    { documentType: PpapDocumentType.SAMPLE_PARTS, documentName: '시험품', isRequired: true },
    { documentType: PpapDocumentType.MASTER_SAMPLE, documentName: '마스터 샘플', isRequired: true },
    { documentType: PpapDocumentType.CHECKING_AIDS, documentName: '검사 보조구', isRequired: true },
    { documentType: PpapDocumentType.CUSTOMER_SPECIFIC, documentName: '고객 특정 요구사항', isRequired: true },
  ],
};

/**
 * 레벨에 따른 전체 문서 목록 반환
 */
export function PPAP_LEVEL_DOCS(level: PpapSubmissionLevel): DocDef[] {
  return [...COMMON_DOCS, ...(LEVEL_DOCS[level] || [])];
}
