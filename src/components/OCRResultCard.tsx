import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data/mockData';
import { OCRExtractionResult } from '../types';

interface OCRResultCardProps {
  result: OCRExtractionResult;
  onChangeField: (key: keyof OCRExtractionResult, value: string) => void;
  confirmed: boolean;
  onToggleConfirm: (checked: boolean) => void;
  onSave: () => void;
}

const FIELD_META: Array<{
  key: keyof OCRExtractionResult;
  label: string;
  type: 'text' | 'date' | 'number' | 'select';
}> = [
  { key: 'productName', label: 'Product Name', type: 'text' },
  { key: 'brand', label: 'Brand', type: 'text' },
  { key: 'category', label: 'Category', type: 'select' },
  { key: 'purchaseDate', label: 'Purchase Date', type: 'date' },
  { key: 'price', label: 'Purchase Price (USD)', type: 'number' },
  { key: 'invoiceNumber', label: 'Invoice Number', type: 'text' },
  { key: 'retailerName', label: 'Retailer Name', type: 'text' },
  { key: 'warrantyDurationMonths', label: 'Warranty Duration (Months)', type: 'number' },
];

export function OCRResultCard({
  result,
  onChangeField,
  confirmed,
  onToggleConfirm,
  onSave,
}: OCRResultCardProps) {
  const lowConfidenceCount = Object.values(result).filter((f) => f.confidence < 80).length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Simulated Extraction Results
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Review and edit any field before saving to your vault. Fields under 80% confidence are flagged for manual verification.
          </p>
        </div>

        {lowConfidenceCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{lowConfidenceCount} fields need review</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>High confidence</span>
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELD_META.map(({ key, label, type }) => {
          const field = result[key];
          const isLow = field.confidence < 80;
          const isMedium = field.confidence >= 80 && field.confidence < 90;

          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label
                  htmlFor={`ocr-${key}`}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  {label}
                </label>
                <span
                  className={`text-xs font-medium tabular-nums ${
                    isLow
                      ? 'text-amber-700 dark:text-amber-400'
                      : isMedium
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-emerald-700 dark:text-emerald-400'
                  }`}
                >
                  {field.confidence}% {isLow ? '· Needs review' : 'confidence'}
                </span>
              </div>

              {type === 'select' ? (
                <select
                  id={`ocr-${key}`}
                  value={field.value}
                  onChange={(e) => onChangeField(key, e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:text-white ${
                    isLow
                      ? 'border-amber-300 bg-amber-50/50 focus:border-amber-500 focus:ring-amber-500/20 dark:border-amber-700 dark:bg-amber-950/20'
                      : 'border-slate-200 bg-white focus:border-blue-600 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`ocr-${key}`}
                  type={type}
                  step={key === 'price' ? '0.01' : undefined}
                  value={field.value}
                  onChange={(e) => onChangeField(key, e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm tabular-nums text-slate-900 focus:outline-none focus:ring-2 dark:text-white ${
                    isLow
                      ? 'border-amber-300 bg-amber-50/50 focus:border-amber-500 focus:ring-amber-500/20 dark:border-amber-700 dark:bg-amber-950/20'
                      : 'border-slate-200 bg-white focus:border-blue-600 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-800'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => onToggleConfirm(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <span>I confirm the extracted invoice and warranty details above are accurate.</span>
        </label>

        <button
          type="button"
          onClick={onSave}
          disabled={!confirmed}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0"
        >
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          <span>Save to My Warranties</span>
        </button>
      </div>
    </div>
  );
}
