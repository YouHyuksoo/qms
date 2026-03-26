'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { InspectionLot } from '@/types';
import { JudgmentBadge } from './judgment-badge';
import { StatusBadge } from './status-badge';

interface InspectionTableProps {
  data: InspectionLot[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRowClick?: (lot: InspectionLot) => void;
  isLoading?: boolean;
}

/**
 * 검사 로트 테이블 컴포넌트
 * 
 * TanStack Table을 사용하여 검사 로트 목록을 표시합니다.
 */
export function InspectionTable({
  data,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onRowClick,
  isLoading,
}: InspectionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    {
      accessorKey: 'lotNo',
      header: '로트 번호',
      size: 150,
    },
    {
      accessorKey: 'itemCode',
      header: '품목코드',
      size: 120,
    },
    {
      accessorKey: 'itemName',
      header: '품목명',
      size: 200,
    },
    {
      accessorKey: 'inspectionDate',
      header: '검사일',
      size: 110,
      cell: ({ getValue }: { getValue: () => string | undefined }) => {
        const date = getValue();
        return date ? new Date(date).toLocaleDateString('ko-KR') : '-';
      },
    },
    {
      accessorKey: 'inspector',
      header: '검사자',
      size: 100,
    },
    {
      accessorKey: 'lotQty',
      header: '수량',
      size: 80,
      cell: ({ getValue }: { getValue: () => number | undefined }) => {
        const qty = getValue();
        return qty?.toLocaleString() ?? '-';
      },
    },
    {
      accessorKey: 'judgment',
      header: '판정',
      size: 100,
      cell: ({ getValue }: { getValue: () => string | undefined }) => {
        return <JudgmentBadge judgment={getValue() as any} />;
      },
    },
    {
      accessorKey: 'status',
      header: '상태',
      size: 100,
      cell: ({ getValue }: { getValue: () => string }) => {
        return <StatusBadge status={getValue() as any} />;
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / limit),
  });

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className={cn(
                            'flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100',
                            header.column.getCanSort() && 'cursor-pointer'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          disabled={!header.column.getCanSort()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-1">
                              {header.column.getIsSorted() === 'asc' ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3 text-gray-400" />
                              )}
                            </span>
                          )}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                      불러오는 중...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-gray-900 dark:text-gray-100"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>페이지당</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded border border-border bg-surface px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>개</span>
          <span className="ml-4">
            총 {total.toLocaleString()}개 중 {(page - 1) * limit + 1} -
            {Math.min(page * limit, total)}개
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-2 text-sm text-gray-600 dark:text-gray-400">
            {page} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
