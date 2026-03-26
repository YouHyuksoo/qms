'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Plus, Filter, X, FileText, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NcrStatus, DefectType, NcrSource, Ncr } from '@/types';
import { useNonconformanceStore } from '@/stores';
import { StatusBadge } from '@/components/inspection';
import { Button } from '@/components/ui/button';

export default function NcrPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">불러오는 중...</div>}>
      <NcrPageContent />
    </Suspense>
  );
}

function NcrPageContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Store
  const {
    ncrs,
    total,
    page,
    limit,
    isLoading,
    selectedNcr,
    fetchNcrs,
    setPage,
    setLimit,
    setSelectedNcr,
    createNcr,
    closeNcr,
  } = useNonconformanceStore();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [filters, setFilters] = useState({
    ncrNo: searchParams.get('ncrNo') || '',
    title: '',
    lotNo: '',
    itemCode: '',
    status: '',
    defectType: '',
    source: '',
    occurrenceDateFrom: '',
    occurrenceDateTo: '',
  });
  const [formData, setFormData] = useState({
    ncrNo: '',
    title: '',
    description: '',
    occurrenceDate: new Date().toISOString().split('T')[0],
    lotNo: '',
    itemCode: '',
    itemName: '',
    defectQty: 0,
    defectType: DefectType.MAJOR,
    source: NcrSource.INTERNAL,
    reportedBy: '',
  });

  // Fetch data on mount
  useEffect(() => {
    fetchNcrs({ ...filters, page, limit } as any);
  }, [page, limit]);

  // Auto-open detail if ncrNo is in URL
  useEffect(() => {
    const ncrNo = searchParams.get('ncrNo');
    if (ncrNo) {
      const ncr = ncrs.find((n) => n.ncrNo === ncrNo);
      if (ncr) {
        setSelectedNcr(ncr);
        setShowDetail(true);
      }
    }
  }, [searchParams, ncrs]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchNcrs({ ...filters, page: 1, limit } as any);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      ncrNo: '',
      title: '',
      lotNo: '',
      itemCode: '',
      status: '',
      defectType: '',
      source: '',
      occurrenceDateFrom: '',
      occurrenceDateTo: '',
    });
    fetchNcrs({ page: 1, limit });
  };

  // Create NCR
  const handleCreateNcr = async () => {
    const ncrNo = formData.ncrNo || `NCR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const success = await createNcr({
      ...formData,
      ncrNo,
      reportedDate: new Date().toISOString().split('T')[0],
    });
    if (success) {
      setShowForm(false);
      fetchNcrs({ page, limit });
    }
  };

  // Close NCR
  const handleCloseNcr = async (ncrNo: string) => {
    const success = await closeNcr(ncrNo, 'current-user');
    if (success) {
      fetchNcrs({ page, limit });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            NCR 관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Non-Conformance Report - 부적합 보고서 관리
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          새 NCR
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            검색 필터
          </span>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">NCR 번호</label>
            <input
              type="text"
              value={filters.ncrNo}
              onChange={(e) => handleFilterChange('ncrNo', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="NCR-..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">제목</label>
            <input
              type="text"
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="제목..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">로트 번호</label>
            <input
              type="text"
              value={filters.lotNo}
              onChange={(e) => handleFilterChange('lotNo', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="LOT-..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">상태</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              <option value={NcrStatus.DRAFT}>작성중</option>
              <option value={NcrStatus.UNDER_REVIEW}>심의중</option>
              <option value={NcrStatus.DISPOSITION_DECIDED}>처분결정</option>
              <option value={NcrStatus.IN_PROGRESS}>조치중</option>
              <option value={NcrStatus.COMPLETED}>종결</option>
              <option value={NcrStatus.CANCELLED}>취소</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">불량 유형</label>
            <select
              value={filters.defectType}
              onChange={(e) => handleFilterChange('defectType', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              <option value={DefectType.CRITICAL}>치명적</option>
              <option value={DefectType.MAJOR}>주요</option>
              <option value={DefectType.MINOR}>경미</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={applyFilters} variant="default" className="flex-1">
              검색
            </Button>
            <Button onClick={resetFilters} variant="outline">
              초기화
            </Button>
          </div>
        </div>
      </div>

      {/* NCR Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">NCR 번호</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">제목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">품목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">발생일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">불량수량</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">상태</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      불러오는 중...
                    </div>
                  </td>
                </tr>
              ) : ncrs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                ncrs.map((ncr) => (
                  <tr
                    key={ncr.ncrNo}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => {
                      setSelectedNcr(ncr);
                      setShowDetail(true);
                    }}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {ncr.ncrNo}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {ncr.title}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {ncr.itemCode}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {ncr.occurrenceDate
                        ? new Date(ncr.occurrenceDate).toLocaleDateString('ko-KR')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {ncr.defectQty.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ncr.status} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNcr(ncr);
                          setShowDetail(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 {total.toLocaleString()}개 중 {(page - 1) * limit + 1} - {Math.min(page * limit, total)}개
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              이전
            </Button>
            <span className="mx-2 text-sm text-gray-600 dark:text-gray-400">
              {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= total}
            >
              다음
            </Button>
          </div>
        </div>
      </div>

      {/* Create NCR Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                새 NCR 생성
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">NCR 번호</label>
                <input
                  type="text"
                  value={formData.ncrNo}
                  onChange={(e) => setFormData({ ...formData, ncrNo: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="자동 생성"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">제목 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="NCR 제목"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  rows={3}
                  placeholder="상세 설명"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">발생일</label>
                <input
                  type="date"
                  value={formData.occurrenceDate}
                  onChange={(e) => setFormData({ ...formData, occurrenceDate: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">연결 로트</label>
                <input
                  type="text"
                  value={formData.lotNo}
                  onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="LOT-..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">품목 코드</label>
                <input
                  type="text"
                  value={formData.itemCode}
                  onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="ITEM-..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">불량 수량</label>
                <input
                  type="number"
                  value={formData.defectQty}
                  onChange={(e) => setFormData({ ...formData, defectQty: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">불량 유형</label>
                <select
                  value={formData.defectType}
                  onChange={(e) => setFormData({ ...formData, defectType: e.target.value as DefectType })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value={DefectType.CRITICAL}>치명적 (Critical)</option>
                  <option value={DefectType.MAJOR}>주요 (Major)</option>
                  <option value={DefectType.MINOR}>경미 (Minor)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">발생 출처</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as NcrSource })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value={NcrSource.INSPECTION}>검사</option>
                  <option value={NcrSource.AUDIT}>감사</option>
                  <option value={NcrSource.COMPLAINT}>클레임</option>
                  <option value={NcrSource.INTERNAL}>내부</option>
                  <option value={NcrSource.SUPPLIER}>공급업체</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreateNcr}>생성</Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedNcr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  NCR 상세 정보
                </h2>
                <StatusBadge status={selectedNcr.status} />
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* NCR Info */}
            <div className="mb-6 grid grid-cols-4 gap-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
              <div>
                <span className="text-xs text-gray-500">NCR 번호</span>
                <p className="font-medium">{selectedNcr.ncrNo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">발생일</span>
                <p className="font-medium">
                  {selectedNcr.occurrenceDate
                    ? new Date(selectedNcr.occurrenceDate).toLocaleDateString('ko-KR')
                    : '-'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">연결 로트</span>
                <p className="font-medium">{selectedNcr.lotNo || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">불량 수량</span>
                <p className="font-medium">{selectedNcr.defectQty.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">품목 코드</span>
                <p className="font-medium">{selectedNcr.itemCode || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">불량 유형</span>
                <p className="font-medium">{selectedNcr.defectType || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">보고자</span>
                <p className="font-medium">{selectedNcr.reportedBy || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">발생 출처</span>
                <p className="font-medium">{selectedNcr.source || '-'}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">설명</h3>
              <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {selectedNcr.description || '설명이 없습니다.'}
              </p>
            </div>

            {/* Root Cause & Actions */}
            {(selectedNcr.rootCause || selectedNcr.correctiveAction || selectedNcr.preventiveAction) && (
              <div className="mb-6 space-y-3">
                {selectedNcr.rootCause && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">근본 원인</h3>
                    <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {selectedNcr.rootCause}
                    </p>
                  </div>
                )}
                {selectedNcr.correctiveAction && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">시정 조치</h3>
                    <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {selectedNcr.correctiveAction}
                    </p>
                  </div>
                )}
                {selectedNcr.preventiveAction && (
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-white">예방 조치</h3>
                    <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {selectedNcr.preventiveAction}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MRB Reviews */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">MRB 심의 내역</h3>
              {selectedNcr.mrbReviews && selectedNcr.mrbReviews.length > 0 ? (
                <div className="space-y-2">
                  {selectedNcr.mrbReviews.map((review) => (
                    <div
                      key={review.reviewId}
                      className="rounded-md border border-border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{review.reviewId}</span>
                        <StatusBadge status={review.status} />
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        처분: {review.disposition || '-'} | 심의자: {review.reviewedBy}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">MRB 심의 내역이 없습니다.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {selectedNcr.status !== NcrStatus.COMPLETED && selectedNcr.status !== NcrStatus.CANCELLED && (
                <Button onClick={() => handleCloseNcr(selectedNcr.ncrNo)} variant="default">
                  NCR 종결
                </Button>
              )}
              <Button onClick={() => router.push(`/nonconformance/mrb?ncrNo=${selectedNcr.ncrNo}`)} variant="outline">
                MRB 심의
              </Button>
              <Button onClick={() => setShowDetail(false)} variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
