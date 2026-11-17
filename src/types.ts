export type WarrantyStatus = 'Active' | 'Expiring Soon' | 'Expired';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  purchaseDate: string; // ISO YYYY-MM-DD
  purchasePrice: number;
  retailerName: string;
  warrantyDurationMonths: number;
  warrantyStartDate: string; // ISO YYYY-MM-DD
  warrantyExpiryDate: string; // ISO YYYY-MM-DD
  invoiceNumber: string;
  invoiceFileName?: string;
  invoiceFileDataUrl?: string;
  invoiceFileType?: string;
  serialNumber?: string;
  notes?: string;
  imageUrl?: string;
  qrCodeToken: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarInitials: string;
  createdAt: string;
}

export interface StoredUserRecord {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface NotificationPrefs {
  expiryReminders30Days: boolean;
  expiryReminders7Days: boolean;
  expiredAlerts: boolean;
  invoiceScanSummary: boolean;
  weeklyDigest: boolean;
}

export type ThemePreference = 'light' | 'dark' | 'system';

export type NotificationType = 'expiring' | 'expired' | 'active' | 'system';

export interface VaultNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  productId?: string;
  createdAt: string;
  read: boolean;
  source: 'product' | 'activity';
}

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  productId?: string;
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
}

export interface OCRExtractedField {
  value: string;
  confidence: number; // 0-100
}

export interface OCRExtractionResult {
  productName: OCRExtractedField;
  brand: OCRExtractedField;
  category: OCRExtractedField;
  purchaseDate: OCRExtractedField;
  price: OCRExtractedField;
  invoiceNumber: OCRExtractedField;
  retailerName: OCRExtractedField;
  warrantyDurationMonths: OCRExtractedField;
}
