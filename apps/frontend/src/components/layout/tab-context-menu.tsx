/**
 * @file src/components/layout/tab-context-menu.tsx
 * @description 탭 우클릭 컨텍스트 메뉴 - 닫기/다른 탭 닫기/모든 탭 닫기
 *
 * 초보자 가이드:
 * 1. position: fixed로 마우스 좌표에 메뉴 표시
 * 2. pinned 탭은 "닫기" 비활성화
 * 3. 외부 클릭/ESC로 메뉴 자동 닫힘
 */
'use client';

import { useEffect, useCallback } from 'react';
import { useTabStore, type Tab } from '@/stores/tab-store';

interface TabContextMenuProps {
  tab: Tab;
  x: number;
  y: number;
  onClose: () => void;
}

export default function TabContextMenu({ tab, x, y, onClose }: TabContextMenuProps) {
  const { removeTab, closeOtherTabs, closeAllTabs } = useTabStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', onClose);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', onClose);
    };
  }, [handleKeyDown, onClose]);

  const menuItems = [
    {
      label: '닫기',
      disabled: !!tab.pinned,
      onClick: () => { removeTab(tab.id); onClose(); },
    },
    {
      label: '다른 탭 닫기',
      disabled: false,
      onClick: () => { closeOtherTabs(tab.id); onClose(); },
    },
    {
      label: '모든 탭 닫기',
      disabled: false,
      onClick: () => { closeAllTabs(); onClose(); },
    },
  ];

  return (
    <div
      className="fixed z-50 min-w-[160px] rounded-lg border border-border
        bg-popover p-1 shadow-md"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item) => (
        <button
          key={item.label}
          disabled={item.disabled}
          onClick={item.onClick}
          className="w-full text-left px-3 py-1.5 text-sm rounded-md
            transition-colors duration-150
            text-popover-foreground hover:bg-primary/10 hover:text-primary
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
