'use client';

import { cn } from '@/lib/utils';
import { InspectionStatus, NcrStatus, ReviewStatus } from '@/types';

interface StatusBadgeProps {
  status: InspectionStatus | NcrStatus | ReviewStatus;
  className?: string;
}

/**
 * 상태 뱃지 컴포넌트
 * 
 * 다양한 상태를 시각적으로 표시합니다.
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  // InspectionStatus styles
  const inspectionStyles: Record<InspectionStatus, string> = {
    [InspectionStatus.PENDING]: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    [InspectionStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    [InspectionStatus.COMPLETED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    [InspectionStatus.CANCELLED]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  // NcrStatus styles
  const ncrStyles: Record<NcrStatus, string> = {
    [NcrStatus.DRAFT]: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    [NcrStatus.UNDER_REVIEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    [NcrStatus.DISPOSITION_DECIDED]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    [NcrStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    [NcrStatus.COMPLETED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    [NcrStatus.CANCELLED]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  // ReviewStatus styles
  const reviewStyles: Record<ReviewStatus, string> = {
    [ReviewStatus.PENDING]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    [ReviewStatus.APPROVED]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    [ReviewStatus.REJECTED]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  // InspectionStatus labels
  const inspectionLabels: Record<InspectionStatus, string> = {
    [InspectionStatus.PENDING]: '대기',
    [InspectionStatus.IN_PROGRESS]: '진행중',
    [InspectionStatus.COMPLETED]: '완료',
    [InspectionStatus.CANCELLED]: '취소',
  };

  // NcrStatus labels
  const ncrLabels: Record<NcrStatus, string> = {
    [NcrStatus.DRAFT]: '작성중',
    [NcrStatus.UNDER_REVIEW]: '심의중',
    [NcrStatus.DISPOSITION_DECIDED]: '처분결정',
    [NcrStatus.IN_PROGRESS]: '조치중',
    [NcrStatus.COMPLETED]: '종결',
    [NcrStatus.CANCELLED]: '취소',
  };

  // ReviewStatus labels
  const reviewLabels: Record<ReviewStatus, string> = {
    [ReviewStatus.PENDING]: '대기',
    [ReviewStatus.APPROVED]: '승인',
    [ReviewStatus.REJECTED]: '반려',
  };

  // Determine which style and label to use
  let style = inspectionStyles[status as InspectionStatus];
  let label = inspectionLabels[status as InspectionStatus];

  if (Object.values(NcrStatus).includes(status as NcrStatus)) {
    style = ncrStyles[status as NcrStatus];
    label = ncrLabels[status as NcrStatus];
  } else if (Object.values(ReviewStatus).includes(status as ReviewStatus)) {
    style = reviewStyles[status as ReviewStatus];
    label = reviewLabels[status as ReviewStatus];
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
