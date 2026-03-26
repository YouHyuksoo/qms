'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, X, Activity, GitBranch, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  FieldFailure,
  TraceabilityStatus,
  FailurePattern,
} from '@/types/field-quality';
import { useFieldAnalysisStore } from '@/stores';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const traceabilityColors = {
  [TraceabilityStatus.TRACED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  [TraceabilityStatus.UNTRACED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [TraceabilityStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock data
const patternData = [
  { name: '균열', count: 12, items: 3 },
  { name: '변형', count: 8, items: 2 },
  { name: '스크래치', count: 15, items: 5 },
  { name: '침착', count: 5, items: 2 },
  { name: '기타', count: 3, items: 1 },
];

const monthlyData = [
  { month: '1월', failures: 8 },
  { month: '2월', failures: 5 },
  { month: '3월', failures: 12 },
  { month: '4월', failures: 7 },
  { month: '5월', failures: 9 },
  { month: '6월', failures: 4 },
];

export default function FieldAnalysisPage() {
  const { t } = useTranslation();
  const {
    failures,
    total,
    page,
    limit,
    isLoading,
    selectedFailure,
    patterns,
    traceabilityResult,
    setPage,
    setLimit,
    setSelectedFailure,
    fetchFailures,
    createFailure,
    traceProduction,
    fetchPatterns,
    updateCountermeasure,
  } = useFieldAnalysisStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [showPatterns, setShowPatterns] = useState(false);
  const [showCountermeasure, setShowCountermeasure] = useState(false);
  const [lotNoInput, setLotNoInput] = useState('');
  const [filters, setFilters] = useState({
    failureNo: '',
    itemCode: '',
    lotNo: '',
    failureMode: '',
    traceabilityStatus: '',
    failureDateFrom: '',
    failureDateTo: '',
  });

  const [formData, setFormData] = useState({
    failureId: '',
    failureNo: '',
    itemCode: '',
    itemName: '',
    lotNo: '',
    serialNo: '',
    failureDate: new Date().toISOString().split('T')[0],
    discoveryDate: '',
    failureMode: '',
    failureCause: '',
    failureDetail: '',
    remarks: '',
  });

  const [countermeasureData, setCountermeasureData] = useState({
    immediateAction: '',
    correctiveAction: '',
    preventiveAction: '',
    actionDeadline: '',
    actionCompletedBy: '',
    verificationResult: '',
  });

  useEffect(() => {
    fetchFailures();
  }, [fetchFailures]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchFailures({ ...filters, page: 1 } as any);
  };

  const resetFilters = () => {
    setFilters({
      failureNo: '',
      itemCode: '',
      lotNo: '',
      failureMode: '',
      traceabilityStatus: '',
      failureDateFrom: '',
      failureDateTo: '',
    });
    fetchFailures({ page: 1 });
  };

  const handleCreateFailure = async () => {
    const success = await createFailure(formData);
    if (success) {
      setShowForm(false);
      fetchFailures();
      setFormData({
        failureId: '',
        failureNo: '',
        itemCode: '',
        itemName: '',
        lotNo: '',
        serialNo: '',
        failureDate: new Date().toISOString().split('T')[0],
        discoveryDate: '',
        failureMode: '',
        failureCause: '',
        failureDetail: '',
        remarks: '',
      });
    }
  };

  const handleTrace = async () => {
    if (!lotNoInput) return;
    await traceProduction(lotNoInput);
    setShowTrace(true);
  };

  const handleViewPatterns = async () => {
    const dateFrom = new Date();
    dateFrom.setMonth(dateFrom.getMonth() - 6);
    await fetchPatterns(
      dateFrom.toISOString().split('T')[0],
      new Date().toISOString().split('T')[0],
    );
    setShowPatterns(true);
  };

  const handleSaveCountermeasure = async () => {
    if (!selectedFailure) return;
    const success = await updateCountermeasure(selectedFailure.failureId, {
      ...countermeasureData,
      actionCompletedDate: new Date().toISOString().split('T')[0],
    });
    if (success) {
      setShowCountermeasure(false);
      fetchFailures();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="h-6 w-6" />
            필드 분석
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            현장 품질 데이터 분석 및 생산 이력 추적
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowTrace(true)} variant="outline" className="gap-2">
            <GitBranch className="h-4 w-4" />
            생산 추적
          </Button>
          <Button onClick={handleViewPatterns} variant="outline" className="gap-2">
            <Activity className="h-4 w-4" />
            패턴 분석
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            불량 등록
          </Button>
        </div>
      </div>

      {/* Trace Input */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">생산 이력 추적 (로트 번호 입력)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={lotNoInput}
                onChange={(e) => setLotNoInput(e.target.value)}
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2"
                placeholder="LOT-20240315-001"
              />
              <Button onClick={handleTrace} className="gap-2">
                <Search className="h-4 w-4" />
                추적
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">총 불량</p>
              <p className="text-2xl font-bold text-red-600">{total}</p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">추적 완료</p>
              <p className="text-2xl font-bold text-green-600">
                {failures.filter((f) => f.traceabilityStatus === TraceabilityStatus.TRACED).length}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">추적 중</p>
              <p className="text-2xl font-bold text-yellow-600">
                {failures.filter((f) => f.traceabilityStatus === TraceabilityStatus.IN_PROGRESS).length}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <Activity className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">패턴 발견</p>
              <p className="text-2xl font-bold text-blue-600">{patterns.length}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <GitBranch className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
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
            <label className="text-xs text-gray-600 dark:text-gray-400">불량 번호</label>
            <input
              type="text"
              value={filters.failureNo}
              onChange={(e) => handleFilterChange('failureNo', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="FLD-..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">품목 코드</label>
            <input
              type="text"
              value={filters.itemCode}
              onChange={(e) => handleFilterChange('itemCode', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="ITEM-..."
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
            <label className="text-xs text-gray-600 dark:text-gray-400">불량 모드</label>
            <input
              type="text"
              value={filters.failureMode}
              onChange={(e) => handleFilterChange('failureMode', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="균열, 변형..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">추적 상태</label>
            <select
              value={filters.traceabilityStatus}
              onChange={(e) => handleFilterChange('traceabilityStatus', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(TraceabilityStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
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

      {/* Failures Table */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">불량 번호</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">품목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">로트</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">불량 모드</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">발생일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">추적 상태</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : failures.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                failures.map((failure) => (
                  <tr
                    key={failure.failureId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 font-medium">{failure.failureNo}</td>
                    <td className="px-4 py-3">{failure.itemName || failure.itemCode}</td>
                    <td className="px-4 py-3">{failure.lotNo || '-'}</td>
                    <td className="px-4 py-3">{failure.failureMode}</td>
                    <td className="px-4 py-3">{failure.failureDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${traceabilityColors[failure.traceabilityStatus]}`}>
                        {failure.traceabilityStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFailure(failure);
                            setShowDetail(true);
                          }}
                        >
                          상세
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelectedFailure(failure);
                            setCountermeasureData({
                              immediateAction: failure.immediateAction || '',
                              correctiveAction: failure.correctiveAction || '',
                              preventiveAction: failure.preventiveAction || '',
                              actionDeadline: failure.actionDeadline || '',
                              actionCompletedBy: failure.actionCompletedBy || '',
                              verificationResult: failure.verificationResult || '',
                            });
                            setShowCountermeasure(true);
                          }}
                        >
                          대책
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-md border border-border bg-surface px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              총 {total}건
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
            >
              이전
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {page} 페이지
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

      {/* New Failure Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                필드 불량 등록
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">불량 ID *</label>
                <input
                  type="text"
                  value={formData.failureId}
                  onChange={(e) => setFormData({ ...formData, failureId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="FAIL-20240319-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">불량 번호 *</label>
                <input
                  type="text"
                  value={formData.failureNo}
                  onChange={(e) => setFormData({ ...formData, failureNo: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="FLD-2024-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">품목 코드 *</label>
                <input
                  type="text"
                  value={formData.itemCode}
                  onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="ITEM-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">품목명</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="알루미늄 케이스"
                />
              </div>
              <div>
                <label className="text-sm font-medium">로트 번호</label>
                <input
                  type="text"
                  value={formData.lotNo}
                  onChange={(e) => setFormData({ ...formData, lotNo: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="LOT-20240315-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">시리얼 번호</label>
                <input
                  type="text"
                  value={formData.serialNo}
                  onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="SN123456789"
                />
              </div>
              <div>
                <label className="text-sm font-medium">발생일 *</label>
                <input
                  type="date"
                  value={formData.failureDate}
                  onChange={(e) => setFormData({ ...formData, failureDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">발견일</label>
                <input
                  type="date"
                  value={formData.discoveryDate}
                  onChange={(e) => setFormData({ ...formData, discoveryDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">불량 모드 *</label>
                <input
                  type="text"
                  value={formData.failureMode}
                  onChange={(e) => setFormData({ ...formData, failureMode: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="균열"
                />
              </div>
              <div>
                <label className="text-sm font-medium">불량 원인</label>
                <input
                  type="text"
                  value={formData.failureCause}
                  onChange={(e) => setFormData({ ...formData, failureCause: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="열처리 불량"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">불량 상세</label>
                <textarea
                  value={formData.failureDetail}
                  onChange={(e) => setFormData({ ...formData, failureDetail: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="불량 내용을 상세히 입력하세요"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreateFailure}>등록</Button>
            </div>
          </div>
        </div>
      )}

      {/* Trace Modal */}
      {showTrace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                생산 이력 추적
              </h2>
              <button onClick={() => setShowTrace(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            {traceabilityResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <span className="text-xs text-gray-500">로트 번호</span>
                    <p className="font-medium">{traceabilityResult.lotNo}</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <span className="text-xs text-gray-500">품목</span>
                    <p className="font-medium">{traceabilityResult.itemName || traceabilityResult.itemCode}</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <span className="text-xs text-gray-500">생산일</span>
                    <p className="font-medium">{traceabilityResult.productionDate || '-'}</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <span className="text-xs text-gray-500">생산 라인</span>
                    <p className="font-medium">{traceabilityResult.productionLine || '-'}</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <span className="text-xs text-gray-500">장비</span>
                    <p className="font-medium">{traceabilityResult.equipmentName || traceabilityResult.equipmentId || '-'}</p>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
                    <span className="text-xs text-gray-500">작업자</span>
                    <p className="font-medium">{traceabilityResult.operatorName || traceabilityResult.operatorId || '-'}</p>
                  </div>
                </div>
                {traceabilityResult.relatedFailures.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">관련 불량</h3>
                    <div className="space-y-2">
                      {traceabilityResult.relatedFailures.map((failure: any) => (
                        <div key={failure.failureId} className="rounded-md border border-border p-2">
                          <p className="text-sm">
                            <strong>{failure.failureId}</strong> - {failure.failureMode} ({failure.failureDate})
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                로트 번호를 입력하고 추적 버튼을 클릭하세요
              </div>
            )}
          </div>
        </div>
      )}

      {/* Patterns Modal */}
      {showPatterns && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                불량 패턴 분석
              </h2>
              <button onClick={() => setShowPatterns(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium mb-4">월별 불량 추이</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="failures" name="불량 수" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium mb-4">불량 모드별 분포</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={patternData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="발생 횟수" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Countermeasure Modal */}
      {showCountermeasure && selectedFailure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                대책 등록/수정
              </h2>
              <button onClick={() => setShowCountermeasure(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm">
                불량 번호: <strong>{selectedFailure.failureNo}</strong> | 
                불량 모드: <strong>{selectedFailure.failureMode}</strong>
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">즉시 조치</label>
                <textarea
                  value={countermeasureData.immediateAction}
                  onChange={(e) => setCountermeasureData({ ...countermeasureData, immediateAction: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="즉시 조치 내용"
                />
              </div>
              <div>
                <label className="text-sm font-medium">근본 대책</label>
                <textarea
                  value={countermeasureData.correctiveAction}
                  onChange={(e) => setCountermeasureData({ ...countermeasureData, correctiveAction: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="근본 대책 내용"
                />
              </div>
              <div>
                <label className="text-sm font-medium">재발 방지</label>
                <textarea
                  value={countermeasureData.preventiveAction}
                  onChange={(e) => setCountermeasureData({ ...countermeasureData, preventiveAction: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="재발 방지 대책"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">완료 목표일</label>
                  <input
                    type="date"
                    value={countermeasureData.actionDeadline}
                    onChange={(e) => setCountermeasureData({ ...countermeasureData, actionDeadline: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">완료자</label>
                  <input
                    type="text"
                    value={countermeasureData.actionCompletedBy}
                    onChange={(e) => setCountermeasureData({ ...countermeasureData, actionCompletedBy: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                    placeholder="홍길동"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">검증 결과</label>
                <textarea
                  value={countermeasureData.verificationResult}
                  onChange={(e) => setCountermeasureData({ ...countermeasureData, verificationResult: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="대책 적용 후 검증 결과"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowCountermeasure(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleSaveCountermeasure}>저장</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
