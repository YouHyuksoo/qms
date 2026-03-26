import { Star, FileText } from 'lucide-react';

export default function CertificateHistoryPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6" />
            발행이력
            <span className="inline-flex items-center rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
              <Star className="mr-1 h-3 w-3 fill-current" />
              MVP
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            성적서 발행 이력 조회 및 관리
          </p>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="rounded-lg border border-border bg-surface p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-success-100 p-4 dark:bg-success-900/20">
            <FileText className="h-8 w-8 text-success-600 dark:text-success-400" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            발행이력
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
            발행된 성적서의 이력을 조회하고 재발행, 폐기 등을 관리하는 기능이 이곳에 구현됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
