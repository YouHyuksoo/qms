'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InspectionResult, ResultJudgment, CreateInspectionResultRequest } from '@/types';

interface InspectionResultInputProps {
  lotNo: string;
  results: CreateInspectionResultRequest[];
  onChange: (results: CreateInspectionResultRequest[]) => void;
}

/**
 * 검사 결과 입력 컴포넌트
 * 
 * 검사 특성별 결과를 입력하고 관리합니다.
 */
export function InspectionResultInput({
  lotNo,
  results,
  onChange,
}: InspectionResultInputProps) {
  const [nextSequence, setNextSequence] = useState(results.length + 1);

  const addResult = () => {
    const newResult: CreateInspectionResultRequest = {
      resultId: `${lotNo}-RES-${String(nextSequence).padStart(2, '0')}`,
      lotNo,
      characteristicName: '',
      sequenceNo: nextSequence,
    };
    onChange([...results, newResult]);
    setNextSequence(nextSequence + 1);
  };

  const updateResult = (index: number, updates: Partial<CreateInspectionResultRequest>) => {
    const updated = [...results];
    updated[index] = { ...updated[index], ...updates };

    // Auto-calculate judgment if measured value is provided
    if (updates.measuredValue !== undefined) {
      const result = updated[index];
      if (result.specMin !== undefined || result.specMax !== undefined) {
        const value = updates.measuredValue;
        const min = result.specMin;
        const max = result.specMax;

        let judgment: ResultJudgment = ResultJudgment.PASS;
        if (min !== undefined && value < min) {
          judgment = ResultJudgment.FAIL;
        } else if (max !== undefined && value > max) {
          judgment = ResultJudgment.FAIL;
        }
        updated[index].judgment = judgment;
      }
    }

    onChange(updated);
  };

  const removeResult = (index: number) => {
    const updated = results.filter((_, i) => i !== index);
    // Re-sequence
    updated.forEach((r, i) => {
      r.sequenceNo = i + 1;
      r.resultId = `${lotNo}-RES-${String(i + 1).padStart(2, '0')}`;
    });
    onChange(updated);
    setNextSequence(updated.length + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          검사 결과 입력
        </h4>
        <button
          type="button"
          onClick={addResult}
          className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300"
        >
          <Plus className="h-4 w-4" />
          특성 추가
        </button>
      </div>

      {results.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center">
          <p className="text-sm text-gray-500">
            검사 특성을 추가하여 결과를 입력하세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result, index) => (
            <ResultItem
              key={result.resultId}
              result={result}
              index={index}
              onUpdate={(updates) => updateResult(index, updates)}
              onRemove={() => removeResult(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ResultItemProps {
  result: CreateInspectionResultRequest;
  index: number;
  onUpdate: (updates: Partial<CreateInspectionResultRequest>) => void;
  onRemove: () => void;
}

function ResultItem({ result, index, onUpdate, onRemove }: ResultItemProps) {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          특성 #{index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Characteristic Name */}
        <div className="col-span-4 space-y-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            특성명
          </label>
          <input
            type="text"
            value={result.characteristicName}
            onChange={(e) => onUpdate({ characteristicName: e.target.value })}
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm focus:border-primary-500 focus:outline-hidden"
            placeholder="외관 (긁힘)"
          />
        </div>

        {/* Spec Min */}
        <div className="col-span-2 space-y-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            규격 하한
          </label>
          <input
            type="number"
            step="0.001"
            value={result.specMin ?? ''}
            onChange={(e) => onUpdate({ specMin: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm focus:border-primary-500 focus:outline-hidden"
            placeholder="10.0"
          />
        </div>

        {/* Spec Max */}
        <div className="col-span-2 space-y-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            규격 상한
          </label>
          <input
            type="number"
            step="0.001"
            value={result.specMax ?? ''}
            onChange={(e) => onUpdate({ specMax: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm focus:border-primary-500 focus:outline-hidden"
            placeholder="20.0"
          />
        </div>

        {/* Measured Value */}
        <div className="col-span-2 space-y-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            측정값
          </label>
          <input
            type="number"
            step="0.001"
            value={result.measuredValue ?? ''}
            onChange={(e) => onUpdate({ measuredValue: e.target.value ? parseFloat(e.target.value) : undefined })}
            className={cn(
              'w-full rounded-md border px-2 py-1.5 text-sm focus:outline-hidden',
              result.judgment === ResultJudgment.FAIL
                ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
                : result.judgment === ResultJudgment.PASS
                ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
                : 'border-border bg-surface'
            )}
            placeholder="15.5"
          />
        </div>

        {/* Judgment Indicator */}
        <div className="col-span-2 flex items-end justify-center pb-1.5">
          {result.judgment === ResultJudgment.PASS ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              합격
            </span>
          ) : result.judgment === ResultJudgment.FAIL ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
              <XCircle className="h-4 w-4" />
              불합격
            </span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {/* Inspection Method */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            검사 방법
          </label>
          <input
            type="text"
            value={result.inspectionMethod || ''}
            onChange={(e) => onUpdate({ inspectionMethod: e.target.value })}
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm focus:border-primary-500 focus:outline-hidden"
            placeholder="시각검사"
          />
        </div>

        {/* Remarks */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            비고
          </label>
          <input
            type="text"
            value={result.remarks || ''}
            onChange={(e) => onUpdate({ remarks: e.target.value })}
            className="w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm focus:border-primary-500 focus:outline-hidden"
            placeholder="참고사항"
          />
        </div>
      </div>
    </div>
  );
}
