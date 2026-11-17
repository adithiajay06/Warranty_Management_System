import { Check, Copy, Download, QrCode, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { Product } from '../types';
import {
  downloadQRCanvasAsPNG,
  formatDisplayDate,
  getDemoVerificationUrl,
  getWarrantyStatus,
} from '../utils/warrantyUtils';
import { StatusBadge } from './StatusBadge';

interface QRCodeModalProps {
  product: Product | null;
  onClose: () => void;
  onDownloadSuccess?: () => void;
}

export function QRCodeModal({ product, onClose, onDownloadSuccess }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const verificationUrl = getDemoVerificationUrl(product);
  const status = getWarrantyStatus(product.warrantyExpiryDate);
  const modalCanvasId = `qr-modal-canvas-${product.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById(modalCanvasId) as HTMLCanvasElement | null;
    const filename = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-qr.png`;
    if (downloadQRCanvasAsPNG(canvas, filename)) {
      onDownloadSuccess?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <QrCode className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h3 id="qr-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
              Digital Warranty QR Card
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close QR modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="flex items-center justify-between gap-2 text-left">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{product.brand}</p>
              <p className="truncate text-base font-semibold text-slate-900 dark:text-white">{product.name}</p>
            </div>
            <StatusBadge status={status} compact />
          </div>

          <div className="mx-auto mt-5 inline-flex rounded-xl border border-slate-200 bg-white p-4">
            <QRCodeCanvas
              id={modalCanvasId}
              value={verificationUrl}
              size={220}
              level="H"
              includeMargin
            />
          </div>

          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 text-left text-xs dark:border-blue-900/50 dark:bg-blue-950/30">
            <p className="font-semibold text-blue-900 dark:text-blue-200">
              Demo Verification Link (Frontend Simulation)
            </p>
            <p className="mt-0.5 break-all font-mono text-blue-700 dark:text-blue-300">
              {verificationUrl}
            </p>
          </div>

          <p className="mt-3 text-xs text-slate-500 tabular-nums dark:text-slate-400">
            Valid through {formatDisplayDate(product.warrantyExpiryDate)} · Invoice {product.invoiceNumber}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span>Copy Demo Link</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
