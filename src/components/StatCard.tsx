import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  helperText?: string;
  icon: LucideIcon;
  tone?: 'navy' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

const TONE_MAP = {
  navy: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300',
};

export function StatCard({
  label,
  value,
  helperText,
  icon: Icon,
  tone = 'navy',
  onClick,
}: StatCardProps) {
  const interactiveClasses = onClick
    ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600'
    : '';

  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full text-left rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900 ${interactiveClasses}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white">
            {value}
          </p>
          {helperText && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${TONE_MAP[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </Tag>
  );
}
