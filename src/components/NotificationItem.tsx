import { AlertTriangle, Bell, Check, CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VaultNotification } from '../types';
import { formatRelativeTime } from '../utils/warrantyUtils';

interface NotificationItemProps {
  notification: VaultNotification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const iconConfig = {
    expiring: {
      icon: AlertTriangle,
      classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    },
    expired: {
      icon: XCircle,
      classes: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
    },
    active: {
      icon: CheckCircle2,
      classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    },
    system: {
      icon: Bell,
      classes: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
    },
  }[notification.type];

  const Icon = iconConfig.icon;

  return (
    <div
      className={`flex flex-col justify-between gap-4 rounded-xl border p-4 transition-colors sm:flex-row sm:items-center ${
        notification.read
          ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
          : 'border-blue-200 bg-blue-50/40 dark:border-blue-900/60 dark:bg-blue-950/20'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconConfig.classes}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {notification.title}
            </h4>
            <span className="text-xs text-slate-400 tabular-nums">
              · {formatRelativeTime(notification.createdAt)}
            </span>
            {!notification.read && (
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Unread
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {notification.productId && (
          <Link
            to={`/warranty/${notification.productId}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <span>View Warranty</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
        {!notification.read && (
          <button
            type="button"
            onClick={() => onMarkRead(notification.id)}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 whitespace-nowrap shrink-0"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Mark read</span>
          </button>
        )}
      </div>
    </div>
  );
}
