/**
 * @file bottom-cta.tsx
 * @description 랜딩페이지 하단 CTA 섹션 - 최종 전환 유도 영역
 * 초보자 가이드: 기능 소개 아래에 배치되는 최종 행동 유도 섹션.
 * 그라데이션 보더 카드 안에 제목, 설명, CTA 버튼을 포함한다.
 */
'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BottomCta() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-slate-950 dark:bg-slate-950 px-8 pb-32 pt-16 lg:px-16">
      {/* 배경 글로우 */}
      <div className="absolute bottom-1/4 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary-600/8 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* 그라데이션 보더 카드 */}
        <div className="rounded-3xl bg-linear-to-b from-slate-800/80 to-slate-900/80 p-px">
          <div className="rounded-3xl bg-slate-950 px-8 py-20 text-center sm:px-16">
            {/* 장식 도트 */}
            <div className="mb-8 flex items-center justify-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary-500" />
              <span className="h-1 w-8 rounded-full bg-linear-to-r from-primary-500 to-primary-500" />
              <span className="h-1 w-1 rounded-full bg-primary-500" />
            </div>

            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t('landing.bottomTitle')}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-400">
              {t('landing.bottomDesc')}
            </p>

            <div className="mt-10">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-primary-600 to-primary-500 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-primary-500/20 transition-all duration-300 hover:shadow-primary-500/40 hover:-translate-y-0.5"
              >
                {t('landing.ctaPrimary')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-600">
            &copy; 2026 QMS — Quality Management System
          </p>
        </div>
      </div>
    </section>
  );
}
