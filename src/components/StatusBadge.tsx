import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { WarrantyStatus } from '../types';

interface StatusBadgeProps {
  status: WarrantyStatus;
  compact?: boolean;
}

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  if (status === 'Active') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 font-medium text-emerald-700 whitespace-nowrap shrink-0 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300 ${
          compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Active</span>
      </span>
    );
  }

  if (status === 'Expiring Soon') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 font-medium text-amber-800 whitespace-nowrap shrink-0 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300 ${
          compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Expiring Soon</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 font-medium text-red-700 whitespace-nowrap shrink-0 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300 ${
        compact ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>Expired</span>
    </span>
  );
}
