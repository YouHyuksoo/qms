'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Filter, X, Eye, CheckCircle, XCircle, ClipboardCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  InitialSample,
  SampleInspectionItem,
  SampleStatus,
  InspectionResult,
  CreateInitialSampleRequest,
  AddInspectionItemRequest,
  InitialSampleQueryParams,
} from '@/types';
import { useInitialSampleStore } from '@/stores';
import { Button } from '@/components/ui/button';

const statusColors: Record<SampleStatus, string> = {
  [SampleStatus.REGISTERED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  [SampleStatus.INSPECTING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [SampleStatus.COMPLETED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [SampleStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [SampleStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const inspectionResultColors: Record<InspectionResult, string> = {
  [InspectionResult.PASS]: 'bg-green-100 text-green-800',
  [InspectionResult.FAIL]: 'bg-red-100 text-red-800',
  [InspectionResult.PENDING]: 'bg-yellow-100 text-yellow-800',
  [InspectionResult.CONDITIONAL]: 'bg-orange-100 text-orange-800',
};

export default function InitialSamplePage() {
  const { t } = useTranslation();

  const {
    samples,
    total,
    page,
    limit,
    isLoading,
    selectedSample,
    fetchSamples,
    fetchSample,
    createSample,
    addInspectionItem,
    approveSample,
    rejectSample,
    setPage,
    setSelectedSample,
  } = useInitialSampleStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showJudgmentForm, setShowJudgmentForm] = useState(false);
  const [filters, setFilters] = useState<InitialSampleQueryParams>({
    sampleId: '',
    projectNo: '',
    sampleNo: '',
    itemCode: '',
    inspectionResult: undefined,
    status: undefined,
    inspector: '',
  });
  const [rejectReason, setRejectReason] = useState('');

  const [formData, setFormData] = useState<CreateInitialSampleRequest>({
    sampleId: '',
    projectNo: '',
    sampleNo: '',
    itemCode: '',
    itemName: '',
    sampleQty: 5,
    submissionDate: new Date().toISOString().split('T')[0],
    inspector: '',
    remarks: '',
  });

  const [itemData, setItemData] = useState<AddInspectionItemRequest>({
    itemId: '',
    inspectionItem: '',
    inspectionItemCode: '',
    specMin: undefined,
    specMax: undefined,
    specNominal: undefined,
    unit: 'mm',
    measuredValue: undefined,
    judgment: InspectionResult.PENDING,
    isCritical: false,
    inspectionMethod: '',
    inspectionEquipment: '',
    remarks: '',
  });

  useEffect(() => {
    fetchSamples({ page, limit });
  }, [page, limit]);

  const handleFilterChange = (key: keyof InitialSampleQueryParams, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchSamples({ ...filters, page: 1, limit });
  };

  const resetFilters = () => {
    setFilters({
      sampleId: '',
      projectNo: '',
      sampleNo: '',
      itemCode: '',
      inspectionResult: undefined,
      status: undefined,
      inspector: '',
    });
    fetchSamples({ page: 1, limit });
  };

  const handleCreateSample = async () => {
    const sampleId = formData.sampleId || `IS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const success = await createSample({
      ...formData,
      sampleId,
    });
    if (success) {
      setShowForm(false);
      fetchSamples({ page, limit });
    }
  };

  const handleViewDetail = async (sample: InitialSample) => {
    await fetchSample(sample.sampleId);
    setShowDetail(true);
  };

  const handleAddItem = async () => {
    if (!selectedSample) return;
    const itemId = itemData.itemId || `ITEM-${Date.now()}`;
    const success = await addInspectionItem(selectedSample.sampleId, {
      ...itemData,
      itemId,
    });
    if (success) {
      setShowItemForm(false);
      fetchSample(selectedSample.sampleId);
    }
  };

  const handleApprove = async (sampleId: string) => {
    const success = await approveSample(sampleId, 'current-user');
    if (success) {
      fetchSamples({ page, limit });
      if (showDetail) {
        fetchSample(sampleId);
      }
    }
  };

  const handleReject = async (sampleId: string) => {
    if (!rejectReason) {
      setShowJudgmentForm(true);
      return;
    }
    const success = await rejectSample(sampleId, rejectReason);
    if (success) {
      setShowJudgmentForm(false);
      setRejectReason('');
      fetchSamples({ page, limit });
      if (showDetail) {
        fetchSample(sampleId);
      }
    }
  };

  const autoJudge = (value: number, min?: number, max?: number): InspectionResult => {
    if (min === undefined || max === undefined) return InspectionResult.PENDING;
    return value >= min && value <= max ? InspectionResult.PASS : InspectionResult.FAIL;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="h-6 w-6" />
            초기 샘플 관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Initial Sample Management - 초기 샘플 등록 및 검사
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          새 샘플
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
            <label className="text-xs text-gray-600 dark:text-gray-400">샘플 ID</label>
            <input
              type="text"
              value={filters.sampleId}
              onChange={(e) => handleFilterChange('sampleId', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="IS-..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">프로젝트 번호</label>
            <input
              type="text"
              value={filters.projectNo}
              onChange={(e) => handleFilterChange('projectNo', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="APQP-..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">품목</label>
            <input
              type="text"
              value={filters.itemCode}
              onChange={(e) => handleFilterChange('itemCode', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="ITEM-..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">상태</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as SampleStatus)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(SampleStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">검사 결과</label>
            <select
              value={filters.inspectionResult || ''}
              onChange={(e) => handleFilterChange('inspectionResult', e.target.value as InspectionResult)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(InspectionResult).map((result) => (
                <option key={result} value={result}>{result}</option>
              ))}
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

      {/* Sample Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">샘플 ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">프로젝트</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">샘플 번호</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">품목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">수량</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">제출일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">검사자</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">결과</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">상태</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      불러오는 중...
                    </div>
                  </td>
                </tr>
              ) : samples.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                samples.map((sample) => (
                  <tr
                    key={sample.sampleId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => handleViewDetail(sample)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {sample.sampleId}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {sample.projectNo}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {sample.sampleNo}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {sample.itemName || sample.itemCode}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {sample.sampleQty}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {new Date(sample.submissionDate).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {sample.inspector || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${inspectionResultColors[sample.inspectionResult]}`}>
                        {sample.inspectionResult}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[sample.status]}`}>
                        {sample.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(sample);
                          }}
                          title="상세"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {sample.status === SampleStatus.COMPLETED && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(sample.sampleId);
                              }}
                              title="승인"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(sample.sampleId);
                              }}
                              title="반려"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
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

      {/* Create Sample Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                새 초기 샘플 등록
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">샘플 ID</label>
                <input
                  type="text"
                  value={formData.sampleId}
                  onChange={(e) => setFormData({ ...formData, sampleId: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="자동 생성"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">프로젝트 번호 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.projectNo}
                  onChange={(e) => setFormData({ ...formData, projectNo: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="APQP-..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">샘플 번호 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.sampleNo}
                  onChange={(e) => setFormData({ ...formData, sampleNo: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="SAMPLE-..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">품목 코드 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.itemCode}
                  onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="ITEM-..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">품목명</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="품목명"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">샘플 수량</label>
                <input
                  type="number"
                  value={formData.sampleQty}
                  onChange={(e) => setFormData({ ...formData, sampleQty: parseInt(e.target.value) })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  min="1"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">제출일 <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.submissionDate}
                  onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">검사자</label>
                <input
                  type="text"
                  value={formData.inspector}
                  onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="검사자명"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreateSample}>등록</Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  초기 샘플 상세
                </h2>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedSample.status]}`}>
                  {selectedSample.status}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${inspectionResultColors[selectedSample.inspectionResult]}`}>
                  {selectedSample.inspectionResult}
                </span>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sample Info */}
            <div className="mb-6 grid grid-cols-4 gap-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
              <div>
                <span className="text-xs text-gray-500">샘플 ID</span>
                <p className="font-medium">{selectedSample.sampleId}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">프로젝트</span>
                <p className="font-medium">{selectedSample.projectNo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">샘플 번호</span>
                <p className="font-medium">{selectedSample.sampleNo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">품목</span>
                <p className="font-medium">{selectedSample.itemName || selectedSample.itemCode}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">수량</span>
                <p className="font-medium">{selectedSample.sampleQty}개</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">제출일</span>
                <p className="font-medium">{new Date(selectedSample.submissionDate).toLocaleDateString('ko-KR')}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">검사자</span>
                <p className="font-medium">{selectedSample.inspector || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">승인자</span>
                <p className="font-medium">{selectedSample.approvedBy || '-'}</p>
              </div>
            </div>

            {/* Inspection Items */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">검사 항목</h3>
                {(selectedSample.status === SampleStatus.REGISTERED || selectedSample.status === SampleStatus.INSPECTING) && (
                  <Button size="sm" onClick={() => setShowItemForm(true)}>
                    <ClipboardCheck className="h-4 w-4 mr-1" />
                    항목 추가
                  </Button>
                )}
              </div>
              {selectedSample.inspectionItems && selectedSample.inspectionItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-3 py-2 text-left">항목</th>
                        <th className="px-3 py-2 text-right">규격(최소)</th>
                        <th className="px-3 py-2 text-right">규격(최대)</th>
                        <th className="px-3 py-2 text-right">측정값</th>
                        <th className="px-3 py-2 text-center">단위</th>
                        <th className="px-3 py-2 text-center">중요</th>
                        <th className="px-3 py-2 text-center">판정</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedSample.inspectionItems.map((item) => (
                        <tr key={item.itemId}>
                          <td className="px-3 py-2">{item.inspectionItem}</td>
                          <td className="px-3 py-2 text-right">{item.specMin ?? '-'}</td>
                          <td className="px-3 py-2 text-right">{item.specMax ?? '-'}</td>
                          <td className="px-3 py-2 text-right">{item.measuredValue ?? '-'}</td>
                          <td className="px-3 py-2 text-center">{item.unit || '-'}</td>
                          <td className="px-3 py-2 text-center">
                            {item.isCritical && <span className="text-red-500">●</span>}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${inspectionResultColors[item.judgment]}`}>
                              {item.judgment}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500">등록된 검사 항목이 없습니다.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {selectedSample.status === SampleStatus.COMPLETED && (
                <>
                  <Button onClick={() => handleApprove(selectedSample.sampleId)} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    승인
                  </Button>
                  <Button onClick={() => handleReject(selectedSample.sampleId)} variant="destructive" className="gap-2">
                    <XCircle className="h-4 w-4" />
                    반려
                  </Button>
                </>
              )}
              <Button onClick={() => setShowDetail(false)} variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inspection Item Modal */}
      {showItemForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                검사 항목 추가
              </h2>
              <button onClick={() => setShowItemForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">항목 ID</label>
                <input
                  type="text"
                  value={itemData.itemId}
                  onChange={(e) => setItemData({ ...itemData, itemId: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="자동 생성"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">검사 항목명 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={itemData.inspectionItem}
                  onChange={(e) => setItemData({ ...itemData, inspectionItem: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="예: 외경"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">규격 최소값</label>
                <input
                  type="number"
                  value={itemData.specMin || ''}
                  onChange={(e) => setItemData({ ...itemData, specMin: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  step="0.01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">규격 최대값</label>
                <input
                  type="number"
                  value={itemData.specMax || ''}
                  onChange={(e) => setItemData({ ...itemData, specMax: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  step="0.01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">측정값</label>
                <input
                  type="number"
                  value={itemData.measuredValue || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseFloat(e.target.value) : undefined;
                    const judgment = value !== undefined 
                      ? autoJudge(value, itemData.specMin, itemData.specMax)
                      : InspectionResult.PENDING;
                    setItemData({ ...itemData, measuredValue: value, judgment });
                  }}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  step="0.01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">단위</label>
                <input
                  type="text"
                  value={itemData.unit}
                  onChange={(e) => setItemData({ ...itemData, unit: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="mm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">판정</label>
                <select
                  value={itemData.judgment}
                  onChange={(e) => setItemData({ ...itemData, judgment: e.target.value as InspectionResult })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  {Object.values(InspectionResult).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">중요 항목</label>
                <div className="flex items-center h-9">
                  <input
                    type="checkbox"
                    checked={itemData.isCritical}
                    onChange={(e) => setItemData({ ...itemData, isCritical: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">중요 항목으로 표시</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowItemForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleAddItem}>추가</Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showJudgmentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              반려 사유 입력
            </h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
              rows={4}
              placeholder="반려 사유를 입력하세요..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setShowJudgmentForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={() => handleReject(selectedSample?.sampleId || '')} variant="destructive">
                반려
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
