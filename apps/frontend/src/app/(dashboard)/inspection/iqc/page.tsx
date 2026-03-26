/**
 * @file IQC Page
 * @description IQC (Incoming Quality Control) 수입검사 관리 페이지
 */
'use client';

import { InspectionPageContent } from '@/components/inspection';
import { InspectionType } from '@/types';

export default function IqcPage() {
  return <InspectionPageContent inspectionType={InspectionType.IQC} />;
}
