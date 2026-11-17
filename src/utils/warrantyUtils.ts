import { Product, WarrantyStatus } from '../types';

export const EXPIRING_SOON_THRESHOLD_DAYS = 45;

export function calculateExpiryDate(startDateStr: string, durationMonths: number): string {
  if (!startDateStr || !Number.isFinite(durationMonths)) return '';
  const parts = startDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return '';
  const [year, month, day] = parts;
  const date = new Date(year, month - 1 + durationMonths, day);
  // Handle end-of-month rollover (e.g. Jan 31 + 1 month -> Feb 28)
  const expectedMonth = ((month - 1 + durationMonths) % 12 + 12) % 12;
  if (date.getMonth() !== expectedMonth) {
    date.setDate(0);
  }
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getDaysRemaining(expiryDateStr: string, referenceDate: Date = new Date()): number {
  if (!expiryDateStr) return 0;
  const parts = expiryDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  const [year, month, day] = parts;
  const expiry = new Date(year, month - 1, day);
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const diffMs = expiry.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function getWarrantyStatus(expiryDateStr: string, referenceDate: Date = new Date()): WarrantyStatus {
  const days = getDaysRemaining(expiryDateStr, referenceDate);
  if (days <= 0) return 'Expired';
  if (days <= EXPIRING_SOON_THRESHOLD_DAYS) return 'Expiring Soon';
  return 'Active';
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Recently';
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDemoVerificationUrl(product: Product): string {
  return `https://warrantyvault.demo/verify/${product.qrCodeToken}?inv=${encodeURIComponent(product.invoiceNumber)}`;
}

export function getCoverageProgressPercent(startDateStr: string, expiryDateStr: string): number {
  const startParts = startDateStr.split('-').map(Number);
  const endParts = expiryDateStr.split('-').map(Number);
  if (startParts.length !== 3 || endParts.length !== 3) return 0;
  const start = new Date(startParts[0], startParts[1] - 1, startParts[2]).getTime();
  const end = new Date(endParts[0], endParts[1] - 1, endParts[2]).getTime();
  const now = Date.now();
  if (end <= start) return 100;
  const pct = ((now - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function downloadQRCanvasAsPNG(canvasElement: HTMLCanvasElement | null, filename: string): boolean {
  if (!canvasElement) return false;
  const dataUrl = canvasElement.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

export function downloadWarrantyCardPNG(product: Product): void {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 560;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const status = getWarrantyStatus(product.warrantyExpiryDate);
  const days = getDaysRemaining(product.warrantyExpiryDate);

  // Navy Card Surface
  ctx.fillStyle = '#172554';
  ctx.fillRect(0, 0, 960, 560);

  // Top Royal Blue Accent Strip
  ctx.fillStyle = '#2563EB';
  ctx.fillRect(0, 0, 960, 10);

  // Inner subtle card border
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 904, 504);

  // Brand Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('WARRANTY VAULT', 56, 82);

  ctx.fillStyle = '#93C5FD';
  ctx.font = '15px sans-serif';
  ctx.fillText('DIGITAL WARRANTY CERTIFICATE (DEMO)', 56, 108);

  // Status Badge
  const statusColor = status === 'Active' ? '#16A34A' : status === 'Expiring Soon' ? '#D97706' : '#DC2626';
  ctx.fillStyle = statusColor;
  ctx.fillRect(720, 58, 180, 38);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(status.toUpperCase(), 744, 83);

  // Divider
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(56, 134);
  ctx.lineTo(904, 134);
  ctx.stroke();

  // Product Name & Brand
  ctx.fillStyle = '#93C5FD';
  ctx.font = '16px sans-serif';
  ctx.fillText(`${product.brand.toUpperCase()}  ·  ${product.category.toUpperCase()}`, 56, 182);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(product.name.slice(0, 36), 56, 224);

  // Grid Info
  const fields: Array<[string, string, number, number]> = [
    ['PURCHASE DATE', formatDisplayDate(product.purchaseDate), 56, 295],
    ['WARRANTY START', formatDisplayDate(product.warrantyStartDate), 320, 295],
    ['WARRANTY EXPIRY', formatDisplayDate(product.warrantyExpiryDate), 584, 295],
    ['INVOICE NUMBER', product.invoiceNumber, 56, 385],
    ['RETAILER', product.retailerName, 320, 385],
    ['COVERAGE TERM', `${product.warrantyDurationMonths} Months (${days > 0 ? `${days}d left` : 'Expired'})`, 584, 385],
  ];

  for (const [label, value, x, y] of fields) {
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px sans-serif';
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(value.slice(0, 28), x, y + 28);
  }

  // Footer verification line
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(56, 462);
  ctx.lineTo(904, 462);
  ctx.stroke();

  ctx.fillStyle = '#94A3B8';
  ctx.font = '14px monospace';
  ctx.fillText(`Demo Verification Token: ${product.qrCodeToken}`, 56, 498);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '14px sans-serif';
  ctx.fillText(formatCurrency(product.purchasePrice), 810, 498);

  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-warranty-card.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
