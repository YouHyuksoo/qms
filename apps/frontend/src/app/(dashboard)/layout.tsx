'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, MobileMenuButton } from '@/components/layout/sidebar';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import TabBar from '@/components/layout/tab-bar';

function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  const pathLabels: Record<string, { label: string; labelEn: string }> = {
    '': { label: '홈', labelEn: 'Home' },
    'inspection': { label: '검사관리', labelEn: 'Inspection' },
    'iqc': { label: '수입검사', labelEn: 'IQC' },
    'ipqc': { label: '공정검사', labelEn: 'IPQC' },
    'fqc': { label: '최종검사', labelEn: 'FQC' },
    'oqc': { label: '출하검사', labelEn: 'OQC' },
    'nonconformance': { label: '부적합관리', labelEn: 'Nonconformance' },
    'ncr': { label: 'NCR 관리', labelEn: 'NCR' },
    'mrb': { label: 'MRB 관리', labelEn: 'MRB' },
    'disposition': { label: '처분관리', labelEn: 'Disposition' },
    'certificate': { label: '성적서관리', labelEn: 'Certificate' },
    'issue': { label: '성적서발행', labelEn: 'Certificate Issue' },
    'template': { label: '템플릿관리', labelEn: 'Template' },
    'history': { label: '발행이력', labelEn: 'History' },
    'design-quality': { label: '개발품질', labelEn: 'Design Quality' },
    'apqp': { label: 'APQP', labelEn: 'APQP' },
    'ppap': { label: 'PPAP', labelEn: 'PPAP' },
    'dvp': { label: 'DVP&R', labelEn: 'DVP&R' },
    'fmea': { label: 'FMEA', labelEn: 'FMEA' },
    'msa': { label: 'MSA', labelEn: 'MSA' },
    'capa': { label: 'CAPA', labelEn: 'CAPA' },
    'traceability': { label: '추적성', labelEn: 'Traceability' },
    'equipment': { label: '계측기관리', labelEn: 'Equipment' },
    'hr': { label: '인적자원', labelEn: 'HR' },
    'supplier': { label: '공급업체', labelEn: 'Supplier' },
    'field-quality': { label: '필드품질', labelEn: 'Field Quality' },
    'complaint': { label: '클 레임관리', labelEn: 'Complaint' },
    'warranty': { label: '보증관리', labelEn: 'Warranty' },
    'field-analysis': { label: '필드분석', labelEn: 'Field Analysis' },
    'recall': { label: '리콜관리', labelEn: 'Recall' },
    'documents': { label: '문서관리', labelEn: 'Documents' },
    'audit': { label: '감사관리', labelEn: 'Audit' },
    'spc': { label: 'SPC', labelEn: 'SPC' },
    'master-data': { label: '기준정보', labelEn: 'Master Data' },
    'item': { label: '품목관리', labelEn: 'Item' },
    'customer': { label: '고객관리', labelEn: 'Customer' },
    'code': { label: '코드관리', labelEn: 'Code' },
  };

  const getBreadcrumbItems = () => {
    const items = [{ href: '/', label: '홈', labelEn: 'Home' }];
    
    let currentPath = '';
    paths.forEach((path) => {
      currentPath += `/${path}`;
      const labelInfo = pathLabels[path];
      if (labelInfo) {
        items.push({
          href: currentPath,
          label: labelInfo.label,
          labelEn: labelInfo.labelEn,
        });
      }
    });

    return items;
  };

  const items = getBreadcrumbItems();

  return (
    <nav className="flex items-center text-sm text-gray-600 dark:text-gray-400">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          )}
          {index === items.length - 1 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-primary-600 dark:hover:text-primary-400"
            >
              {index === 0 ? <Home className="h-4 w-4" /> : item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 shadow-sm">
          <div className="flex items-center gap-4">
            <MobileMenuButton onClick={() => setIsMobileSidebarOpen(true)} />
            <Breadcrumb />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>

        {/* Tab Bar */}
        <TabBar />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
