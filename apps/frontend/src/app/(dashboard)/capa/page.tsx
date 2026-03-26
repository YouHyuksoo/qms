import { Star, Settings } from 'lucide-react';

export default function CapaPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6" />
            CAPA
            <span className="inline-flex items-center rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
              <Star className="mr-1 h-3 w-3 fill-current" />
              MVP
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Corrective Action & Preventive Action - 시정 및 예방 조치
          </p>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-warning-100 p-4 dark:bg-warning-900/20">
            <Settings className="h-8 w-8 text-warning-600 dark:text-warning-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            CAPA 관리
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
            품질 문제에 대한 근본 원인 분석 및 시정/예방 조치를 관리하는 기능이 이곳에 구현됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
