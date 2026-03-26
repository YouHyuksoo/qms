/**
 * @file OQC Page
 * @description OQC (Outgoing Quality Control) 출하검사 관리 페이지
 */
'use client';

import { InspectionPageContent } from '@/components/inspection';
import { InspectionType } from '@/types';

export default function OqcPage() {
  return <InspectionPageContent inspectionType={InspectionType.OQC} />;
}
