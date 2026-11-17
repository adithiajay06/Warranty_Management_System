import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { INITIAL_ACTIVITIES, INITIAL_PRODUCTS } from '../data/mockData';
import { ActivityItem, Product, VaultNotification } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage';
import { getDaysRemaining, getWarrantyStatus } from '../utils/warrantyUtils';

interface ProductStats {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
  totalValue: number;
}

interface ProductContextValue {
  products: Product[];
  activities: ActivityItem[];
  notifications: VaultNotification[];
  unreadCount: number;
  stats: ProductStats;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addProduct: (input: Omit<Product, 'id' | 'qrCodeToken' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  regenerateQRToken: (id: string) => string;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  resetDemoData: () => void;
}

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS)
  );

  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    readStorage<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );

  const [readIds, setReadIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.NOTIFICATIONS_READ, [])
  );

  const [dismissedIds, setDismissedIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.DISMISSED_NOTIFICATIONS, [])
  );

  const [searchQuery, setSearchQuery] = useState('');

  const persistProducts = useCallback((next: Product[]) => {
    setProducts(next);
    writeStorage(STORAGE_KEYS.PRODUCTS, next);
  }, []);

  const logActivity = useCallback((action: string, detail: string, productId?: string) => {
    const entry: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action,
      detail,
      productId,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => {
      const next = [entry, ...prev].slice(0, 20);
      writeStorage(STORAGE_KEYS.ACTIVITIES, next);
      return next;
    });
  }, []);

  const addProduct = useCallback(
    (input: Omit<Product, 'id' | 'qrCodeToken' | 'createdAt'>): Product => {
      const cleanBrand = input.brand.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 3) || 'WV';
      const token = `WV-${cleanBrand}-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;
      const created: Product = {
        ...input,
        id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        qrCodeToken: token,
        createdAt: new Date().toISOString(),
      };
      const next = [created, ...products];
      persistProducts(next);
      logActivity(
        'Warranty registered',
        `${created.name} added (${created.warrantyDurationMonths} months coverage)`,
        created.id
      );
      return created;
    },
    [products, persistProducts, logActivity]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      const target = products.find((p) => p.id === id);
      const next = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
      persistProducts(next);
      if (target) {
        logActivity('Warranty updated', `Updated details for ${updates.name ?? target.name}`, id);
      }
    },
    [products, persistProducts, logActivity]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const target = products.find((p) => p.id === id);
      const next = products.filter((p) => p.id !== id);
      persistProducts(next);
      if (target) {
        logActivity('Warranty removed', `Deleted ${target.name} from vault`);
      }
    },
    [products, persistProducts, logActivity]
  );

  const regenerateQRToken = useCallback(
    (id: string): string => {
      const token = `WV-QR-${Math.floor(10000 + Math.random() * 90000)}`;
      const next = products.map((p) => (p.id === id ? { ...p, qrCodeToken: token } : p));
      persistProducts(next);
      const target = products.find((p) => p.id === id);
      if (target) {
        logActivity('QR link refreshed', `New demo QR verification link generated for ${target.name}`, id);
      }
      return token;
    },
    [products, persistProducts, logActivity]
  );

  const stats = useMemo<ProductStats>(() => {
    let active = 0;
    let expiringSoon = 0;
    let expired = 0;
    let totalValue = 0;

    for (const p of products) {
      const status = getWarrantyStatus(p.warrantyExpiryDate);
      if (status === 'Active') active += 1;
      else if (status === 'Expiring Soon') expiringSoon += 1;
      else expired += 1;
      totalValue += Number(p.purchasePrice) || 0;
    }

    return {
      total: products.length,
      active,
      expiringSoon,
      expired,
      totalValue,
    };
  }, [products]);

  const notifications = useMemo<VaultNotification[]>(() => {
    const productAlerts: VaultNotification[] = products.map((p) => {
      const status = getWarrantyStatus(p.warrantyExpiryDate);
      const days = getDaysRemaining(p.warrantyExpiryDate);
      const id = `notif-prod-${p.id}-${status.toLowerCase().replace(/\s+/g, '-')}`;

      if (status === 'Expiring Soon') {
        return {
          id,
          type: 'expiring',
          title: 'Warranty expiring soon',
          message: `Your ${p.name} warranty expires in ${days} ${days === 1 ? 'day' : 'days'}.`,
          productId: p.id,
          createdAt: p.createdAt,
          read: readIds.includes(id),
          source: 'product',
        };
      }

      if (status === 'Expired') {
        return {
          id,
          type: 'expired',
          title: 'Warranty expired',
          message: `Your ${p.name} warranty has expired.`,
          productId: p.id,
          createdAt: p.createdAt,
          read: readIds.includes(id),
          source: 'product',
        };
      }

      return {
        id,
        type: 'active',
        title: 'Warranty active',
        message: `Your ${p.name} warranty is active (${days} days remaining).`,
        productId: p.id,
        createdAt: p.createdAt,
        read: readIds.includes(id),
        source: 'product',
      };
    });

    const systemAlerts: VaultNotification[] = activities.slice(0, 4).map((act) => {
      const id = `notif-act-${act.id}`;
      return {
        id,
        type: 'system',
        title: act.action,
        message: act.detail,
        productId: act.productId,
        createdAt: act.timestamp,
        read: readIds.includes(id),
        source: 'activity',
      };
    });

    const combined = [...productAlerts, ...systemAlerts].filter((n) => !dismissedIds.includes(n.id));
    // Sort expiring & expired alerts first, then newest
    const priority: Record<VaultNotification['type'], number> = {
      expiring: 0,
      expired: 1,
      system: 2,
      active: 3,
    };
    return combined.sort((a, b) => {
      if (priority[a.type] !== priority[b.type]) return priority[a.type] - priority[b.type];
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, activities, readIds, dismissedIds]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markNotificationRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeStorage(STORAGE_KEYS.NOTIFICATIONS_READ, next);
      return next;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    writeStorage(STORAGE_KEYS.NOTIFICATIONS_READ, allIds);
  }, [notifications]);

  const clearNotifications = useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    setDismissedIds((prev) => {
      const merged = Array.from(new Set([...prev, ...allIds]));
      writeStorage(STORAGE_KEYS.DISMISSED_NOTIFICATIONS, merged);
      return merged;
    });
  }, [notifications]);

  const resetDemoData = useCallback(() => {
    persistProducts(INITIAL_PRODUCTS);
    setActivities(INITIAL_ACTIVITIES);
    writeStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    setReadIds([]);
    writeStorage(STORAGE_KEYS.NOTIFICATIONS_READ, []);
    setDismissedIds([]);
    writeStorage(STORAGE_KEYS.DISMISSED_NOTIFICATIONS, []);
  }, [persistProducts]);

  return (
    <ProductContext.Provider
      value={{
        products,
        activities,
        notifications,
        unreadCount,
        stats,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        regenerateQRToken,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        resetDemoData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return ctx;
}
