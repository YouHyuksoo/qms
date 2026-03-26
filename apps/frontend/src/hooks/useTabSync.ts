/**
 * @file src/hooks/useTabSync.ts
 * @description URL 변경 시 활성 탭을 동기화하는 훅
 *
 * 초보자 가이드:
 * 1. usePathname()으로 현재 URL 경로를 감지
 * 2. syncActiveTabByPath로 해당 경로의 탭을 활성화
 * 3. DashboardLayout에서 한 번만 호출하면 전체 앱에서 동기화됨
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTabStore } from '@/stores/tab-store';

export function useTabSync() {
  const pathname = usePathname();
  const syncActiveTabByPath = useTabStore((s) => s.syncActiveTabByPath);

  useEffect(() => {
    syncActiveTabByPath(pathname);
  }, [pathname, syncActiveTabByPath]);
}
