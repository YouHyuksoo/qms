/**
 * @file FQC Page
 * @description FQC (Final Quality Control) 최종검사 관리 페이지
 */
'use client';

import { InspectionPageContent } from '@/components/inspection';
import { InspectionType } from '@/types';

export default function FqcPage() {
  return <InspectionPageContent inspectionType={InspectionType.FQC} />;
}
