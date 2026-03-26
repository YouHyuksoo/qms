/**
 * @file feature-grid.tsx
 * @description 랜딩페이지 기능 소개 그리드 섹션
 * 초보자 가이드: QMS의 6가지 핵심 모듈을 카드 형태로 소개하는 영역.
 * 각 카드에 아이콘, 제목, 설명을 포함하며 호버 시 인터랙션이 있다.
 */
'use client';

import { useTranslation } from 'react-i18next';
import {
  ClipboardCheck,
  AlertTriangle,
  RefreshCcw,
  Target,
  FileCheck2,
  ScrollText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** 기능 카드 데이터 */
interface FeatureItem {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  accent: string;
  glow: string;
}

const FEATURES: FeatureItem[] = [
  {
    titleKey: 'featureIqc',
    descKey: 'featureIqcDesc',
    icon: ClipboardCheck,
    accent: 'text-emerald-400',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  {
    titleKey: 'featureNcr',
    descKey: 'featureNcrDesc',
    icon: AlertTriangle,
    accent: 'text-amber-400',
    glow: 'group-hover:shadow-amber-500/10',
  },
  {
    titleKey: 'featureCapa',
    descKey: 'featureCapaDesc',
    icon: RefreshCcw,
    accent: 'text-sky-400',
    glow: 'group-hover:shadow-sky-500/10',
  },
  {
    titleKey: 'featureApqp',
    descKey: 'featureApqpDesc',
    icon: Target,
    accent: 'text-violet-400',
    glow: 'group-hover:shadow-violet-500/10',
  },
  {
    titleKey: 'featurePpap',
    descKey: 'featurePpapDesc',
    icon: FileCheck2,
    accent: 'text-primary-400',
    glow: 'group-hover:shadow-primary-500/10',
  },
  {
    titleKey: 'featureCert',
    descKey: 'featureCertDesc',
    icon: ScrollText,
    accent: 'text-primary-400',
    glow: 'group-hover:shadow-primary-500/10',
  },
];

export function FeatureGrid() {
  const { t } = useTranslation();

  return (
    <section
      id="features"
      className="relative bg-slate-950 dark:bg-slate-950 py-32 px-8 lg:px-16"
    >
      {/* 배경 그라데이션 */}
      <div className="absolute right-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary-600/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* 섹션 헤더 */}
        <div className="mb-20 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white lg:text-5xl">
            {t('landing.featuresTitle')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            {t('landing.featuresDesc')}
          </p>
        </div>

        {/* 기능 카드 그리드 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ titleKey, descKey, icon: Icon, accent, glow }, i) => (
            <div
              key={titleKey}
              className={`group relative rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xs transition-all duration-500 hover:border-slate-700 hover:bg-slate-900/80 hover:-translate-y-1 hover:shadow-2xl ${glow}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* 카드 상단 장식 라인 */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* 아이콘 */}
              <div className={`mb-5 inline-flex rounded-xl border border-slate-800 bg-slate-800/50 p-3 ${accent} transition-colors duration-300`}>
                <Icon className="h-6 w-6" strokeWidth={1.5} />
              </div>

              {/* 제목 */}
              <h3 className="mb-3 font-display text-lg font-semibold text-white">
                {t(`landing.${titleKey}`)}
              </h3>

              {/* 설명 */}
              <p className="text-sm leading-relaxed text-slate-400">
                {t(`landing.${descKey}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
