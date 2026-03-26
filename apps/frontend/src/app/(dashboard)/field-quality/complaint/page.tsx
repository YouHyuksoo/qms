'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Plus, Filter, X, AlertCircle, Clock, CheckCircle, Star, TrendingUp, Activity } from 'lucide-react';
import { useComplaintStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { CustomerComplaint, ComplaintStatus, ComplaintSeverity, ComplaintType } from '@/types/field-quality';

// Severity badge component
const SeverityBadge = ({ severity }: { severity?: ComplaintSeverity }) => {
  const config = {
    [ComplaintSeverity.CRITICAL]: { bg: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', label: '심각' },
    [ComplaintSeverity.MAJOR]: { bg: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', label: '주요' },
    [ComplaintSeverity.MINOR]: { bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: '경미' },
  };
  const style = severity ? config[severity] : { bg: 'bg-gray-100 text-gray-700', label: '-' };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style.bg}`}>
      {style.label}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  const config = {
    [ComplaintStatus.RECEIVED]: { bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', label: '접수' },
    [ComplaintStatus.UNDER_INVESTIGATION]: { bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: '조사중' },
    [ComplaintStatus.ACTION_PLANNED]: { bg: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: '대책수립' },
    [ComplaintStatus.RESOLVED]: { bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', label: '해결' },
    [ComplaintStatus.CLOSED]: { bg: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', label: '종결' },
  };
  const style = config[status];
  
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style.bg}`}>
      {style.label}
    </span>
  );
};

export default function ComplaintPage() {
  const { t } = useTranslation();
  const {
    complaints,
    total,
    page,
    limit,
    isLoading,
    selectedComplaint,
    fetchComplaints,
    createComplaint,
    resolveComplaint,
    closeComplaint,
    setSelectedComplaint,
    setPage,
  } = useComplaintStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [resolution, setResolution] = useState('');
  const [satisfactionScore, setSatisfactionScore] = useState(5);
  const [filters, setFilters] = useState({
    customerCode: '',
    itemCode: '',
    status: '',
    severity: '',
    receiptDateFrom: '',
    receiptDateTo: '',
  });

  const [formData, setFormData] = useState<Partial<CustomerComplaint>>({
    complaintId: '',
    complaintNo: '',
    customerCode: '',
    receiptDate: new Date().toISOString().split('T')[0],
    complaintType: ComplaintType.QUALITY,
    severity: ComplaintSeverity.MAJOR,
    description: '',
    defectQty: 0,
  });

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchComplaints({ ...filters, page: 1 } as any);
  };

  const resetFilters = () => {
    setFilters({
      customerCode: '',
      itemCode: '',
      status: '',
      severity: '',
      receiptDateFrom: '',
      receiptDateTo: '',
    });
    fetchComplaints({ page: 1 });
  };

  const handleCreateComplaint = async () => {
    const complaintId = `COMP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const complaintNo = `CLM-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const result = await createComplaint({
      ...formData,
      complaintId,
      complaintNo,
    });
    
    if (result) {
      setShowForm(false);
      setFormData({
        complaintId: '',
        complaintNo: '',
        customerCode: '',
        receiptDate: new Date().toISOString().split('T')[0],
        complaintType: ComplaintType.QUALITY,
        severity: ComplaintSeverity.MAJOR,
        description: '',
        defectQty: 0,
      });
    }
  };

  const handleResolve = async () => {
    if (!selectedComplaint) return;
    const success = await resolveComplaint(selectedComplaint.complaintId, resolution);
    if (success) {
      setResolution('');
      setShowDetail(false);
    }
  };

  const handleClose = async () => {
    if (!selectedComplaint) return;
    const success = await closeComplaint(selectedComplaint.complaintId, satisfactionScore);
    if (success) {
      setShowDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Phone className="h-6 w-6" />
            클레임관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            고객 클레임 접수 및 처리 관리
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTrends(true)} className="gap-2">
            <TrendingUp className="h-4 w-4" />
            트렌드 분석
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            클레임 접수
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">미처리 클레임</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {complaints.filter(c => c.status === ComplaintStatus.RECEIVED || c.status === ComplaintStatus.UNDER_INVESTIGATION).length}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">평균 처리시간</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {Math.round(complaints.reduce((sum, c) => sum + (c.responseTimeHours || 0), 0) / complaints.filter(c => c.responseTimeHours).length || 0)}시간
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">처리 완료율</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {complaints.length > 0 ? Math.round((complaints.filter(c => c.status === ComplaintStatus.CLOSED).length / complaints.length) * 100) : 0}%
          </p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">평균 만족도</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {(complaints.filter(c => c.satisfactionScore).reduce((sum, c) => sum + (c.satisfactionScore || 0), 0) / complaints.filter(c => c.satisfactionScore).length || 0).toFixed(1)}/5
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">검색 필터</span>
        </div>
        <div className="grid grid-cols-6 gap-4">
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">고객 코드</label>
            <input
              type="text"
              value={filters.customerCode}
              onChange={(e) => handleFilterChange('customerCode', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="CUST-..."
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
            <label className="text-xs text-gray-600 dark:text-gray-400">상태</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(ComplaintStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">심각도</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(ComplaintSeverity).map((severity) => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">접수일 (부터)</label>
            <input
              type="date"
              value={filters.receiptDateFrom}
              onChange={(e) => handleFilterChange('receiptDateFrom', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={applyFilters} variant="default" className="flex-1">검색</Button>
            <Button onClick={resetFilters} variant="outline">초기화</Button>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">클레임번호</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">고객</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">품목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">유형</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">심각도</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">상태</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">접수일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">처리시간</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">로딩중...</td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">데이터가 없습니다</td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr
                    key={complaint.complaintId}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setShowDetail(true);
                    }}
                  >
                    <td className="px-4 py-3 font-medium">{complaint.complaintNo}</td>
                    <td className="px-4 py-3">{complaint.customerName || complaint.customerCode}</td>
                    <td className="px-4 py-3">{complaint.itemName || complaint.itemCode || '-'}</td>
                    <td className="px-4 py-3">{complaint.complaintType}</td>
                    <td className="px-4 py-3"><SeverityBadge severity={complaint.severity} /></td>
                    <td className="px-4 py-3"><StatusBadge status={complaint.status} /></td>
                    <td className="px-4 py-3">{complaint.receiptDate}</td>
                    <td className="px-4 py-3">
                      {complaint.responseTimeHours ? `${complaint.responseTimeHours}시간` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            총 {total}건
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
              {page} / {Math.ceil(total / limit)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(total / limit)}
            >
              다음
            </Button>
          </div>
        </div>
      </div>

      {/* New Complaint Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">새 클레임 접수</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">고객 코드 *</label>
                  <input
                    type="text"
                    value={formData.customerCode}
                    onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">접수일 *</label>
                  <input
                    type="date"
                    value={formData.receiptDate}
                    onChange={(e) => setFormData({ ...formData, receiptDate: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">클레임 유형</label>
                  <select
                    value={formData.complaintType}
                    onChange={(e) => setFormData({ ...formData, complaintType: e.target.value as ComplaintType })}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  >
                    {Object.values(ComplaintType).map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">심각도</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as ComplaintSeverity })}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  >
                    {Object.values(ComplaintSeverity).map((severity) => (
                      <option key={severity} value={severity}>{severity}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400">클레임 내용 *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>취소</Button>
                <Button onClick={handleCreateComplaint}>저장</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">클레임 상세</h2>
                <p className="text-sm text-gray-500">{selectedComplaint.complaintNo}</p>
              </div>
              <button onClick={() => setShowDetail(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                <div>
                  <span className="text-xs text-gray-500">고객</span>
                  <p className="font-medium">{selectedComplaint.customerName || selectedComplaint.customerCode}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">품목</span>
                  <p className="font-medium">{selectedComplaint.itemName || selectedComplaint.itemCode || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">상태</span>
                  <p className="font-medium"><StatusBadge status={selectedComplaint.status} /></p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">클레임 내용</span>
                <p className="mt-1 rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-800">{selectedComplaint.description}</p>
              </div>
              {selectedComplaint.status === ComplaintStatus.UNDER_INVESTIGATION && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">해결책</label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                    placeholder="해결책을 입력하세요..."
                  />
                  <Button onClick={handleResolve} className="mt-2">해결로 변경</Button>
                </div>
              )}
              {selectedComplaint.status === ComplaintStatus.RESOLVED && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">만족도 점수 (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={satisfactionScore}
                    onChange={(e) => setSatisfactionScore(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  />
                  <Button onClick={handleClose} className="mt-2">종결</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
