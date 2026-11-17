import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ label, size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <div className="inline-flex items-center gap-2.5 text-slate-600 dark:text-slate-300" role="status">
      <Loader2 className={`${sizeClass} animate-spin text-blue-600 dark:text-blue-400`} aria-hidden="true" />
      {label && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}
