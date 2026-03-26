'use client';

import { useState, useEffect } from 'react';
import { ClipboardCheck, Play, CheckCircle, X, Filter } from 'lucide-react';
import { NcrStatus, DispositionType, ReviewStatus } from '@/types';
import { useNonconformanceStore } from '@/stores';
import { StatusBadge } from '@/components/inspection';
import { Button } from '@/components/ui/button';

const dispositionLabels: Record<DispositionType, string> = {
  [DispositionType.REWORK]: '재작업 (Rework)',
  [DispositionType.REPAIR]: '수리 (Repair)',
  [DispositionType.USE_AS_IS]: '원용 (Use As Is)',
  [DispositionType.SCRAP]: '폐기 (Scrap)',
  [DispositionType.RTV]: '반품 (RTV)',
};

export default function DispositionPage() {
  const {
    ncrs,
    selectedNcr,
    isLoading,
    fetchNcrs,
    fetchNcr,
    setSelectedNcr,
    executeDisposition,
  } = useNonconformanceStore();

  const [showExecute, setShowExecute] = useState(false);
  const [selectedReview, setSelectedReview] = useState<{
    reviewId: string;
    disposition?: DispositionType;
  } | null>(null);
  const [filters, setFilters] = useState({
    status: NcrStatus.DISPOSITION_DECIDED,
  });
  const [formData, setFormData] = useState({
    executionResult: '',
    executedBy: '',
    executionDate: new Date().toISOString().split('T')[0],
  });

  // Fetch data on mount
  useEffect(() => {
    fetchNcrs({ status: filters.status });
  }, [filters.status]);

  // Get pending dispositions
  const getPendingReviews = () => {
    const pending: Array<{
      ncr: (typeof ncrs)[0];
      review: NonNullable<(typeof ncrs)[0]['mrbReviews']>[number];
    }> = [];

    ncrs.forEach((ncr) => {
      if (ncr.mrbReviews) {
        ncr.mrbReviews.forEach((review) => {
          if (review.status === ReviewStatus.APPROVED && !review.executionDate) {
            pending.push({ ncr, review });
          }
        });
      }
    });

    return pending;
  };

  // Execute disposition
  const handleExecute = async () => {
    if (!selectedReview) return;

    const success = await executeDisposition(selectedReview.reviewId, {
      executionResult: formData.executionResult,
      executedBy: formData.executedBy,
      executionDate: formData.executionDate,
    });

    if (success) {
      setShowExecute(false);
      setSelectedReview(null);
      fetchNcrs({ status: filters.status });
      if (selectedNcr) {
        fetchNcr(selectedNcr.ncrNo);
      }
    }
  };

  const pendingReviews = getPendingReviews();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6" />
            처분관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Disposition Management - 부적합 처분 실행 및 관리
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-gray-500">대기 중인 처분</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">
            {pendingReviews.length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-gray-500">진행 중</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {ncrs.filter((n) => n.status === NcrStatus.IN_PROGRESS).length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-gray-500">종결</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {ncrs.filter((n) => n.status === NcrStatus.COMPLETED).length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-sm text-gray-500">전체</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {ncrs.length}
          </p>
        </div>
      </div>

      {/* Pending Dispositions */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-medium text-gray-900 dark:text-white">
            실행 대기 중인 처분
          </h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">불러오는 중...</div>
          ) : pendingReviews.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-300" />
              <p>실행 대기 중인 처분이 없습니다.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    NCR 번호
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    품목
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    처분 유형
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    심의자
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    승인일
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {pendingReviews.map(({ ncr, review }) => (
                  <tr
                    key={review.reviewId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {ncr.ncrNo}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {ncr.itemCode || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {review.disposition ? dispositionLabels[review.disposition] : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {review.reviewedBy}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {review.approvedDate
                        ? new Date(review.approvedDate).toLocaleDateString('ko-KR')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedNcr(ncr);
                          setSelectedReview({
                            reviewId: review.reviewId,
                            disposition: review.disposition,
                          });
                          setShowExecute(true);
                        }}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        실행
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Executed Dispositions */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-4 py-3">
          <h3 className="font-medium text-gray-900 dark:text-white">
            처분 실행 이력
          </h3>
        </div>
        <div className="overflow-x-auto">
          {(() => {
            const executed: Array<{
              ncr: (typeof ncrs)[0];
              review: NonNullable<(typeof ncrs)[0]['mrbReviews']>[number];
            }> = [];

            ncrs.forEach((ncr) => {
              if (ncr.mrbReviews) {
                ncr.mrbReviews.forEach((review) => {
                  if (review.executionDate) {
                    executed.push({ ncr, review });
                  }
                });
              }
            });

            if (executed.length === 0) {
              return (
                <div className="p-8 text-center text-gray-500">
                  처분 실행 이력이 없습니다.
                </div>
              );
            }

            return (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                      NCR 번호
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                      처분 유형
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                      실행 결과
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                      실행자
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                      실행일
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-surface">
                  {executed.map(({ ncr, review }) => (
                    <tr
                      key={review.reviewId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {ncr.ncrNo}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {review.disposition ? dispositionLabels[review.disposition] : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs truncate">
                        {review.executionResult || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {review.executedBy || '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {review.executionDate
                          ? new Date(review.executionDate).toLocaleDateString('ko-KR')
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={ncr.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>
      </div>

      {/* Execute Modal */}
      {showExecute && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                처분 실행
              </h2>
              <button
                onClick={() => setShowExecute(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedReview.disposition && (
              <div className="mb-4 rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  처분 유형: {dispositionLabels[selectedReview.disposition]}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  실행 결과 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.executionResult}
                  onChange={(e) =>
                    setFormData({ ...formData, executionResult: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  rows={4}
                  placeholder="처분 실행 결과를 상세히 기록하세요"
                />
              </div>
              <div>
                <label className="text-sm font-medium">실행자</label>
                <input
                  type="text"
                  value={formData.executedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, executedBy: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="실행자 이름"
                />
              </div>
              <div>
                <label className="text-sm font-medium">실행일</label>
                <input
                  type="date"
                  value={formData.executionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, executionDate: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                onClick={handleExecute}
                disabled={!formData.executionResult}
                className="flex-1"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                실행 완료
              </Button>
              <Button
                onClick={() => setShowExecute(false)}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
