import { BellOff, CheckCheck, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { NotificationItem } from '../components/NotificationItem';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { NotificationType } from '../types';

type FilterTab = 'all' | NotificationType;

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useProducts();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<FilterTab>('all');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return notifications;
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const handleMarkAll = () => {
    markAllNotificationsRead();
    showToast({ type: 'success', title: 'All caught up', description: 'Marked all notifications as read.' });
  };

  const handleClearAll = () => {
    clearNotifications();
    setConfirmClearOpen(false);
    showToast({ type: 'info', title: 'Notifications cleared' });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Live expiry reminders and warranty status alerts calculated from your vault.{' '}
            <span className="font-semibold tabular-nums">{unreadCount} unread</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleMarkAll}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            <span>Mark all read</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            disabled={notifications.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>Clear all</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        {(
          [
            { key: 'all', label: 'All Alerts' },
            { key: 'expiring', label: 'Expiring Soon' },
            { key: 'expired', label: 'Expired' },
            { key: 'active', label: 'Active' },
            { key: 'system', label: 'Activity' },
          ] as Array<{ key: FilterTab; label: string }>
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              filter === tab.key
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <BellOff className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            No notifications in this view
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Alerts appear automatically when warranties approach expiry or new products are added.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              onMarkRead={markNotificationRead}
            />
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmClearOpen}
        title="Clear all notifications?"
        message="This will dismiss all currently listed notifications from your notification centre."
        confirmLabel="Clear Notifications"
        onConfirm={handleClearAll}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
