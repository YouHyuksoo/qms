'use client';

import { useState, useEffect } from 'react';
import { FileCheck, Plus, Filter, X, Eye, CheckCircle, XCircle, RotateCcw, History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  PpapSubmission,
  PpapStatus,
  PpapSubmissionLevel,
  PpapDocumentType,
  DocumentStatus,
  CreatePpapSubmissionRequest,
  PpapQueryParams,
  ApprovalAction,
  PpapApprovalHistory,
} from '@/types';
import { usePpapStore } from '@/stores';
import { Button } from '@/components/ui/button';

const statusColors: Record<PpapStatus, string> = {
  [PpapStatus.NOT_SUBMITTED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  [PpapStatus.SUBMITTED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [PpapStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [PpapStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [PpapStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [PpapStatus.INTERIM_APPROVED]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

const levelColors: Record<PpapSubmissionLevel, string> = {
  [PpapSubmissionLevel.LEVEL_1]: 'bg-gray-100 text-gray-800',
  [PpapSubmissionLevel.LEVEL_2]: 'bg-blue-100 text-blue-800',
  [PpapSubmissionLevel.LEVEL_3]: 'bg-green-100 text-green-800',
  [PpapSubmissionLevel.LEVEL_4]: 'bg-purple-100 text-purple-800',
  [PpapSubmissionLevel.LEVEL_5]: 'bg-orange-100 text-orange-800',
};

const documentStatusColors: Record<DocumentStatus, string> = {
  [DocumentStatus.NOT_SUBMITTED]: 'bg-gray-100 text-gray-800',
  [DocumentStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
  [DocumentStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
  [DocumentStatus.APPROVED]: 'bg-green-100 text-green-800',
  [DocumentStatus.REJECTED]: 'bg-red-100 text-red-800',
};

const actionLabels: Record<ApprovalAction, string> = {
  [ApprovalAction.SUBMITTED]: '제출',
  [ApprovalAction.APPROVED]: '승인',
  [ApprovalAction.REJECTED]: '반려',
  [ApprovalAction.RESUBMITTED]: '재제출',
  [ApprovalAction.INTERIM_APPROVED]: '임시승인',
};

export default function PpapPage() {
  const { t } = useTranslation();

  const {
    submissions,
    total,
    page,
    limit,
    isLoading,
    selectedSubmission,
    fetchSubmissions,
    fetchSubmission,
    createSubmission,
    approveSubmission,
    rejectSubmission,
    resubmitSubmission,
    fetchApprovalHistory,
    setPage,
    setSelectedSubmission,
  } = usePpapStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<PpapApprovalHistory[]>([]);
  const [filters, setFilters] = useState<PpapQueryParams>({
    submissionId: '',
    projectNo: '',
    submissionNo: '',
    customerCode: '',
    status: undefined,
    submissionLevel: undefined,
  });
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const [formData, setFormData] = useState<CreatePpapSubmissionRequest>({
    submissionId: '',
    projectNo: '',
    submissionNo: '',
    submissionLevel: PpapSubmissionLevel.LEVEL_3,
    customerCode: '',
    customerName: '',
    pswNo: '',
    remarks: '',
  });

  useEffect(() => {
    fetchSubmissions({ page, limit });
  }, [page, limit]);

  const handleFilterChange = (key: keyof PpapQueryParams, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchSubmissions({ ...filters, page: 1, limit });
  };

  const resetFilters = () => {
    setFilters({
      submissionId: '',
      projectNo: '',
      submissionNo: '',
      customerCode: '',
      status: undefined,
      submissionLevel: undefined,
    });
    fetchSubmissions({ page: 1, limit });
  };

  const handleCreateSubmission = async () => {
    const submissionId = formData.submissionId || `PPAP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const submissionNo = formData.submissionNo || `SUB-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const success = await createSubmission({
      ...formData,
      submissionId,
      submissionNo,
    });
    if (success) {
      setShowForm(false);
      fetchSubmissions({ page, limit });
    }
  };

  const handleViewDetail = async (submission: PpapSubmission) => {
    await fetchSubmission(submission.submissionId);
    setShowDetail(true);
  };

  const handleViewHistory = async (submission: PpapSubmission) => {
    const data = await fetchApprovalHistory(submission.submissionId);
    setHistory(data);
    setShowHistory(true);
  };

  const handleApprove = async (submissionId: string) => {
    const success = await approveSubmission(submissionId, 'current-user');
    if (success) {
      fetchSubmissions({ page, limit });
      if (showDetail) {
        fetchSubmission(submissionId);
      }
    }
  };

  const handleReject = async (submissionId: string) => {
    if (!rejectReason) {
      setShowRejectForm(true);
      return;
    }
    const success = await rejectSubmission(submissionId, rejectReason, 'current-user');
    if (success) {
      setShowRejectForm(false);
      setRejectReason('');
      fetchSubmissions({ page, limit });
      if (showDetail) {
        fetchSubmission(submissionId);
      }
    }
  };

  const handleResubmit = async (submissionId: string) => {
    const success = await resubmitSubmission(submissionId, 'current-user');
    if (success) {
      fetchSubmissions({ page, limit });
      if (showDetail) {
        fetchSubmission(submissionId);
      }
    }
  };

  const getRequiredDocumentsForLevel = (level: PpapSubmissionLevel): PpapDocumentType[] => {
    const commonDocs = [
      PpapDocumentType.DESIGN_RECORDS,
      PpapDocumentType.FMEA,
      PpapDocumentType.CONTROL_PLAN,
      PpapDocumentType.MSA,
      PpapDocumentType.DIMENSIONAL_RESULTS,
      PpapDocumentType.PSW,
    ];
    
    const levelSpecific: Record<PpapSubmissionLevel, PpapDocumentType[]> = {
      [PpapSubmissionLevel.LEVEL_1]: [PpapDocumentType.AAR],
      [PpapSubmissionLevel.LEVEL_2]: [PpapDocumentType.AAR, PpapDocumentType.MATERIAL_PERFORMANCE],
      [PpapSubmissionLevel.LEVEL_3]: [
        PpapDocumentType.AAR,
        PpapDocumentType.MATERIAL_PERFORMANCE,
        PpapDocumentType.INITIAL_PROCESS_STUDIES,
        PpapDocumentType.QUALIFIED_LAB_DOCUMENTATION,
      ],
      [PpapSubmissionLevel.LEVEL_4]: [PpapDocumentType.AAR, PpapDocumentType.CUSTOMER_SPECIFIC],
      [PpapSubmissionLevel.LEVEL_5]: [
        PpapDocumentType.AAR,
        PpapDocumentType.MATERIAL_PERFORMANCE,
        PpapDocumentType.INITIAL_PROCESS_STUDIES,
        PpapDocumentType.QUALIFIED_LAB_DOCUMENTATION,
        PpapDocumentType.SAMPLE_PARTS,
        PpapDocumentType.MASTER_SAMPLE,
        PpapDocumentType.CHECKING_AIDS,
        PpapDocumentType.CUSTOMER_SPECIFIC,
      ],
    };
    
    return [...commonDocs, ...(levelSpecific[level] || [])];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileCheck className="h-6 w-6" />
            PPAP 관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Production Part Approval Process - 생산 부품 승인 프로세스
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          새 제출
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
            <label className="text-xs text-gray-600 dark:text-gray-400">제출 ID</label>
            <input
              type="text"
              value={filters.submissionId}
              onChange={(e) => handleFilterChange('submissionId', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="PPAP-..."
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
            <label className="text-xs text-gray-600 dark:text-gray-400">레벨</label>
            <select
              value={filters.submissionLevel || ''}
              onChange={(e) => handleFilterChange('submissionLevel', e.target.value ? parseInt(e.target.value) : undefined)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(PpapSubmissionLevel).filter(v => typeof v === 'number').map((level) => (
                <option key={level} value={level}>Level {level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">상태</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as PpapStatus)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(PpapStatus).map((status) => (
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

      {/* Submission Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">제출 ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">프로젝트</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">레벨</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">고객</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">PSW</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">재제출</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">상태</th>
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
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr
                    key={submission.submissionId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => handleViewDetail(submission)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {submission.submissionId}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {submission.projectNo}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${levelColors[submission.submissionLevel]}`}>
                        Level {submission.submissionLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {submission.customerName || submission.customerCode}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {submission.pswNo || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      {submission.resubmissionCount > 0 ? (
                        <span className="text-orange-600 font-medium">{submission.resubmissionCount}회</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(submission);
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
                            handleViewHistory(submission);
                          }}
                          title="이력"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                        {submission.status === PpapStatus.SUBMITTED && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(submission.submissionId);
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
                                handleReject(submission.submissionId);
                              }}
                              title="반려"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {submission.status === PpapStatus.REJECTED && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResubmit(submission.submissionId);
                            }}
                            title="재제출"
                          >
                            <RotateCcw className="h-4 w-4 text-blue-600" />
                          </Button>
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

      {/* Create Submission Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                새 PPAP 제출 생성
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">제출 ID</label>
                <input
                  type="text"
                  value={formData.submissionId}
                  onChange={(e) => setFormData({ ...formData, submissionId: e.target.value })}
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
                <label className="text-sm font-medium">제출 번호</label>
                <input
                  type="text"
                  value={formData.submissionNo}
                  onChange={(e) => setFormData({ ...formData, submissionNo: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="SUB-..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">제출 레벨</label>
                <select
                  value={formData.submissionLevel}
                  onChange={(e) => setFormData({ ...formData, submissionLevel: parseInt(e.target.value) as PpapSubmissionLevel })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                >
                  {Object.values(PpapSubmissionLevel).filter(v => typeof v === 'number').map((level) => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>
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
                <label className="text-sm font-medium">PSW 번호</label>
                <input
                  type="text"
                  value={formData.pswNo}
                  onChange={(e) => setFormData({ ...formData, pswNo: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="PSW-..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreateSubmission}>생성</Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  PPAP 제출 상세
                </h2>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedSubmission.status]}`}>
                  {selectedSubmission.status}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${levelColors[selectedSubmission.submissionLevel]}`}>
                  Level {selectedSubmission.submissionLevel}
                </span>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Submission Info */}
            <div className="mb-6 grid grid-cols-4 gap-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
              <div>
                <span className="text-xs text-gray-500">제출 ID</span>
                <p className="font-medium">{selectedSubmission.submissionId}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">프로젝트</span>
                <p className="font-medium">{selectedSubmission.projectNo}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">고객</span>
                <p className="font-medium">{selectedSubmission.customerName || selectedSubmission.customerCode}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">PSW</span>
                <p className="font-medium">{selectedSubmission.pswNo || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">제출일</span>
                <p className="font-medium">{selectedSubmission.submissionDate ? new Date(selectedSubmission.submissionDate).toLocaleDateString('ko-KR') : '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">검토자</span>
                <p className="font-medium">{selectedSubmission.reviewedBy || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">재제출 횟수</span>
                <p className="font-medium">{selectedSubmission.resubmissionCount}회</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">생성일</span>
                <p className="font-medium">{new Date(selectedSubmission.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
            </div>

            {/* Documents Checklist */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                문서 체크리스트 (Level {selectedSubmission.submissionLevel})
              </h3>
              {selectedSubmission.documents && selectedSubmission.documents.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {selectedSubmission.documents.map((doc) => (
                    <div
                      key={doc.documentId}
                      className="flex items-center justify-between rounded-md border border-border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          doc.isRequired ? 'bg-red-500' : 'bg-gray-300'
                        }`} title={doc.isRequired ? '필수' : '선택'} />
                        <span className="text-sm">{doc.documentName}</span>
                        <span className="text-xs text-gray-500">({doc.documentType})</span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${documentStatusColors[doc.status]}`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">등록된 문서가 없습니다.</p>
              )}
            </div>

            {/* Approval History */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">승인 이력</h3>
              {selectedSubmission.approvalHistory && selectedSubmission.approvalHistory.length > 0 ? (
                <div className="space-y-2">
                  {selectedSubmission.approvalHistory.map((history, index) => (
                    <div
                      key={history.historyId}
                      className="flex items-center gap-4 rounded-md border border-border p-2"
                    >
                      <span className="text-xs text-gray-500 w-8">#{index + 1}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        history.action === ApprovalAction.APPROVED ? 'bg-green-100 text-green-800' :
                        history.action === ApprovalAction.REJECTED ? 'bg-red-100 text-red-800' :
                        history.action === ApprovalAction.RESUBMITTED ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {actionLabels[history.action]}
                      </span>
                      <span className="text-sm">{history.actionBy}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(history.actionDate).toLocaleDateString('ko-KR')}
                      </span>
                      {history.reason && (
                        <span className="text-sm text-gray-600">- {history.reason}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">승인 이력이 없습니다.</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              {selectedSubmission.status === PpapStatus.SUBMITTED && (
                <>
                  <Button onClick={() => handleApprove(selectedSubmission.submissionId)} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    승인
                  </Button>
                  <Button onClick={() => handleReject(selectedSubmission.submissionId)} variant="destructive" className="gap-2">
                    <XCircle className="h-4 w-4" />
                    반려
                  </Button>
                </>
              )}
              {selectedSubmission.status === PpapStatus.REJECTED && (
                <Button onClick={() => handleResubmit(selectedSubmission.submissionId)} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  재제출
                </Button>
              )}
              <Button onClick={() => setShowDetail(false)} variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectForm && (
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
              <Button onClick={() => setShowRejectForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={() => handleReject(selectedSubmission?.submissionId || '')} variant="destructive">
                반려
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                승인 이력
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((h, index) => (
                  <div
                    key={h.historyId}
                    className="flex items-center gap-4 rounded-md border border-border p-3"
                  >
                    <span className="text-xs text-gray-500 w-8">#{index + 1}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      h.action === ApprovalAction.APPROVED ? 'bg-green-100 text-green-800' :
                      h.action === ApprovalAction.REJECTED ? 'bg-red-100 text-red-800' :
                      h.action === ApprovalAction.RESUBMITTED ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {actionLabels[h.action]}
                    </span>
                    <span className="text-sm">{h.actionBy}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(h.actionDate).toLocaleDateString('ko-KR')}
                    </span>
                    {h.previousStatus && h.newStatus && (
                      <span className="text-xs text-gray-600">
                        {h.previousStatus} → {h.newStatus}
                      </span>
                    )}
                    {h.reason && (
                      <span className="text-sm text-gray-600">- {h.reason}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">이력이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
