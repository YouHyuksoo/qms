/**
 * @file page.tsx
 * @description QMS 랜딩페이지 - 메인 진입점
 * 초보자 가이드: 사이트에 처음 접속했을 때 보이는 페이지.
 * 히어로 섹션, 기능 소개 그리드, 하단 CTA 3개 섹션으로 구성된다.
 */
'use client';

import { HeroSection } from '@/components/landing/hero-section';
import { FeatureGrid } from '@/components/landing/feature-grid';
import { BottomCta } from '@/components/landing/bottom-cta';

export default function Home() {
  return (
    <main className="landing-page">
      <HeroSection />
      <FeatureGrid />
      <BottomCta />
    </main>
  );
}
