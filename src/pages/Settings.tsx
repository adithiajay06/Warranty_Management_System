import { LogOut, Monitor, Moon, RotateCcw, Save, Sun } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { ThemePreference } from '../types';

export default function Settings() {
  const {
    user,
    theme,
    notificationPrefs,
    updateProfileName,
    updateTheme,
    updateNotificationPrefs,
    logout,
  } = useAuth();
  const { resetDemoData } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      showToast({ type: 'error', title: 'Invalid name', description: 'Name must be at least 2 characters.' });
      return;
    }
    updateProfileName(fullName);
    showToast({ type: 'success', title: 'Profile updated', description: 'Your display name was saved.' });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || newPassword.length < 6) {
      showToast({
        type: 'error',
        title: 'Invalid password',
        description: 'Enter your current password and a new password of at least 6 characters.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ type: 'error', title: 'Mismatch', description: 'New passwords do not match.' });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast({
      type: 'success',
      title: 'Password updated (Demo)',
      description: 'Password change simulated in frontend session.',
    });
  };

  const handlePrefToggle = (key: keyof typeof notificationPrefs) => {
    const next = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    updateNotificationPrefs(next);
    showToast({ type: 'info', title: 'Preference saved' });
  };

  const handleResetDemo = () => {
    resetDemoData();
    setResetModalOpen(false);
    showToast({
      type: 'success',
      title: 'Demo data restored',
      description: 'Restored all 6 sample products and initial activity logs.',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage your profile, notification preferences, appearance, and local vault data.
        </p>
      </div>

      {/* Profile Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Profile Information
        </h2>
        <form onSubmit={handleProfileSave} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="settings-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="settings-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <input
              id="settings-email"
              type="email"
              value={user?.email ?? ''}
              disabled
              className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </section>

      {/* Theme Preference */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Theme Preference
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Choose how Warranty Vault appears on this device.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'system', label: 'System Default', icon: Monitor },
            ] as Array<{ id: ThemePreference; label: string; icon: typeof Sun }>
          ).map((item) => {
            const Icon = item.icon;
            const active = theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateTheme(item.id)}
                className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Notification Preferences
        </h2>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {(
            [
              {
                key: 'expiryReminders30Days',
                title: '30-Day Expiry Reminders',
                desc: 'Highlight warranties entering their final month of coverage.',
              },
              {
                key: 'expiryReminders7Days',
                title: '7-Day Urgent Alerts',
                desc: 'Show urgent reminders one week before warranty expiration.',
              },
              {
                key: 'expiredAlerts',
                title: 'Expired Warranty Notices',
                desc: 'Keep expired items listed in the notification centre.',
              },
              {
                key: 'invoiceScanSummary',
                title: 'Invoice Scan Confirmation',
                desc: 'Display toast summaries after simulated invoice extraction.',
              },
              {
                key: 'weeklyDigest',
                title: 'Weekly Vault Summary (Demo)',
                desc: 'Simulated weekly coverage digest toggle.',
              },
            ] as Array<{ key: keyof typeof notificationPrefs; title: string; desc: string }>
          ).map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-center justify-between gap-4 py-3.5"
            >
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs[item.key]}
                onChange={() => handlePrefToggle(item.key)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Change Password UI (Demo) */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Change Password (Demo UI)
        </h2>
        <form onSubmit={handlePasswordChange} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 chars"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Update Password
            </button>
          </div>
        </form>
      </section>

      {/* Vault Controls & Logout */}
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setResetModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Reset Demo Data</span>
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </section>

      <ConfirmationModal
        isOpen={resetModalOpen}
        title="Restore sample demo data?"
        message="This will reset your product list to the 6 default sample warranties and clear custom additions."
        confirmLabel="Restore Demo Data"
        destructive={false}
        onConfirm={handleResetDemo}
        onCancel={() => setResetModalOpen(false)}
      />
    </div>
  );
}
