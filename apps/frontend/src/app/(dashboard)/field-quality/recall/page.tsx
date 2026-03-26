'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Filter, X, TrendingUp, CheckCircle, Clock, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  RecallCampaign,
  RecallStatus,
  RecallRiskLevel,
} from '@/types/field-quality';
import { useRecallStore } from '@/stores';
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const statusColors = {
  [RecallStatus.PLANNED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  [RecallStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  [RecallStatus.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  [RecallStatus.CANCELLED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

const riskLevelColors = {
  [RecallRiskLevel.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [RecallRiskLevel.MEDIUM]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  [RecallRiskLevel.LOW]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const COLORS = ['#ef4444', '#f97316', '#22c55e', '#6b7280'];

// Mock data
const progressData = [
  { day: '1일', recalled: 50, cumulative: 50, target: 100 },
  { day: '2일', recalled: 80, cumulative: 130, target: 200 },
  { day: '3일', recalled: 120, cumulative: 250, target: 300 },
  { day: '4일', recalled: 90, cumulative: 340, target: 400 },
  { day: '5일', recalled: 110, cumulative: 450, target: 500 },
  { day: '6일', recalled: 100, cumulative: 550, target: 600 },
  { day: '7일', recalled: 150, cumulative: 700, target: 700 },
];

const riskData = [
  { name: 'HIGH', value: 2 },
  { name: 'MEDIUM', value: 5 },
  { name: 'LOW', value: 3 },
];

export default function RecallPage() {
  const { t } = useTranslation();
  const {
    campaigns,
    total,
    page,
    limit,
    isLoading,
    selectedCampaign,
    dashboard,
    statistics,
    setPage,
    setLimit,
    setSelectedCampaign,
    fetchCampaigns,
    createCampaign,
    updateProgress,
    fetchDashboard,
    completeRecall,
    fetchStatistics,
  } = useRecallStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [filters, setFilters] = useState({
    recallNo: '',
    itemCode: '',
    status: '',
    riskLevel: '',
    startDateFrom: '',
    startDateTo: '',
  });

  const [formData, setFormData] = useState({
    recallId: '',
    recallNo: '',
    recallName: '',
    itemCode: '',
    itemName: '',
    affectedLots: [] as string[],
    affectedQty: 0,
    reason: '',
    riskLevel: RecallRiskLevel.MEDIUM,
    startDate: new Date().toISOString().split('T')[0],
    targetCompletionDate: '',
    remarks: '',
  });

  const [progressDataForm, setProgressDataForm] = useState({
    progressId: '',
    reportDate: new Date().toISOString().split('T')[0],
    dailyRecalledQty: 0,
    dailyCost: 0,
    notes: '',
  });

  useEffect(() => {
    fetchCampaigns();
    fetchStatistics();
  }, [fetchCampaigns, fetchStatistics]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchCampaigns({ ...filters, page: 1 } as any);
  };

  const resetFilters = () => {
    setFilters({
      recallNo: '',
      itemCode: '',
      status: '',
      riskLevel: '',
      startDateFrom: '',
      startDateTo: '',
    });
    fetchCampaigns({ page: 1 });
  };

  const handleCreateCampaign = async () => {
    const success = await createCampaign(formData);
    if (success) {
      setShowForm(false);
      fetchCampaigns();
      setFormData({
        recallId: '',
        recallNo: '',
        recallName: '',
        itemCode: '',
        itemName: '',
        affectedLots: [],
        affectedQty: 0,
        reason: '',
        riskLevel: RecallRiskLevel.MEDIUM,
        startDate: new Date().toISOString().split('T')[0],
        targetCompletionDate: '',
        remarks: '',
      });
    }
  };

  const handleUpdateProgress = async () => {
    if (!selectedCampaign) return;
    const success = await updateProgress(selectedCampaign.recallId, progressDataForm);
    if (success) {
      setShowProgressForm(false);
      fetchCampaigns();
      if (showDashboard) {
        fetchDashboard(selectedCampaign.recallId);
      }
      setProgressDataForm({
        progressId: '',
        reportDate: new Date().toISOString().split('T')[0],
        dailyRecalledQty: 0,
        dailyCost: 0,
        notes: '',
      });
    }
  };

  const handleViewDashboard = async (campaign: RecallCampaign) => {
    await fetchDashboard(campaign.recallId);
    setSelectedCampaign(campaign);
    setShowDashboard(true);
  };

  const handleCompleteRecall = async () => {
    if (!selectedCampaign) return;
    const success = await completeRecall(selectedCampaign.recallId);
    if (success) {
      fetchCampaigns();
      if (showDashboard) {
        fetchDashboard(selectedCampaign.recallId);
      }
    }
  };

  const totalCost = campaigns.reduce((sum, c) => sum + Number(c.totalCost), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            리콜 관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            제품 리콜 관리 및 추적
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowStatistics(true)} variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            통계
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            리콜 등록
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">진행 중</p>
              <p className="text-2xl font-bold text-yellow-600">
                {campaigns.filter((c) => c.status === RecallStatus.IN_PROGRESS).length}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">완료</p>
              <p className="text-2xl font-bold text-green-600">
                {campaigns.filter((c) => c.status === RecallStatus.COMPLETED).length}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">총 영향 수량</p>
              <p className="text-2xl font-bold text-blue-600">
                {campaigns.reduce((sum, c) => sum + (c.affectedQty ?? 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">총 비용</p>
              <p className="text-2xl font-bold text-red-600">
                ₩{totalCost.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600" />
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
            <label className="text-xs text-gray-600 dark:text-gray-400">리콜 번호</label>
            <input
              type="text"
              value={filters.recallNo}
              onChange={(e) => handleFilterChange('recallNo', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="RCL-..."
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
              {Object.values(RecallStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-400">위험 등급</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(RecallRiskLevel).map((level) => (
                <option key={level} value={level}>
                  {level}
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

      {/* Campaigns Table */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">리콜 번호</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">리콜 명</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">품목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">영향 수량</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">위험 등급</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">상태</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">진행률</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    로딩 중...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr
                    key={campaign.recallId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 font-medium">{campaign.recallNo}</td>
                    <td className="px-4 py-3">{campaign.recallName}</td>
                    <td className="px-4 py-3">{campaign.itemName || campaign.itemCode}</td>
                    <td className="px-4 py-3">{(campaign.affectedQty ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${riskLevelColors[campaign.riskLevel]}`}>
                        {campaign.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[campaign.status]}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${campaign.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs">{campaign.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCampaign(campaign);
                            setShowDetail(true);
                          }}
                        >
                          상세
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleViewDashboard(campaign)}
                        >
                          대시보드
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

      {/* New Recall Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                리콜 캠페인 등록
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">리콜 ID *</label>
                <input
                  type="text"
                  value={formData.recallId}
                  onChange={(e) => setFormData({ ...formData, recallId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="REC-20240319-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">리콜 번호 *</label>
                <input
                  type="text"
                  value={formData.recallNo}
                  onChange={(e) => setFormData({ ...formData, recallNo: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="RCL-2024-001"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">리콜 명칭 *</label>
                <input
                  type="text"
                  value={formData.recallName}
                  onChange={(e) => setFormData({ ...formData, recallName: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="ABC 품목 안전 리콜"
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
                <label className="text-sm font-medium">영향 수량 *</label>
                <input
                  type="number"
                  value={formData.affectedQty}
                  onChange={(e) => setFormData({ ...formData, affectedQty: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">위험 등급</label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as RecallRiskLevel })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                >
                  {Object.values(RecallRiskLevel).map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">시작일 *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">목표 완료일 *</label>
                <input
                  type="date"
                  value={formData.targetCompletionDate}
                  onChange={(e) => setFormData({ ...formData, targetCompletionDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">리콜 사유 *</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="리콜 사유를 입력하세요"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreateCampaign}>등록</Button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Modal */}
      {showDashboard && selectedCampaign && dashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  리콜 진행 대시보드
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedCampaign.recallNo} - {selectedCampaign.recallName}
                </p>
              </div>
              <div className="flex gap-2">
                {selectedCampaign.status !== RecallStatus.COMPLETED && (
                  <>
                    <Button
                      onClick={() => setShowProgressForm(true)}
                      variant="outline"
                    >
                      진행 업데이트
                    </Button>
                    <Button onClick={handleCompleteRecall}>
                      리콜 완료
                    </Button>
                  </>
                )}
                <button onClick={() => setShowDashboard(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">영향 수량</p>
                <p className="text-2xl font-bold">{(selectedCampaign.affectedQty ?? 0).toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">회수 완료</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboard.progress.length > 0
                    ? dashboard.progress[dashboard.progress.length - 1].cumulativeRecalledQty.toLocaleString()
                    : 0}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">진행률</p>
                <p className="text-2xl font-bold text-blue-600">{selectedCampaign.completionRate}%</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">남은 일수</p>
                <p className="text-2xl font-bold text-yellow-600">{dashboard.summary.remainingDays}일</p>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="rounded-lg border border-border p-4">
              <h3 className="text-sm font-medium mb-4">진행 현황</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="cumulative" name="누적 회수" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="target" name="목표" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Progress Form Modal */}
      {showProgressForm && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                진행 상황 업데이트
              </h2>
              <button onClick={() => setShowProgressForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">진행 ID *</label>
                <input
                  type="text"
                  value={progressDataForm.progressId}
                  onChange={(e) => setProgressDataForm({ ...progressDataForm, progressId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="PRG-20240319-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">보고일 *</label>
                <input
                  type="date"
                  value={progressDataForm.reportDate}
                  onChange={(e) => setProgressDataForm({ ...progressDataForm, reportDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">당일 회수 수량 *</label>
                <input
                  type="number"
                  value={progressDataForm.dailyRecalledQty}
                  onChange={(e) => setProgressDataForm({ ...progressDataForm, dailyRecalledQty: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">당일 비용</label>
                <input
                  type="number"
                  value={progressDataForm.dailyCost}
                  onChange={(e) => setProgressDataForm({ ...progressDataForm, dailyCost: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">비고</label>
                <textarea
                  value={progressDataForm.notes}
                  onChange={(e) => setProgressDataForm({ ...progressDataForm, notes: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="특이사항 입력"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowProgressForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleUpdateProgress}>저장</Button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      {showStatistics && statistics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                리콜 통계
              </h2>
              <button onClick={() => setShowStatistics(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">총 리콜</p>
                <p className="text-2xl font-bold">{statistics.summary?.totalRecalls || 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">완료</p>
                <p className="text-2xl font-bold text-green-600">{statistics.summary?.completedRecalls || 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">진행 중</p>
                <p className="text-2xl font-bold text-yellow-600">{statistics.summary?.inProgressRecalls || 0}</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">평균 진행률</p>
                <p className="text-2xl font-bold text-blue-600">{statistics.summary?.averageCompletionRate || 0}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium mb-4">위험 등급별 분포</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium mb-4">월별 리콜</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={statistics.byMonth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="리콜 수" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
