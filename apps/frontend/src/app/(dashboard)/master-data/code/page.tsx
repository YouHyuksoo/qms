import { Star, Database } from 'lucide-react';

export default function CodePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="h-6 w-6" />
            코드관리
            <span className="inline-flex items-center rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
              <Star className="mr-1 h-3 w-3 fill-current" />
              MVP
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            시스템 공통 코드 관리
          </p>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary-100 p-4 dark:bg-primary-900/20">
            <Database className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            코드관리
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
            시스템에서 사용하는 공통 코드(불량유형, 처리방법 등)를 관리하는 기능이 이곳에 구현됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
