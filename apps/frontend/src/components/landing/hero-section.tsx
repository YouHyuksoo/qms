/**
 * @file hero-section.tsx
 * @description 랜딩페이지 히어로 섹션 - 메인 비주얼, CTA, 통계 바 포함
 * 초보자 가이드: 랜딩페이지 최상단 영역. 그라데이션 배경 + 타이틀 애니메이션 + 통계 수치를 표시한다.
 */
'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

/** 통계 데이터 항목 */
const STATS = [
  { key: 'statsDefect', value: '47%', icon: '↓' },
  { key: 'statsResponse', value: '3.2×', icon: '⚡' },
  { key: 'statsProcess', value: '85%', icon: '⚙' },
  { key: 'statsCompliance', value: '99.7%', icon: '✓' },
] as const;

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 dark:bg-slate-950">
      {/* 배경 그리드 패턴 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.03)_1px,transparent_1px)] bg-size-[72px_72px]" />

      {/* 배경 그라데이션 오브 */}
      <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-[128px]" />
      <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-primary-600/8 blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[80px]" />

      {/* 네비게이션 바 */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 lg:px-16">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-lg shadow-primary-500/25">
            <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">QMS</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>

      {/* 히어로 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-5xl px-8 pt-24 text-center lg:pt-32">
        {/* 뱃지 */}
        <div className="landing-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-sm text-primary-300">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse" />
          {t('landing.badge')}
        </div>

        {/* 메인 타이틀 */}
        <h1 className="landing-fade-in landing-delay-1 font-display text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
          {t('landing.heroTitle1')}
          <br />
          <span className="bg-linear-to-r from-primary-500 via-primary-400 to-cyan-400 bg-clip-text text-transparent">
            {t('landing.heroTitle2')}
          </span>
        </h1>

        {/* 설명 */}
        <p className="landing-fade-in landing-delay-2 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
          {t('landing.heroDesc')}
        </p>

        {/* CTA 버튼 */}
        <div className="landing-fade-in landing-delay-3 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-primary-500/25 transition-all duration-300 hover:bg-primary-500 hover:shadow-primary-500/40 hover:-translate-y-0.5"
          >
            {t('landing.ctaPrimary')}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-base font-medium text-slate-300 backdrop-blur-xs transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            {t('landing.ctaSecondary')}
          </a>
        </div>

        {/* 장식 라인 */}
        <div className="landing-fade-in landing-delay-4 mx-auto mt-20 h-px w-full max-w-3xl bg-linear-to-r from-transparent via-slate-700 to-transparent" />

        {/* 통계 바 */}
        <div className="landing-fade-in landing-delay-4 mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 pb-16 sm:grid-cols-4">
          {STATS.map(({ key, value, icon }) => (
            <div key={key} className="group text-center">
              <div className="text-3xl font-bold text-white font-display transition-colors group-hover:text-primary-400">
                <span className="mr-1 text-lg text-primary-500">{icon}</span>
                {value}
              </div>
              <div className="mt-1 text-sm text-slate-500">{t(`landing.${key}`)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 페이드 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-slate-950 to-transparent" />
    </section>
  );
}
