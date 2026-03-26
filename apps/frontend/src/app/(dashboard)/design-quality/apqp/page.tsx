'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GitBranch, Plus, Filter, X, Eye, CheckCircle, XCircle, BarChart3, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ApqpProject,
  ApqpProjectStatus,
  ApqpPhaseStatus,
  DeliverableStatus,
  CreateApqpProjectRequest,
  ApqpQueryParams,
} from '@/types';
import { useApqpStore } from '@/stores';
import { Button } from '@/components/ui/button';

const statusColors: Record<ApqpProjectStatus, string> = {
  [ApqpProjectStatus.PLANNING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [ApqpProjectStatus.PRODUCT_DESIGN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [ApqpProjectStatus.PROCESS_DESIGN]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [ApqpProjectStatus.VALIDATION]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [ApqpProjectStatus.PRODUCTION]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [ApqpProjectStatus.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [ApqpProjectStatus.CANCELLED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
};

const phaseStatusColors: Record<ApqpPhaseStatus, string> = {
  [ApqpPhaseStatus.NOT_STARTED]: 'bg-gray-100 text-gray-800',
  [ApqpPhaseStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ApqpPhaseStatus.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-800',
  [ApqpPhaseStatus.APPROVED]: 'bg-green-100 text-green-800',
  [ApqpPhaseStatus.REJECTED]: 'bg-red-100 text-red-800',
};

export default function ApqpPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    projects,
    total,
    page,
    limit,
    isLoading,
    selectedProject,
    targetVsActual,
    timeline,
    fetchProjects,
    fetchProject,
    createProject,
    setPage,
    setSelectedProject,
  } = useApqpStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [filters, setFilters] = useState<ApqpQueryParams>({
    projectNo: '',
    projectName: '',
    customerCode: '',
    itemCode: '',
    status: undefined,
    projectManager: '',
  });

  const [formData, setFormData] = useState<CreateApqpProjectRequest>({
    projectNo: '',
    projectName: '',
    customerCode: '',
    customerName: '',
    itemCode: '',
    itemName: '',
    plannedStartDate: new Date().toISOString().split('T')[0],
    plannedEndDate: '',
    projectManager: '',
    targetQualityLevel: 99,
    remarks: '',
  });

  useEffect(() => {
    fetchProjects({ page, limit });
  }, [page, limit]);

  const handleFilterChange = (key: keyof ApqpQueryParams, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchProjects({ ...filters, page: 1, limit });
  };

  const resetFilters = () => {
    setFilters({
      projectNo: '',
      projectName: '',
      customerCode: '',
      itemCode: '',
      status: undefined,
      projectManager: '',
    });
    fetchProjects({ page: 1, limit });
  };

  const handleCreateProject = async () => {
    const projectNo = formData.projectNo || `APQP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const success = await createProject({
      ...formData,
      projectNo,
    });
    if (success) {
      setShowForm(false);
      fetchProjects({ page, limit });
    }
  };

  const handleViewDetail = async (project: ApqpProject) => {
    await fetchProject(project.projectNo);
    setShowDetail(true);
  };

  const handleViewComparison = async (project: ApqpProject) => {
    const store = useApqpStore.getState();
    await store.fetchTargetVsActual(project.projectNo);
    setShowComparison(true);
  };

  const handleViewTimeline = async (project: ApqpProject) => {
    const store = useApqpStore.getState();
    await store.fetchTimeline(project.projectNo);
    setShowTimeline(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GitBranch className="h-6 w-6" />
            APQP 관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Advanced Product Quality Planning - 제품 개발 품질 계획
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          새 프로젝트
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
            <label className="text-xs text-gray-600 dark:text-gray-400">프로젝트명</label>
            <input
              type="text"
              value={filters.projectName}
              onChange={(e) => handleFilterChange('projectName', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="프로젝트명..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">고객</label>
            <input
              type="text"
              value={filters.customerCode}
              onChange={(e) => handleFilterChange('customerCode', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="고객 코드"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">품목</label>
            <input
              type="text"
              value={filters.itemCode}
              onChange={(e) => handleFilterChange('itemCode', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="품목 코드"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">상태</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as ApqpProjectStatus)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(ApqpProjectStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
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

      {/* Project Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">프로젝트 번호</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">프로젝트명</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">품목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">고객</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">책임자</th>
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
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.projectNo}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => handleViewDetail(project)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {project.projectNo}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {project.projectName}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {project.itemCode}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {project.customerName || project.customerCode}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {project.projectManager}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(project);
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
                            handleViewComparison(project);
                          }}
                          title="타겟vs실적"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTimeline(project);
                          }}
                          title="타임라인"
                        >
                          <Clock className="h-4 w-4" />
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

      {/* Create Project Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                새 APQP 프로젝트 생성
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">프로젝트 번호</label>
                <input
                  type="text"
                  value={formData.projectNo}
                  onChange={(e) => setFormData({ ...formData, projectNo: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="자동 생성"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">프로젝트명 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="프로젝트명"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">고객 코드</label>
                <input
                  type="text"
                  value={formData.customerCode}
                  onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="CUST-..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">고객명</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="고객명"
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
              <div className="space-y-1">
                <label className="text-sm font-medium">프로젝트 책임자</label>
                <input
                  type="text"
                  value={formData.projectManager}
                  onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="담당자"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">목표 품질 수준 (%)</label>
                <input
                  type="number"
                  value={formData.targetQualityLevel}
                  onChange={(e) => setFormData({ ...formData, targetQualityLevel: parseFloat(e.target.value) })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreateProject}>생성</Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  APQP 프로젝트 상세
                </h2>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedProject.status]}`}>
                  {selectedProject.status}
                </span>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Project Info */}
            <div className="mb-6 grid grid-cols-4 gap-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
              <div>
                <span className="text-xs text-gray-500">프로젝트 번호</span>
                <p className="font-medium">{selectedProject.projectNo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">프로젝트명</span>
                <p className="font-medium">{selectedProject.projectName}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">품목</span>
                <p className="font-medium">{selectedProject.itemName || selectedProject.itemCode}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">고객</span>
                <p className="font-medium">{selectedProject.customerName || selectedProject.customerCode}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">책임자</span>
                <p className="font-medium">{selectedProject.projectManager}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">목표 품질</span>
                <p className="font-medium">{selectedProject.targetQualityLevel}%</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">실적 품질</span>
                <p className="font-medium">{selectedProject.actualQualityLevel ? `${selectedProject.actualQualityLevel}%` : '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">생성일</span>
                <p className="font-medium">{new Date(selectedProject.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>

            {/* Phases */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">APQP 단계</h3>
              {selectedProject.phases && selectedProject.phases.length > 0 ? (
                <div className="space-y-2">
                  {selectedProject.phases.map((phase) => (
                    <div
                      key={phase.phaseId}
                      className="rounded-md border border-border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{phase.phaseName}</span>
                          <span className="text-xs text-gray-500">({phase.phaseType})</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${phaseStatusColors[phase.status]}`}>
                          {phase.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        계획: {phase.plannedStartDate ? new Date(phase.plannedStartDate).toLocaleDateString('ko-KR') : '-'} ~ {phase.plannedEndDate ? new Date(phase.plannedEndDate).toLocaleDateString('ko-KR') : '-'}
                      </p>
                      <p className="text-sm text-gray-600">
                        실적: {phase.actualStartDate ? new Date(phase.actualStartDate).toLocaleDateString('ko-KR') : '-'} ~ {phase.actualEndDate ? new Date(phase.actualEndDate).toLocaleDateString('ko-KR') : '-'}
                      </p>
                      {phase.deliverables && phase.deliverables.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">산출물:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {phase.deliverables.map((d) => (
                              <span
                                key={d.deliverableId}
                                className={`text-xs px-2 py-0.5 rounded ${
                                  d.status === DeliverableStatus.APPROVED
                                    ? 'bg-green-100 text-green-800'
                                    : d.status === DeliverableStatus.SUBMITTED
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {d.deliverableName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">등록된 단계가 없습니다.</p>
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

      {/* Target vs Actual Modal */}
      {showComparison && targetVsActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                타겟 vs 실적 비교
              </h2>
              <button onClick={() => setShowComparison(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Overall Summary */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">전체 목표 품질</p>
                <p className="text-2xl font-bold text-blue-600">{targetVsActual.overallTarget?.toFixed(2) || '-'}%</p>
              </div>
              <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm text-gray-600 dark:text-gray-400">전체 실적 품질</p>
                <p className="text-2xl font-bold text-green-600">{targetVsActual.overallActual?.toFixed(2) || '-'}%</p>
              </div>
              <div className={`rounded-md p-4 ${
                (targetVsActual.overallVariance || 0) >= 0 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-400">차이</p>
                <p className={`text-2xl font-bold ${
                  (targetVsActual.overallVariance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {targetVsActual.overallVariance !== null 
                    ? `${targetVsActual.overallVariance > 0 ? '+' : ''}${targetVsActual.overallVariance.toFixed(2)}%`
                    : '-'}
                </p>
              </div>
            </div>

            {/* Phase Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">단계</th>
                    <th className="px-4 py-2 text-left">유형</th>
                    <th className="px-4 py-2 text-right">목표 품질</th>
                    <th className="px-4 py-2 text-right">실적 품질</th>
                    <th className="px-4 py-2 text-right">차이</th>
                    <th className="px-4 py-2 text-center">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {targetVsActual.comparison.map((item) => (
                    <tr key={item.phaseId}>
                      <td className="px-4 py-2">{item.phaseName}</td>
                      <td className="px-4 py-2 text-gray-600">{item.phaseType}</td>
                      <td className="px-4 py-2 text-right">{item.targetQualityLevel?.toFixed(2) || '-'}%</td>
                      <td className="px-4 py-2 text-right">{item.actualQualityLevel?.toFixed(2) || '-'}%</td>
                      <td className={`px-4 py-2 text-right ${
                        (item.variance || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.variance !== null 
                          ? `${item.variance > 0 ? '+' : ''}${item.variance.toFixed(2)}%`
                          : '-'}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${phaseStatusColors[item.status as ApqpPhaseStatus]}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowComparison(false)} variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      {showTimeline && timeline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                프로젝트 타임라인
              </h2>
              <button onClick={() => setShowTimeline(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Timeline Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left">단계</th>
                    <th className="px-4 py-2 text-left">계획 시작</th>
                    <th className="px-4 py-2 text-left">계획 종료</th>
                    <th className="px-4 py-2 text-left">실제 시작</th>
                    <th className="px-4 py-2 text-left">실제 종료</th>
                    <th className="px-4 py-2 text-right">소요일</th>
                    <th className="px-4 py-2 text-right">지연</th>
                    <th className="px-4 py-2 text-center">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {timeline.timeline.map((item) => (
                    <tr key={item.phaseId}>
                      <td className="px-4 py-2 font-medium">{item.phaseName}</td>
                      <td className="px-4 py-2">{item.plannedStart ? new Date(item.plannedStart).toLocaleDateString('ko-KR') : '-'}</td>
                      <td className="px-4 py-2">{item.plannedEnd ? new Date(item.plannedEnd).toLocaleDateString('ko-KR') : '-'}</td>
                      <td className="px-4 py-2">{item.actualStart ? new Date(item.actualStart).toLocaleDateString('ko-KR') : '-'}</td>
                      <td className="px-4 py-2">{item.actualEnd ? new Date(item.actualEnd).toLocaleDateString('ko-KR') : '-'}</td>
                      <td className="px-4 py-2 text-right">{item.duration || '-'}일</td>
                      <td className={`px-4 py-2 text-right ${(item.delay || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.delay !== null ? `${item.delay > 0 ? '+' : ''}${item.delay}일` : '-'}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${phaseStatusColors[item.status as ApqpPhaseStatus]}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowTimeline(false)} variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
