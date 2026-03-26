/**
 * @file src/components/layout/tab-bar.tsx
 * @description 앱 내 탭 바 - 열린 페이지 탭 목록, 클릭으로 페이지 이동
 *
 * 초보자 가이드:
 * 1. 헤더 아래에 고정, 스크롤해도 항상 보임
 * 2. 탭이 많으면 좌우 화살표 + 휠 스크롤
 * 3. 우클릭 시 컨텍스트 메뉴 (닫기, 다른 탭 닫기, 모든 탭 닫기)
 * 4. pinned 탭은 닫기 버튼 없음 (대시보드)
 */
'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTabStore, type Tab } from '@/stores/tab-store';
import { useTabSync } from '@/hooks/useTabSync';
import TabContextMenu from './tab-context-menu';

const SCROLL_AMOUNT = 200;

export default function TabBar() {
  const router = useRouter();
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [ctxMenu, setCtxMenu] = useState<{ tab: Tab; x: number; y: number } | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useTabSync();

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateArrows();
  }, [tabs, updateArrows]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows);
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scrollLeftFn = () => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const scrollRightFn = () => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id);
    router.push(tab.path);
  };

  const handleContextMenu = (e: React.MouseEvent, tab: Tab) => {
    e.preventDefault();
    setCtxMenu({ tab, x: e.clientX, y: e.clientY });
  };

  const handleClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    const { tabs: currentTabs, activeTabId: currentActive } = useTabStore.getState();
    const closedTab = currentTabs.find((t) => t.id === tabId);
    if (closedTab && !closedTab.pinned) {
      const tabIndex = currentTabs.findIndex((t) => t.id === tabId);
      const newTabs = currentTabs.filter((t) => t.id !== tabId);
      if (currentActive === tabId && newTabs.length > 0) {
        const nextTab = newTabs[tabIndex] || newTabs[tabIndex - 1] || newTabs[0];
        router.push(nextTab.path);
      }
    }
    removeTab(tabId);
  };

  if (tabs.length === 0) return null;

  return (
    <>
      <div
        className="flex-shrink-0 z-[25] hidden lg:flex
          items-center bg-background border-b border-border relative h-9"
      >
        {showLeftArrow && (
          <button
            onClick={scrollLeftFn}
            className="absolute left-0 z-10 h-full px-1
              bg-background/90 border-r border-border
              hover:bg-muted/60 transition-colors
              flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        )}

        <div
          ref={scrollRef}
          onWheel={handleWheel}
          className="flex items-center h-full overflow-x-auto scrollbar-hide flex-1"
          style={{
            paddingLeft: showLeftArrow ? 24 : 0,
            paddingRight: showRightArrow ? 24 : 0,
          }}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                onContextMenu={(e) => handleContextMenu(e, tab)}
                title={tab.pinned ? '고정 탭 (닫기 불가)' : tab.label}
                className={`group relative flex items-center gap-1.5 px-3 h-full
                  text-sm font-medium whitespace-nowrap transition-colors duration-150
                  border-b-2 shrink-0
                  ${isActive
                    ? 'border-primary text-primary bg-background'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <span>{tab.label}</span>

                {!tab.pinned && (
                  <span
                    onClick={(e) => handleClose(e, tab.id)}
                    className="ml-1 p-0.5 rounded-sm opacity-0 group-hover:opacity-100
                      hover:bg-destructive/10 hover:text-destructive
                      transition-opacity duration-150"
                  >
                    <X className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {showRightArrow && (
          <button
            onClick={scrollRightFn}
            className="absolute right-0 z-10 h-full px-1
              bg-background/90 border-l border-border
              hover:bg-muted/60 transition-colors
              flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {ctxMenu && (
        <TabContextMenu
          tab={ctxMenu.tab}
          x={ctxMenu.x}
          y={ctxMenu.y}
          onClose={() => setCtxMenu(null)}
        />
      )}
    </>
  );
}
