import { Star, Home, TrendingUp, AlertCircle, FileCheck } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Home className="h-6 w-6" />
            대시보드
            <span className="inline-flex items-center rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
              <Star className="mr-1 h-3 w-3 fill-current" />
              MVP
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            품질경영시스템 종합 현황
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">오늘의 검사건수</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">128</p>
            </div>
            <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/20">
              <FileCheck className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-xs text-success-600">
            <TrendingUp className="mr-1 h-3 w-3" />
            +12% 전일대비
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">부적합 발생</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
            <div className="rounded-lg bg-danger-100 p-2 dark:bg-danger-900/20">
              <AlertCircle className="h-5 w-5 text-danger-600 dark:text-danger-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">처리대기 2건</div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CAPA 진행중</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <div className="rounded-lg bg-warning-100 p-2 dark:bg-warning-900/20">
              <TrendingUp className="h-5 w-5 text-warning-600 dark:text-warning-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">완료예정 3건</div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">필드 클레임</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">3</p>
            </div>
            <div className="rounded-lg bg-info-100 p-2 dark:bg-info-900/20">
              <AlertCircle className="h-5 w-5 text-info-600 dark:text-info-400" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">이번달 신규</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">주요 메뉴 바로가기</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: '수입검사 (IQC)', href: '/inspection/iqc', color: 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' },
            { label: 'NCR 관리', href: '/nonconformance/ncr', color: 'bg-danger-50 text-danger-700 dark:bg-danger-900/20 dark:text-danger-300' },
            { label: '성적서발행', href: '/certificate/issue', color: 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-300' },
            { label: 'CAPA', href: '/capa', color: 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-300' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-lg p-4 text-center font-medium transition-opacity hover:opacity-80 ${item.color}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Placeholder for future widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">검사 현황</h2>
          <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-500">차트 영역 (추후 구현)</p>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">부적합 추이</h2>
          <div className="mt-4 flex h-48 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-500">차트 영역 (추후 구현)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
