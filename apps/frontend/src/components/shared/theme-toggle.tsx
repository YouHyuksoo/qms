/**
 * @file theme-toggle.tsx
 * @description 테마 전환 토글 버튼 (Light / Dark / System)
 * 초보자 가이드: next-themes를 사용하여 라이트/다크/시스템 테마를 전환한다.
 * mounted 체크로 hydration mismatch를 방지한다.
 */
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-md border border-border p-1">
        <div className="h-8 w-8" />
        <div className="h-8 w-8" />
        <div className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-md border border-border p-1">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme('light')}
        title="Light"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme('dark')}
        title="Dark"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => setTheme('system')}
        title="System"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
