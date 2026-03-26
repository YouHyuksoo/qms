'use client';

import { cn } from '@/lib/utils';
import { InspectionJudgment, ResultJudgment } from '@/types';

interface JudgmentBadgeProps {
  judgment?: InspectionJudgment | ResultJudgment | null;
  className?: string;
}

/**
 * 판정 뱃지 컴포넌트
 * 
 * PASS/FAIL/HOLD 상태를 시각적으로 표시합니다.
 */
export function JudgmentBadge({ judgment, className }: JudgmentBadgeProps) {
  if (!judgment) {
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
          className
        )}
      >
        미판정
      </span>
    );
  }

  const styles: Record<string, string> = {
    [InspectionJudgment.PASS]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    [InspectionJudgment.FAIL]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    [InspectionJudgment.HOLD]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  };

  const labels: Record<string, string> = {
    [InspectionJudgment.PASS]: '합격',
    [InspectionJudgment.FAIL]: '불합격',
    [InspectionJudgment.HOLD]: '보류',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[judgment],
        className
      )}
    >
      {labels[judgment]}
    </span>
  );
}
