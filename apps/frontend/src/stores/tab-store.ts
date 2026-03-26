/**
 * @file src/stores/tab-store.ts
 * @description Zustand 기반 탭 상태 관리 스토어
 *
 * 초보자 가이드:
 * 1. **Tab**: 열린 페이지를 나타내는 탭 객체 (id, path, label, parentId)
 * 2. **pinned**: 고정 탭 (닫기 불가, 대시보드가 기본 고정)
 * 3. **persist**: localStorage에 탭 목록을 저장하여 새로고침 후에도 유지
 * 4. **최대 10개**: 탭이 10개 초과 시 가장 오래된 비고정 탭 자동 제거
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 탭 인터페이스 */
export interface Tab {
  /** 고유 ID (메뉴 아이템 id와 동일) */
  id: string;
  /** 라우트 경로 */
  path: string;
  /** 표시 라벨 (한국어) */
  label: string;
  /** 표시 라벨 (영어) */
  labelEn: string;
  /** 부모 메뉴 ID (아이콘 조회용) */
  parentId: string;
  /** 고정 탭 여부 */
  pinned?: boolean;
}

/** 최대 탭 수 */
const MAX_TABS = 10;

/** 기본 대시보드 탭 */
const DASHBOARD_TAB: Tab = {
  id: 'dashboard',
  path: '/',
  label: '대시보드',
  labelEn: 'Dashboard',
  parentId: 'dashboard',
  pinned: true,
};

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Omit<Tab, 'pinned'>) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  closeOtherTabs: (tabId: string) => void;
  closeAllTabs: () => void;
  syncActiveTabByPath: (pathname: string) => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [DASHBOARD_TAB],
      activeTabId: 'dashboard',

      addTab: (tab) => {
        const { tabs } = get();
        const existing = tabs.find((t) => t.id === tab.id);

        if (existing) {
          set({ activeTabId: existing.id });
          return;
        }

        let newTabs = [...tabs, { ...tab, pinned: false }];

        if (newTabs.length > MAX_TABS) {
          const unpinnedIndex = newTabs.findIndex((t) => !t.pinned);
          if (unpinnedIndex !== -1) {
            newTabs = newTabs.filter((_, i) => i !== unpinnedIndex);
          }
        }

        set({ tabs: newTabs, activeTabId: tab.id });
      },

      removeTab: (tabId) => {
        const { tabs, activeTabId } = get();
        const tab = tabs.find((t) => t.id === tabId);
        if (!tab || tab.pinned) return;

        const tabIndex = tabs.findIndex((t) => t.id === tabId);
        const newTabs = tabs.filter((t) => t.id !== tabId);

        if (activeTabId === tabId && newTabs.length > 0) {
          const nextTab =
            newTabs[tabIndex] || newTabs[tabIndex - 1] || newTabs[0];
          set({ tabs: newTabs, activeTabId: nextTab.id });
        } else {
          set({ tabs: newTabs });
        }
      },

      setActiveTab: (tabId) => {
        set({ activeTabId: tabId });
      },

      closeOtherTabs: (tabId) => {
        const { tabs } = get();
        const newTabs = tabs.filter((t) => t.id === tabId || t.pinned);
        set({ tabs: newTabs, activeTabId: tabId });
      },

      closeAllTabs: () => {
        const { tabs } = get();
        const pinnedTabs = tabs.filter((t) => t.pinned);
        const activeId = pinnedTabs.length > 0 ? pinnedTabs[0].id : null;
        set({ tabs: pinnedTabs, activeTabId: activeId });
      },

      syncActiveTabByPath: (pathname) => {
        const { tabs } = get();
        const matched = tabs.find((t) => t.path === pathname);
        if (matched) {
          set({ activeTabId: matched.id });
        }
      },
    }),
    {
      name: 'qms-tabs',
      partialize: (state) => ({
        tabs: state.tabs,
        activeTabId: state.activeTabId,
      }),
    }
  )
);
