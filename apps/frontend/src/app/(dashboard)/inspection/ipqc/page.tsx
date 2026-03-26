/**
 * @file IPQC Page
 * @description IPQC (In-Process Quality Control) 공정검사 관리 페이지
 */
'use client';

import { InspectionPageContent } from '@/components/inspection';
import { InspectionType } from '@/types';

export default function IpqcPage() {
  return <InspectionPageContent inspectionType={InspectionType.IPQC} />;
}
