'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Gavel, Plus, Filter, X, CheckCircle, XCircle, Play } from 'lucide-react';
import { NcrStatus, DispositionType, ReviewStatus, Ncr } from '@/types';
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

export default function MrbPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">불러오는 중...</div>}>
      <MrbPageContent />
    </Suspense>
  );
}

function MrbPageContent() {
  const searchParams = useSearchParams();
  const {
    ncrs,
    selectedNcr,
    isLoading,
    fetchNcrs,
    fetchNcr,
    setSelectedNcr,
    createMrbReview,
    approveMrbReview,
    rejectMrbReview,
  } = useNonconformanceStore();

  const [showForm, setShowForm] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: NcrStatus.UNDER_REVIEW,
  });
  const [formData, setFormData] = useState({
    reviewId: '',
    ncrNo: '',
    reviewedBy: '',
    reviewDate: new Date().toISOString().split('T')[0],
    disposition: DispositionType.REWORK,
    reason: '',
  });

  // Fetch data on mount
  useEffect(() => {
    fetchNcrs({ status: filters.status });
  }, [filters.status]);

  // Auto-open NCR from URL
  useEffect(() => {
    const ncrNo = searchParams.get('ncrNo');
    if (ncrNo) {
      fetchNcr(ncrNo);
    }
  }, [searchParams]);

  // Create MRB review
  const handleCreateReview = async () => {
    if (!selectedNcr) return;

    const reviewId = formData.reviewId || `MRB-${selectedNcr.ncrNo}-${Date.now()}`;
    const success = await createMrbReview({
      ...formData,
      reviewId,
      ncrNo: selectedNcr.ncrNo,
    });

    if (success) {
      setShowForm(false);
      fetchNcr(selectedNcr.ncrNo);
    }
  };

  // Approve review
  const handleApprove = async (approvedBy: string) => {
    if (!selectedReviewId) return;

    const success = await approveMrbReview(selectedReviewId, approvedBy);
    if (success) {
      setShowApprove(false);
      setSelectedReviewId(null);
      if (selectedNcr) {
        fetchNcr(selectedNcr.ncrNo);
      }
    }
  };

  // Reject review
  const handleReject = async (reviewId: string) => {
    const success = await rejectMrbReview(reviewId, '반려됨');
    if (success && selectedNcr) {
      fetchNcr(selectedNcr.ncrNo);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Gavel className="h-6 w-6" />
            MRB 관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Material Review Board - 부적합 심의 관리
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            NCR 상태 필터
          </span>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as NcrStatus })}
            className="ml-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
          >
            <option value={NcrStatus.UNDER_REVIEW}>심의중</option>
            <option value={NcrStatus.DISPOSITION_DECIDED}>처분결정</option>
            <option value={NcrStatus.IN_PROGRESS}>조치중</option>
            <option value="">전체</option>
          </select>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* NCR List */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-medium text-gray-900 dark:text-white">NCR 목록</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">불러오는 중...</div>
            ) : ncrs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                해당 상태의 NCR이 없습니다.
              </div>
            ) : (
              ncrs.map((ncr) => (
                <div
                  key={ncr.ncrNo}
                  className={`cursor-pointer border-b border-border p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    selectedNcr?.ncrNo === ncr.ncrNo ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                  onClick={() => setSelectedNcr(ncr)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {ncr.ncrNo}
                    </span>
                    <StatusBadge status={ncr.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {ncr.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {ncr.itemCode} | 불량: {ncr.defectQty}개
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MRB Review Details */}
        <div className="rounded-lg border border-border bg-surface">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-medium text-gray-900 dark:text-white">MRB 심의 내역</h3>
          </div>
          <div className="p-4">
            {selectedNcr ? (
              <div className="space-y-4">
                {/* NCR Info */}
                <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedNcr.ncrNo}</span>
                    <StatusBadge status={selectedNcr.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{selectedNcr.title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    품목: {selectedNcr.itemCode || '-'} | 불량: {selectedNcr.defectQty}개
                  </p>
                </div>

                {/* Add Review Button */}
                {(selectedNcr.status === NcrStatus.UNDER_REVIEW ||
                  selectedNcr.status === NcrStatus.DRAFT) && (
                  <Button onClick={() => setShowForm(true)} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    MRB 심의 생성
                  </Button>
                )}

                {/* Reviews List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    심의 목록
                  </h4>
                  {selectedNcr.mrbReviews && selectedNcr.mrbReviews.length > 0 ? (
                    selectedNcr.mrbReviews.map((review) => (
                      <div
                        key={review.reviewId}
                        className="rounded-md border border-border p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{review.reviewId}</span>
                          <StatusBadge status={review.status} />
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          처분: {review.disposition ? dispositionLabels[review.disposition] : '-'}
                        </p>
                        <p className="text-xs text-gray-500">
                          심의자: {review.reviewedBy} |{' '}
                          {new Date(review.reviewDate).toLocaleDateString('ko-KR')}
                        </p>
                        {review.reason && (
                          <p className="mt-1 text-xs text-gray-600">{review.reason}</p>
                        )}

                        {/* Actions */}
                        {review.status === ReviewStatus.PENDING && (
                          <div className="mt-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-green-600"
                              onClick={() => {
                                setSelectedReviewId(review.reviewId);
                                setShowApprove(true);
                              }}
                            >
                              <CheckCircle className="h-3 w-3" />
                              승인
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-red-600"
                              onClick={() => handleReject(review.reviewId)}
                            >
                              <XCircle className="h-3 w-3" />
                              반려
                            </Button>
                          </div>
                        )}

                        {/* Execution Button */}
                        {review.status === ReviewStatus.APPROVED && !review.executionDate && (
                          <div className="mt-2">
                            <Button
                              size="sm"
                              className="gap-1"
                              onClick={() => {
                                // Navigate to disposition page
                              }}
                            >
                              <Play className="h-3 w-3" />
                              처분 실행
                            </Button>
                          </div>
                        )}

                        {/* Execution Result */}
                        {review.executionResult && (
                          <div className="mt-2 rounded-md bg-green-50 p-2 dark:bg-green-900/20">
                            <p className="text-xs text-green-700 dark:text-green-300">
                              실행 완료: {review.executionResult}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">심의 내역이 없습니다.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-500">
                <Gavel className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p>NCR을 선택하여 MRB 심의를 관리하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Review Modal */}
      {showForm && selectedNcr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                MRB 심의 생성
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">NCR 번호</label>
                <input
                  type="text"
                  value={selectedNcr.ncrNo}
                  disabled
                  className="mt-1 w-full rounded-md border border-border bg-gray-100 px-3 py-2 text-sm dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="text-sm font-medium">심의 ID</label>
                <input
                  type="text"
                  value={formData.reviewId}
                  onChange={(e) => setFormData({ ...formData, reviewId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="자동 생성"
                />
              </div>
              <div>
                <label className="text-sm font-medium">심의자 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.reviewedBy}
                  onChange={(e) => setFormData({ ...formData, reviewedBy: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="심의자 이름"
                />
              </div>
              <div>
                <label className="text-sm font-medium">심의일</label>
                <input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">처분 결정</label>
                <select
                  value={formData.disposition}
                  onChange={(e) => setFormData({ ...formData, disposition: e.target.value as DispositionType })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value={DispositionType.REWORK}>재작업 (Rework)</option>
                  <option value={DispositionType.REPAIR}>수리 (Repair)</option>
                  <option value={DispositionType.USE_AS_IS}>원용 (Use As Is)</option>
                  <option value={DispositionType.SCRAP}>폐기 (Scrap)</option>
                  <option value={DispositionType.RTV}>반품 (RTV)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">사유</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  rows={3}
                  placeholder="처분 결정 사유"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreateReview}>생성</Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApprove && selectedReviewId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                MRB 심의 승인
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                해당 심의를 승인하시겠습니까?
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">승인자</label>
                <input
                  type="text"
                  id="approvedBy"
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="승인자 이름"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                onClick={() => {
                  const approvedBy = (document.getElementById('approvedBy') as HTMLInputElement)?.value;
                  if (approvedBy) handleApprove(approvedBy);
                }}
                className="flex-1"
              >
                승인
              </Button>
              <Button onClick={() => setShowApprove(false)} variant="outline" className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
