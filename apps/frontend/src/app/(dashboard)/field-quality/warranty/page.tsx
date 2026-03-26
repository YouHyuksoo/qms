'use client';

import { useState, useEffect } from 'react';
import { Shield, Plus, Filter, X, TrendingUp, AlertTriangle, DollarSign, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  WarrantyRecord,
  WarrantyStatus,
} from '@/types/field-quality';
import { useWarrantyStore } from '@/stores';
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
  AreaChart,
  Area,
} from 'recharts';

const statusColors = {
  [WarrantyStatus.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  [WarrantyStatus.CLAIMED]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [WarrantyStatus.EXPIRED]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  [WarrantyStatus.CANCELLED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

// Mock data for charts
const ppmTrendData = [
  { month: '1월', ppm: 120, claims: 12 },
  { month: '2월', ppm: 98, claims: 10 },
  { month: '3월', ppm: 86, claims: 9 },
  { month: '4월', ppm: 65, claims: 7 },
  { month: '5월', ppm: 45, claims: 5 },
  { month: '6월', ppm: 32, claims: 4 },
];

const costData = [
  { name: '수리비', value: 4500000 },
  { name: '교첵비', value: 3200000 },
  { name: '인걱비', value: 1800000 },
  { name: '울송비', value: 500000 },
];

export default function WarrantyPage() {
  const { t } = useTranslation();
  const {
    records,
    total,
    page,
    limit,
    isLoading,
    selectedRecord,
    expiringWarranties,
    setPage,
    setLimit,
    setSelectedRecord,
    fetchRecords,
    createRecord,
    recordClaim,
    fetchExpiringWarranties,
  } = useWarrantyStore();

  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showPpmDashboard, setShowPpmDashboard] = useState(false);
  const [filters, setFilters] = useState({
    warrantyNo: '',
    itemCode: '',
    customerCode: '',
    status: '',
    saleDateFrom: '',
    saleDateTo: '',
  });

  const [formData, setFormData] = useState({
    warrantyId: '',
    warrantyNo: '',
    itemCode: '',
    itemName: '',
    serialNo: '',
    saleDate: new Date().toISOString().split('T')[0],
    warrantyPeriodMonths: 12,
    customerCode: '',
    customerName: '',
    salesOrderNo: '',
    invoiceNo: '',
    remarks: '',
  });

  const [claimData, setClaimData] = useState({
    claimDate: new Date().toISOString().split('T')[0],
    failureDate: new Date().toISOString().split('T')[0],
    failureDescription: '',
    failurePart: '',
    failureCause: '',
    repairCost: 0,
    replacementCost: 0,
    laborCost: 0,
    shippingCost: 0,
    claimApprovedBy: '',
    remarks: '',
  });

  useEffect(() => {
    fetchRecords();
    fetchExpiringWarranties(30);
  }, [fetchRecords, fetchExpiringWarranties]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchRecords({ ...filters, page: 1 } as any);
  };

  const resetFilters = () => {
    setFilters({
      warrantyNo: '',
      itemCode: '',
      customerCode: '',
      status: '',
      saleDateFrom: '',
      saleDateTo: '',
    });
    fetchRecords({ page: 1 });
  };

  const handleCreateRecord = async () => {
    const success = await createRecord(formData);
    if (success) {
      setShowForm(false);
      fetchRecords();
      setFormData({
        warrantyId: '',
        warrantyNo: '',
        itemCode: '',
        itemName: '',
        serialNo: '',
        saleDate: new Date().toISOString().split('T')[0],
        warrantyPeriodMonths: 12,
        customerCode: '',
        customerName: '',
        salesOrderNo: '',
        invoiceNo: '',
        remarks: '',
      });
    }
  };

  const handleRecordClaim = async () => {
    if (!selectedRecord) return;
    const success = await recordClaim(selectedRecord.warrantyId, claimData);
    if (success) {
      setShowClaimForm(false);
      fetchRecords();
      setClaimData({
        claimDate: new Date().toISOString().split('T')[0],
        failureDate: new Date().toISOString().split('T')[0],
        failureDescription: '',
        failurePart: '',
        failureCause: '',
        repairCost: 0,
        replacementCost: 0,
        laborCost: 0,
        shippingCost: 0,
        claimApprovedBy: '',
        remarks: '',
      });
    }
  };

  const totalClaimCost = records
    .filter((r) => r.status === WarrantyStatus.CLAIMED)
    .reduce((sum, r) => sum + (r.totalCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Shield className="h-6 w-6" />
            보증 관리
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            보증 수리 및 클레임 관리
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowPpmDashboard(true)} variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            PPM 대시보드
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            보증 등록
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">유효 보증</p>
              <p className="text-2xl font-bold text-green-600">
                {records.filter((r) => r.status === WarrantyStatus.ACTIVE).length}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">보증 클레임</p>
              <p className="text-2xl font-bold text-red-600">
                {records.filter((r) => r.status === WarrantyStatus.CLAIMED).length}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">총 비용</p>
              <p className="text-2xl font-bold text-blue-600">
                ₩{totalClaimCost.toLocaleString()}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">만료 예정 (30일)</p>
              <p className="text-2xl font-bold text-yellow-600">
                {expiringWarranties.length}
              </p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Warranties Alert */}
      {expiringWarranties.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800 dark:text-yellow-400">
              만료 예정 보증 알림
            </h3>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            30일 이내에 만료되는 보증이 {expiringWarranties.length}건 있습니다.
          </p>
        </div>
      )}

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
            <label className="text-xs text-gray-600 dark:text-gray-400">보증 번호</label>
            <input
              type="text"
              value={filters.warrantyNo}
              onChange={(e) => handleFilterChange('warrantyNo', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              placeholder="WAR-..."
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
            <label className="text-xs text-gray-600 dark:text-gray-400">상태</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              <option value="">전체</option>
              {Object.values(WarrantyStatus).map((status) => (
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

      {/* Records Table */}
      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">보증 번호</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">품목</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">고객</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">판매일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">만료일</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">상태</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">비용</th>
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
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr
                    key={record.warrantyId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-3 font-medium">{record.warrantyNo}</td>
                    <td className="px-4 py-3">{record.itemName || record.itemCode}</td>
                    <td className="px-4 py-3">{record.customerName || record.customerCode}</td>
                    <td className="px-4 py-3">{record.saleDate}</td>
                    <td className="px-4 py-3">{record.warrantyExpiryDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {record.totalCost ? `₩${record.totalCost.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedRecord(record);
                            setShowDetail(true);
                          }}
                        >
                          상세
                        </Button>
                        {record.status === WarrantyStatus.ACTIVE && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowClaimForm(true);
                            }}
                          >
                            클레임
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

      {/* New Warranty Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                보증 등록
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">보증 ID *</label>
                <input
                  type="text"
                  value={formData.warrantyId}
                  onChange={(e) => setFormData({ ...formData, warrantyId: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="WAR-20240319-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">보증 번호 *</label>
                <input
                  type="text"
                  value={formData.warrantyNo}
                  onChange={(e) => setFormData({ ...formData, warrantyNo: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="WAR-2024-001"
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
                <label className="text-sm font-medium">판매일 *</label>
                <input
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">보증 기간 (월)</label>
                <input
                  type="number"
                  value={formData.warrantyPeriodMonths}
                  onChange={(e) => setFormData({ ...formData, warrantyPeriodMonths: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">고객 코드 *</label>
                <input
                  type="text"
                  value={formData.customerCode}
                  onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="CUST-001"
                />
              </div>
              <div>
                <label className="text-sm font-medium">고객명</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="ABC Electronics"
                />
              </div>
              <div>
                <label className="text-sm font-medium">주문 번호</label>
                <input
                  type="text"
                  value={formData.salesOrderNo}
                  onChange={(e) => setFormData({ ...formData, salesOrderNo: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="SO-2024-001"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleCreateRecord}>등록</Button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Form Modal */}
      {showClaimForm && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                보증 클레임 등록
              </h2>
              <button onClick={() => setShowClaimForm(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 rounded-md bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm">
                보증 번호: <strong>{selectedRecord.warrantyNo}</strong> | 
                품목: <strong>{selectedRecord.itemName || selectedRecord.itemCode}</strong> |
                고객: <strong>{selectedRecord.customerName || selectedRecord.customerCode}</strong>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">클레임 일자 *</label>
                <input
                  type="date"
                  value={claimData.claimDate}
                  onChange={(e) => setClaimData({ ...claimData, claimDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">고장 일자 *</label>
                <input
                  type="date"
                  value={claimData.failureDate}
                  onChange={(e) => setClaimData({ ...claimData, failureDate: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">고장 부위</label>
                <input
                  type="text"
                  value={claimData.failurePart}
                  onChange={(e) => setClaimData({ ...claimData, failurePart: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="모터"
                />
              </div>
              <div>
                <label className="text-sm font-medium">고장 원인</label>
                <input
                  type="text"
                  value={claimData.failureCause}
                  onChange={(e) => setClaimData({ ...claimData, failureCause: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="과열"
                />
              </div>
              <div>
                <label className="text-sm font-medium">수리 비용</label>
                <input
                  type="number"
                  value={claimData.repairCost}
                  onChange={(e) => setClaimData({ ...claimData, repairCost: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">교체 비용</label>
                <input
                  type="number"
                  value={claimData.replacementCost}
                  onChange={(e) => setClaimData({ ...claimData, replacementCost: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">인걱비</label>
                <input
                  type="number"
                  value={claimData.laborCost}
                  onChange={(e) => setClaimData({ ...claimData, laborCost: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">울송비</label>
                <input
                  type="number"
                  value={claimData.shippingCost}
                  onChange={(e) => setClaimData({ ...claimData, shippingCost: Number(e.target.value) })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">승인자</label>
                <input
                  type="text"
                  value={claimData.claimApprovedBy}
                  onChange={(e) => setClaimData({ ...claimData, claimApprovedBy: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="홍길동"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">고장 설명 *</label>
                <textarea
                  value={claimData.failureDescription}
                  onChange={(e) => setClaimData({ ...claimData, failureDescription: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2"
                  placeholder="고장 내용을 상세히 입력하세요"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => setShowClaimForm(false)} variant="outline">
                취소
              </Button>
              <Button onClick={handleRecordClaim}>클레임 등록</Button>
            </div>
          </div>
        </div>
      )}

      {/* PPM Dashboard Modal */}
      {showPpmDashboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                PPM 대시보드
              </h2>
              <button onClick={() => setShowPpmDashboard(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">현재 PPM</p>
                <p className="text-3xl font-bold text-blue-600">32</p>
                <p className="text-xs text-green-600">↓ 15% 감소</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">총 판매량</p>
                <p className="text-3xl font-bold text-green-600">12,450</p>
                <p className="text-xs text-gray-500">6개월 누적</p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">보증 클레임</p>
                <p className="text-3xl font-bold text-red-600">47</p>
                <p className="text-xs text-gray-500">6개월 누적</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium mb-4">PPM 추이</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={ppmTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="ppm" name="PPM" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="text-sm font-medium mb-4">비용 분석</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₩${Number(value).toLocaleString()}`} />
                    <Bar dataKey="value" name="비용" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
