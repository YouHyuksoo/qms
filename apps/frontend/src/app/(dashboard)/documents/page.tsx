import { FileStack } from 'lucide-react';

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileStack className="h-6 w-6" />
            문서관리
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
              UI Only
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            품질 문서 관리 및 결재
          </p>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <FileStack className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            문서관리
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
            품질 관련 문서의 작성, 검토, 승인 및 배포를 관리하는 기능이 이곳에 구현됩니다. (UI만 구현)
          </p>
        </div>
      </div>
    </div>
  );
}
