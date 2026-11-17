export const STORAGE_KEYS = {
  PRODUCTS: 'wv_products_v1',
  USER: 'wv_active_user_v1',
  REGISTERED_USERS: 'wv_registered_users_v1',
  NOTIFICATIONS_READ: 'wv_read_notifications_v1',
  DISMISSED_NOTIFICATIONS: 'wv_dismissed_notifications_v1',
  ACTIVITIES: 'wv_activities_v1',
  NOTIFICATION_PREFS: 'wv_notification_prefs_v1',
  THEME: 'wv_theme_preference_v1',
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage removal errors
  }
}
