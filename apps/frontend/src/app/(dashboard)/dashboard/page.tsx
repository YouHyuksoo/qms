/**
 * @file page.tsx
 * @description QMS 메인 대시보드 - 품질경영 핵심 KPI와 현황을 한눈에 보여주는 페이지
 * 초보자 가이드: 로그인 후 가장 먼저 보는 화면. 품질 현황 요약, 미처리 건수, 최근 활동 등을 표시한다.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardCheck,
  AlertTriangle,
  RefreshCcw,
  FileCheck2,
  Target,
  Wrench,
  TrendingDown,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';

/** KPI 카드 데이터 타입 */
interface KpiCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  href: string;
  color: string;
}

/** 최근 활동 타입 */
interface RecentActivity {
  id: string;
  type: string;
  title: string;
  status: string;
  time: string;
  href: string;
}

/** 데모용 KPI 데이터 */
const KPI_DATA: KpiCard[] = [
  {
    title: '수입검사 합격률',
    value: '97.3%',
    change: '+1.2%',
    trend: 'up',
    icon: <ClipboardCheck className="h-6 w-6" />,
    href: '/inspection/iqc',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    title: '미처리 NCR',
    value: '12건',
    change: '-3건',
    trend: 'down',
    icon: <AlertTriangle className="h-6 w-6" />,
    href: '/nonconformance/ncr',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    title: '진행중 CAPA',
    value: '8건',
    change: '+2건',
    trend: 'up',
    icon: <RefreshCcw className="h-6 w-6" />,
    href: '/capa',
    color: 'text-sky-600 dark:text-sky-400',
  },
  {
    title: 'PPAP 승인 대기',
    value: '3건',
    change: '0건',
    trend: 'neutral',
    icon: <FileCheck2 className="h-6 w-6" />,
    href: '/design-quality/ppap',
    color: 'text-violet-600 dark:text-violet-400',
  },
  {
    title: 'APQP 진행중',
    value: '5건',
    change: '+1건',
    trend: 'up',
    icon: <Target className="h-6 w-6" />,
    href: '/design-quality/apqp',
    color: 'text-pink-600 dark:text-pink-400',
  },
  {
    title: '교정 예정 계측기',
    value: '7대',
    change: '30일 내',
    trend: 'neutral',
    icon: <Wrench className="h-6 w-6" />,
    href: '/equipment',
    color: 'text-pink-600 dark:text-pink-400',
  },
];

/** 데모용 최근 활동 */
const RECENT_ACTIVITIES: RecentActivity[] = [
  { id: '1', type: 'NCR', title: 'NCR-2026-0312 — 치수 불량 (A사 납품분)', status: '조사중', time: '2시간 전', href: '/nonconformance/ncr' },
  { id: '2', type: 'IQC', title: 'IQC-2026-0415 — 원자재 입고검사 완료', status: '합격', time: '3시간 전', href: '/inspection/iqc' },
  { id: '3', type: 'CAPA', title: 'CAPA-2026-0089 — 공정 온도 편차 시정조치', status: '실행중', time: '5시간 전', href: '/capa' },
  { id: '4', type: 'PPAP', title: 'PPAP-2026-0023 — B사 신규부품 승인 제출', status: '대기', time: '1일 전', href: '/design-quality/ppap' },
  { id: '5', type: 'SCAR', title: 'SCAR-2026-0011 — C사 납기 지연 시정요구', status: '발행', time: '1일 전', href: '/supplier' },
];

/** 상태 뱃지 색상 */
function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    '합격': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    '조사중': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    '실행중': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    '대기': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    '발행': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  };
  return map[status] ?? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          품질경영 대시보드
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          QMS 핵심 품질 지표와 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* KPI 카드 그리드 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KPI_DATA.map((kpi) => (
          <Link
            key={kpi.title}
            href={kpi.href}
            className="group rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600"
          >
            <div className="flex items-start justify-between">
              <div className={kpi.color}>{kpi.icon}</div>
              <div className="flex items-center gap-1 text-sm">
                {kpi.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                {kpi.trend === 'down' && <TrendingDown className="h-4 w-4 text-sky-500" />}
                {kpi.trend === 'neutral' && <Clock className="h-4 w-4 text-gray-400" />}
                <span className="text-gray-500 dark:text-gray-400">{kpi.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kpi.value}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{kpi.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 최근 활동 */}
      <div className="rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">최근 활동</h2>
        </div>
        <div className="divide-y divide-border">
          {RECENT_ACTIVITIES.map((activity) => (
            <Link
              key={activity.id}
              href={activity.href}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {activity.type}
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">{activity.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
                <span className="text-xs text-gray-400">{activity.time}</span>
                <ArrowRight className="h-4 w-4 text-gray-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
