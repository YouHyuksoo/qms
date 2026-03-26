'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, Plus, Filter, X, Eye, CheckCircle, XCircle, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DvpPlan,
  DvpResult,
  TestCategory,
  TestResult,
  CreateDvpPlanRequest,
  DvpQueryParams,
  ValidationStatus,
} from '@/types';
import { useDvpStore } from '@/stores';
import { Button } from '@/components/ui/button';

const categoryColors: Record<TestCategory, string> = {
  [TestCategory.FUNCTIONAL]: 'bg-blue-100 text-blue-800',
  [TestCategory.ENVIRONMENTAL]: 'bg-green-100 text-green-800',
  [TestCategory.RELIABILITY]: 'bg-purple-100 text-purple-800',
  [TestCategory.SAFETY]: 'bg-red-100 text-red-800',
  [TestCategory.DURABILITY]: 'bg-orange-100 text-orange-800',
  [TestCategory.ELECTRICAL]: 'bg-yellow-100 text-yellow-800',
  [TestCategory.MECHANICAL]: 'bg-indigo-100 text-indigo-800',
  [TestCategory.CHEMICAL]: 'bg-pink-100 text-pink-800',
};

const resultColors: Record<TestResult, string> = {
  [TestResult.PASS]: 'bg-green-100 text-green-800',
  [TestResult.FAIL]: 'bg-red-100 text-red-800',
  [TestResult.PENDING]: 'bg-yellow-100 text-yellow-800',
  [TestResult.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TestResult.NOT_TESTED]: 'bg-gray-100 text-gray-800',
};

export default function DvpPage() {
  const { t } = useTranslation();

  const {
    plans,
    total,
    page,
    limit,
    isLoading,
    validationStatus,
    selectedPlan,
    fetchPlans,
    fetchPlan,
    createPlan,
    recordResult,
    fetchValidationStatus,
    setPage,
    setSelectedPlan,
  } = useDvpStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [filters, setFilters] = useState<DvpQueryParams>({
    planId: '',
    projectNo: '',
    itemCode: '',
    testCategory: undefined,
    testItem: '',
    testResult: undefined,
    responsiblePerson: '',
  });

  const [formData, setFormData] = useState<CreateDvpPlanRequest>({
    planId: '',
    projectNo: '',
    itemCode: '',
    itemName: '',
    testCategory: TestCategory.FUNCTIONAL,
    testItem: '',
    testMethod: '',
    acceptanceCriteria: '',
    testFacility: '',
    plannedStartDate: new Date().toISOString().split('T')[0],
    plannedEndDate: '',
    sampleQty: 5,
    responsiblePerson: '',
    referenceSpec: '',
    remarks: '',
  });

  const [resultData, setResultData] = useState({
    resultId: '',
    actualStartDate: '',
    actualEndDate: '',
    testedQty: 0,
    passedQty: 0,
    failedQty: 0,
    testResult: TestResult.NOT_TESTED,
    testReportNo: '',
    testedBy: '',
    measuredValues: '',
    defectDescription: '',
    correctiveAction: '',
    remarks: '',
  });

  useEffect(() => {
    fetchPlans({ page, limit });
    fetchValidationStatus();
  }, [page, limit]);

  const handleFilterChange = (key: keyof DvpQueryParams, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchPlans({ ...filters, page: 1, limit });
  };

  const resetFilters = () => {
    setFilters({
      planId: '',
      projectNo: '',
      itemCode: '',
      testCategory: undefined,
      testItem: '',
      testResult: undefined,
      responsiblePerson: '',
    });
    fetchPlans({ page: 1, limit });
  };

  const handleCreatePlan = async () => {
    const planId = formData.planId || `DVP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const success = await createPlan({
      ...formData,
      planId,
    });
    if (success) {
      setShowForm(false);
      fetchPlans({ page, limit });
    }
  };

  const handleViewDetail = async (plan: DvpPlan) => {
    await fetchPlan(plan.planId);
    setShowDetail(true);
  };

  const handleRecordResult = async () => {
    if (!selectedPlan) return;
    const resultId = resultData.resultId || `RESULT-${Date.now()}`;
    const success = await recordResult(selectedPlan.planId, {
      ...resultData,
      resultId,
    });
    if (success) {
      setShowResultForm(false);
      fetchPlan(selectedPlan.planId);
      fetchValidationStatus();
    }
  };

  const handleOpenResultForm = (plan: DvpPlan) => {
    setSelectedPlan(plan);
    setResultData({
      resultId: '',
      actualStartDate: new Date().toISOString().split('T')[0],
      actualEndDate: '',
      testedQty: plan.sampleQty,
      passedQty: 0,
      failedQty: 0,
      testResult: TestResult.NOT_TESTED,
      testReportNo: '',
      testedBy: '',
      measuredValues: '',
      defectDescription: '',
      correctiveAction: '',
      remarks: '',
    });
    setShowResultForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FlaskConical className="h-6 w-6" />
            DVP 관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Design Validation Plan & Results - 설계 검증 계획 및 결과
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowDashboard(true)} variant="outline" className="gap-2">
            <Activity className="h-4 w-4" />
            현황
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            새 계획
          </Button>
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
            <label className="text-xs text-gray-600 dark:text-gray-400">계획 ID</label>
            <input
              type="text"
              value={filters.planId}
              onChange={(e) => handleFilterChange('planId', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="DVP-..."
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
            <label className="text-xs text-gray-600 dark:text-gray-400">카테고리</label>
            <select
              value={filters.testCategory || ''}
              onChange={(e) => handleFilterChange('testCategory', e.target.value as TestCategory)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(TestCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">시험 결과</label>
            <select
              value={filters.testResult || ''}
              onChange={(e) => handleFilterChange('testResult', e.target.value as TestResult)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(TestResult).map((result) => (
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

      {/* Plan Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">계획 ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">프로젝트</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">품목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">카테고리</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">시험 항목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">계획일</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">결과</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      불러오는 중...
                    </div>
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                plans.map((plan) => {
                  const latestResult = plan.results?.[plan.results.length - 1];
                  return (
                    <tr
                      key={plan.planId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => handleViewDetail(plan)}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        {plan.planId}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        {plan.projectNo}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        {plan.itemName || plan.itemCode}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[plan.testCategory]}`}>
                          {plan.testCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        {plan.testItem}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                        {plan.plannedStartDate ? new Date(plan.plannedStartDate).toLocaleDateString('ko-KR') : '-'}
                        {' ~ '}
                        {plan.plannedEndDate ? new Date(plan.plannedEndDate).toLocaleDateString('ko-KR') : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {latestResult ? (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${resultColors[latestResult.testResult]}`}>
                            {latestResult.testResult}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetail(plan);
                            }}
                            title="상세"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenResultForm(plan);
                            }}
                            title="결과 입력"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* Create Plan Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                새 DVP 계획 생성
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">계획 ID</label>
                <input
                  type="text"
                  value={formData.planId}
                  onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
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
                <label className="text-sm font-medium">시험 카테고리</label>
                <select
                  value={formData.testCategory}
                  onChange={(e) => setFormData({ ...formData, testCategory: e.target.value as TestCategory })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  {Object.values(TestCategory).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">시험 항목 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.testItem}
                  onChange={(e) => setFormData({ ...formData, testItem: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="시험 항목명"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">시험 방법</label>
                <input
                  type="text"
                  value={formData.testMethod}
                  onChange={(e) => setFormData({ ...formData, testMethod: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="시험 방법"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">수용 기준</label>
                <input
                  type="text"
                  value={formData.acceptanceCriteria}
                  onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="수용 기준"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">시험 기관</label>
                <input
                  type="text"
                  value={formData.testFacility}
                  onChange={(e) => setFormData({ ...formData, testFacility: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="시험 기관"
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
                <label className="text-sm font-medium">계획 시작일</label>
                <input
                  type="date"
                  value={formData.plannedStartDate}
                  onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">계획 종료일</label>
                <input
                  type="date"
                  value={formData.plannedEndDate}
                  onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreatePlan}>생성</Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  DVP 계획 상세
                </h2>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[selectedPlan.testCategory]}`}>
                  {selectedPlan.testCategory}
                </span>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Plan Info */}
            <div className="mb-6 grid grid-cols-4 gap-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
              <div>
                <span className="text-xs text-gray-500">계획 ID</span>
                <p className="font-medium">{selectedPlan.planId}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">프로젝트</span>
                <p className="font-medium">{selectedPlan.projectNo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">품목</span>
                <p className="font-medium">{selectedPlan.itemName || selectedPlan.itemCode}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">시험 항목</span>
                <p className="font-medium">{selectedPlan.testItem}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">시험 방법</span>
                <p className="font-medium">{selectedPlan.testMethod || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">수용 기준</span>
                <p className="font-medium">{selectedPlan.acceptanceCriteria || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">샘플 수량</span>
                <p className="font-medium">{selectedPlan.sampleQty}개</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">시험 기관</span>
                <p className="font-medium">{selectedPlan.testFacility || '-'}</p>
              </div>
            </div>

            {/* Results */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">시험 결과</h3>
                <Button size="sm" onClick={() => handleOpenResultForm(selectedPlan)}>
                  결과 입력
                </Button>
              </div>
              {selectedPlan.results && selectedPlan.results.length > 0 ? (
                <div className="space-y-2">
                  {selectedPlan.results.map((result) => (
                    <div
                      key={result.resultId}
                      className="rounded-md border border-border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.resultId}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${resultColors[result.testResult]}`}>
                          {result.testResult}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        시험일: {result.actualStartDate ? new Date(result.actualStartDate).toLocaleDateString('ko-KR') : '-'} ~ {result.actualEndDate ? new Date(result.actualEndDate).toLocaleDateString('ko-KR') : '-'}
                      </p>
                      <p className="text-sm text-gray-600">
                        결과: {result.passedQty} / {result.testedQty} (합격/시험)
                      </p>
                      {result.measuredValues && (
                        <p className="text-sm text-gray-600">측정값: {result.measuredValues}</p>
                      )}
                      {result.defectDescription && (
                        <p className="text-sm text-red-600">결함: {result.defectDescription}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">등록된 결과가 없습니다.</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button onClick={() => setShowDetail(false)} variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Result Form Modal */}
      {showResultForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                시험 결과 입력
              </h2>
              <button onClick={() => setShowResultForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">결과 ID</label>
                <input
                  type="text"
                  value={resultData.resultId}
                  onChange={(e) => setResultData({ ...resultData, resultId: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="자동 생성"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">시험 결과</label>
                <select
                  value={resultData.testResult}
                  onChange={(e) => setResultData({ ...resultData, testResult: e.target.value as TestResult })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  {Object.values(TestResult).map((result) => (
                    <option key={result} value={result}>{result}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">시험 시작일</label>
                <input
                  type="date"
                  value={resultData.actualStartDate}
                  onChange={(e) => setResultData({ ...resultData, actualStartDate: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">시험 종료일</label>
                <input
                  type="date"
                  value={resultData.actualEndDate}
                  onChange={(e) => setResultData({ ...resultData, actualEndDate: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">시험 수량</label>
                <input
                  type="number"
                  value={resultData.testedQty}
                  onChange={(e) => setResultData({ ...resultData, testedQty: parseInt(e.target.value) })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">합격 수량</label>
                <input
                  type="number"
                  value={resultData.passedQty}
                  onChange={(e) => setResultData({ ...resultData, passedQty: parseInt(e.target.value) })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">불합격 수량</label>
                <input
                  type="number"
                  value={resultData.failedQty}
                  onChange={(e) => setResultData({ ...resultData, failedQty: parseInt(e.target.value) })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">시험 보고서 번호</label>
                <input
                  type="text"
                  value={resultData.testReportNo}
                  onChange={(e) => setResultData({ ...resultData, testReportNo: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="RPT-..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">시험자</label>
                <input
                  type="text"
                  value={resultData.testedBy}
                  onChange={(e) => setResultData({ ...resultData, testedBy: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="시험자명"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">측정값</label>
                <input
                  type="text"
                  value={resultData.measuredValues}
                  onChange={(e) => setResultData({ ...resultData, measuredValues: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="측정값"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">결함 설명</label>
                <textarea
                  value={resultData.defectDescription}
                  onChange={(e) => setResultData({ ...resultData, defectDescription: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  rows={2}
                  placeholder="결함 설명"
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">시정 조치</label>
                <textarea
                  value={resultData.correctiveAction}
                  onChange={(e) => setResultData({ ...resultData, correctiveAction: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  rows={2}
                  placeholder="시정 조치"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowResultForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleRecordResult}>저장</Button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Modal */}
      {showDashboard && validationStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                검증 현황 대시보드
              </h2>
              <button onClick={() => setShowDashboard(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">총 계획 수</p>
                <p className="text-2xl font-bold text-blue-600">{validationStatus.totalPlans}</p>
              </div>
              <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">합격률</p>
                <p className="text-2xl font-bold text-green-600">{validationStatus.passRate}%</p>
              </div>
              <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">진행중</p>
                <p className="text-2xl font-bold text-yellow-600">{validationStatus.inProgressCount}</p>
              </div>
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">불합격</p>
                <p className="text-2xl font-bold text-red-600">{validationStatus.failedCount}</p>
              </div>
            </div>

            {/* By Category */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">카테고리별 현황</h3>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(validationStatus.byCategory).map(([category, count]) => (
                  <div key={category} className="rounded-md border border-border p-2">
                    <span className="text-xs text-gray-500">{category}</span>
                    <p className="text-lg font-bold">{count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* By Result */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">결과별 현황</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(validationStatus.byResult).map(([result, count]) => (
                  <div key={result} className={`rounded-md px-3 py-2 ${resultColors[result as TestResult]}`}>
                    <span className="text-xs">{result}: {count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setShowDashboard(false)} variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
