import { ActivityItem, NotificationPrefs, OCRExtractionResult, Product } from '../types';

export const PRODUCT_CATEGORIES = [
  'Home Appliances',
  'Laptops & Computers',
  'Audio & Wearables',
  'Monitors & Displays',
  'Printers & Office',
  'Smartphones & Tablets',
  'Kitchen Electronics',
  'Other Electronics',
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-samsung-washer',
    name: 'Samsung EcoBubble Washing Machine',
    brand: 'Samsung',
    category: 'Home Appliances',
    purchaseDate: '2026-06-15',
    purchasePrice: 849.0,
    retailerName: 'Best Buy',
    warrantyDurationMonths: 24,
    warrantyStartDate: '2026-06-15',
    warrantyExpiryDate: '2028-06-15',
    invoiceNumber: 'INV-BB-2026-8841',
    serialNumber: 'SN-SM-9042188A',
    notes: 'Includes 2-year manufacturer parts & labor coverage plus digital motor protection.',
    imageUrl: '/src/assets/images/product_washing_machine_1794909595500.jpg',
    qrCodeToken: 'WV-SM-8841-2026',
    createdAt: '2026-06-15T14:22:00.000Z',
  },
  {
    id: 'prod-apple-macbook',
    name: 'Apple MacBook Air 13" M3',
    brand: 'Apple',
    category: 'Laptops & Computers',
    purchaseDate: '2026-03-20',
    purchasePrice: 1299.0,
    retailerName: 'Apple Store',
    warrantyDurationMonths: 24,
    warrantyStartDate: '2026-03-20',
    warrantyExpiryDate: '2028-03-20',
    invoiceNumber: 'INV-APL-2026-3109',
    serialNumber: 'C02YM498LVCG',
    notes: 'Covered under AppleCare+ extended hardware & battery service plan.',
    imageUrl: '/src/assets/images/product_macbook_air_1794909595105.jpg',
    qrCodeToken: 'WV-APL-3109-2026',
    createdAt: '2026-03-20T10:15:00.000Z',
  },
  {
    id: 'prod-sony-headphones',
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    category: 'Audio & Wearables',
    purchaseDate: '2025-12-10',
    purchasePrice: 348.0,
    retailerName: 'Amazon Electronics',
    warrantyDurationMonths: 12,
    warrantyStartDate: '2025-12-10',
    warrantyExpiryDate: '2026-12-10',
    invoiceNumber: 'INV-AMZ-2025-5520',
    serialNumber: 'SN-SONY-771204',
    notes: 'Standard 12-month limited manufacturer warranty. Eligible for battery & ANC check.',
    imageUrl: '/src/assets/images/product_sony_headphones_1794909595386.jpg',
    qrCodeToken: 'WV-SNY-5520-2025',
    createdAt: '2025-12-10T16:40:00.000Z',
  },
  {
    id: 'prod-lg-refrigerator',
    name: 'LG French-Door Smart Refrigerator',
    brand: 'LG',
    category: 'Home Appliances',
    purchaseDate: '2025-12-02',
    purchasePrice: 1799.0,
    retailerName: 'Home Depot',
    warrantyDurationMonths: 12,
    warrantyStartDate: '2025-12-02',
    warrantyExpiryDate: '2026-12-02',
    invoiceNumber: 'INV-HD-2025-4418',
    serialNumber: 'SN-LG-4198220',
    notes: 'Includes sealed system and linear compressor warranty coverage.',
    imageUrl: '/src/assets/images/product_lg_refrigerator_1794909595746.jpg',
    qrCodeToken: 'WV-LG-4418-2025',
    createdAt: '2025-12-02T11:05:00.000Z',
  },
  {
    id: 'prod-dell-monitor',
    name: 'Dell UltraSharp 27" 4K Monitor',
    brand: 'Dell',
    category: 'Monitors & Displays',
    purchaseDate: '2024-01-10',
    purchasePrice: 579.99,
    retailerName: 'Dell Direct',
    warrantyDurationMonths: 12,
    warrantyStartDate: '2024-01-10',
    warrantyExpiryDate: '2025-01-10',
    invoiceNumber: 'INV-DEL-2024-1982',
    serialNumber: 'CN-0V8M21-74261',
    notes: '1-year advanced exchange panel warranty.',
    imageUrl: '/src/assets/images/product_dell_monitor_1794909596088.jpg',
    qrCodeToken: 'WV-DEL-1982-2024',
    createdAt: '2024-01-10T09:30:00.000Z',
  },
  {
    id: 'prod-hp-printer',
    name: 'HP LaserJet Pro Wireless Printer',
    brand: 'HP',
    category: 'Printers & Office',
    purchaseDate: '2024-08-05',
    purchasePrice: 289.5,
    retailerName: 'Staples',
    warrantyDurationMonths: 18,
    warrantyStartDate: '2024-08-05',
    warrantyExpiryDate: '2026-02-05',
    invoiceNumber: 'INV-STP-2024-6634',
    serialNumber: 'VNC3K19842',
    notes: '18-month commercial office hardware service coverage.',
    imageUrl: '/src/assets/images/product_hp_printer_1794909596322.jpg',
    qrCodeToken: 'WV-HP-6634-2024',
    createdAt: '2024-08-05T13:18:00.000Z',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    action: 'Warranty registered',
    detail: 'Samsung EcoBubble Washing Machine added with 24-month coverage',
    productId: 'prod-samsung-washer',
    timestamp: '2026-11-15T18:20:00.000Z',
  },
  {
    id: 'act-2',
    action: 'Expiry reminder triggered',
    detail: 'LG French-Door Smart Refrigerator expires on 2 Dec 2026',
    productId: 'prod-lg-refrigerator',
    timestamp: '2026-11-16T09:10:00.000Z',
  },
  {
    id: 'act-3',
    action: 'QR card generated',
    detail: 'Digital verification link ready for Apple MacBook Air 13" M3',
    productId: 'prod-apple-macbook',
    timestamp: '2026-11-16T15:45:00.000Z',
  },
];

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  expiryReminders30Days: true,
  expiryReminders7Days: true,
  expiredAlerts: true,
  invoiceScanSummary: true,
  weeklyDigest: false,
};

export const MOCK_OCR_PRESETS: OCRExtractionResult[] = [
  {
    productName: { value: 'Dyson V15 Detect Cordless Vacuum', confidence: 96 },
    brand: { value: 'Dyson', confidence: 98 },
    category: { value: 'Home Appliances', confidence: 91 },
    purchaseDate: { value: '2026-10-28', confidence: 94 },
    price: { value: '749.99', confidence: 97 },
    invoiceNumber: { value: 'INV-BBY-2026-99412', confidence: 74 },
    retailerName: { value: 'Best Buy Retail #402', confidence: 89 },
    warrantyDurationMonths: { value: '24', confidence: 72 },
  },
  {
    productName: { value: 'Sony PlayStation 5 Slim Console', confidence: 95 },
    brand: { value: 'Sony', confidence: 99 },
    category: { value: 'Other Electronics', confidence: 88 },
    purchaseDate: { value: '2026-11-04', confidence: 93 },
    price: { value: '499.00', confidence: 98 },
    invoiceNumber: { value: 'INV-AMZ-2026-71834', confidence: 92 },
    retailerName: { value: 'Amazon Electronics', confidence: 76 },
    warrantyDurationMonths: { value: '12', confidence: 84 },
  },
  {
    productName: { value: 'Samsung 55" OLED 4K Smart TV', confidence: 94 },
    brand: { value: 'Samsung', confidence: 98 },
    category: { value: 'Monitors & Displays', confidence: 73 },
    purchaseDate: { value: '2026-09-18', confidence: 95 },
    price: { value: '1499.99', confidence: 96 },
    invoiceNumber: { value: 'INV-CST-2026-30819', confidence: 90 },
    retailerName: { value: 'Costco Wholesale', confidence: 91 },
    warrantyDurationMonths: { value: '24', confidence: 78 },
  },
];

export function matchMockOCRByFilename(fileName: string): OCRExtractionResult {
  const lower = fileName.toLowerCase();
  if (lower.includes('sony') || lower.includes('ps5') || lower.includes('audio')) {
    return MOCK_OCR_PRESETS[1];
  }
  if (lower.includes('samsung') || lower.includes('tv') || lower.includes('oled')) {
    return MOCK_OCR_PRESETS[2];
  }
  return MOCK_OCR_PRESETS[0];
}
