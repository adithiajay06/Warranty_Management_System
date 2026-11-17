import { Download, Maximize2, RefreshCw, Shield } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import {
  formatDisplayDate,
  getDemoVerificationUrl,
  getWarrantyStatus,
} from '../utils/warrantyUtils';
import { StatusBadge } from './StatusBadge';

interface WarrantyCardProps {
  product: Product;
  canvasId?: string;
  onEnlargeQR?: (product: Product) => void;
  onDownloadQR?: (product: Product, canvasId: string) => void;
  onRegenerateQR?: (product: Product) => void;
}

export function WarrantyCard({
  product,
  canvasId,
  onEnlargeQR,
  onDownloadQR,
  onRegenerateQR,
}: WarrantyCardProps) {
  const status = getWarrantyStatus(product.warrantyExpiryDate);
  const verificationUrl = getDemoVerificationUrl(product);
  const resolvedCanvasId = canvasId || `qr-canvas-${product.id}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Deep Navy Digital Certificate Header */}
      <div className="bg-blue-950 px-5 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-blue-200">
              <Shield className="h-3.5 w-3.5 text-blue-400 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {product.brand} · {product.category}
              </span>
            </div>
            <Link
              to={`/warranty/${product.id}`}
              className="mt-1 block truncate text-base font-semibold text-white hover:text-blue-200"
            >
              {product.name}
            </Link>
          </div>
          <StatusBadge status={status} compact />
        </div>
      </div>

      {/* Card Body with QR & Dates */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg border border-slate-200 bg-white p-2">
            <QRCodeCanvas
              id={resolvedCanvasId}
              value={verificationUrl}
              size={88}
              level="M"
              includeMargin={false}
            />
          </div>

          <dl className="min-w-0 flex-1 space-y-2 text-xs">
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Purchase Date</dt>
              <dd className="font-medium text-slate-900 tabular-nums dark:text-slate-100">
                {formatDisplayDate(product.purchaseDate)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Warranty Expiry</dt>
              <dd className="font-medium text-slate-900 tabular-nums dark:text-slate-100">
                {formatDisplayDate(product.warrantyExpiryDate)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 dark:text-slate-400">Invoice ID</dt>
              <dd className="truncate font-mono text-slate-800 dark:text-slate-200">
                {product.invoiceNumber}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800/60">
          <span className="font-medium text-slate-500 dark:text-slate-400">Demo Verification Link: </span>
          <span className="block truncate font-mono text-slate-700 dark:text-slate-300">
            {verificationUrl}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          {onEnlargeQR && (
            <button
              type="button"
              onClick={() => onEnlargeQR(product)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Enlarge QR</span>
            </button>
          )}
          {onDownloadQR && (
            <button
              type="button"
              onClick={() => onDownloadQR(product, resolvedCanvasId)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Download PNG</span>
            </button>
          )}
          {onRegenerateQR && (
            <button
              type="button"
              onClick={() => onRegenerateQR(product)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label={`Regenerate demo QR token for ${product.name}`}
              title="Generate fresh demo QR code"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
