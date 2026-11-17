import { Info, QrCode } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeModal } from '../components/QRCodeModal';
import { SearchBar } from '../components/SearchBar';
import { WarrantyCard } from '../components/WarrantyCard';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { Product } from '../types';
import { downloadQRCanvasAsPNG } from '../utils/warrantyUtils';

export default function QRCards() {
  const { products, regenerateQRToken } = useProducts();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.invoiceNumber.toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleDownloadQR = (product: Product, canvasId: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    const filename = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-qr-card.png`;
    if (downloadQRCanvasAsPNG(canvas, filename)) {
      showToast({
        type: 'success',
        title: 'QR code downloaded',
        description: `Saved QR image for ${product.name}.`,
      });
    }
  };

  const handleRegenerate = (product: Product) => {
    const newToken = regenerateQRToken(product.id);
    showToast({
      type: 'info',
      title: 'Demo QR link updated',
      description: `New token ${newToken} generated for ${product.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            QR Warranty Cards
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Access, enlarge, and download scannable digital warranty cards for every product.
          </p>
        </div>

        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search cards by product or invoice..."
          className="w-full sm:w-72"
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <p>
          <span className="font-semibold">Demo Verification Links:</span> QR codes encode local demonstration URLs (<span className="font-mono">warrantyvault.demo/verify/...</span>) representing how service centers verify warranty coverage in a production deployment.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <QrCode className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            No QR warranty cards found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add a product to generate its digital QR warranty card automatically.
          </p>
          <Link
            to="/add-warranty"
            className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Add Warranty
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <WarrantyCard
              key={product.id}
              product={product}
              onEnlargeQR={(item) => setModalProduct(item)}
              onDownloadQR={handleDownloadQR}
              onRegenerateQR={handleRegenerate}
            />
          ))}
        </div>
      )}

      <QRCodeModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onDownloadSuccess={() =>
          showToast({
            type: 'success',
            title: 'QR code downloaded',
            description: 'Saved high-resolution PNG image.',
          })
        }
      />
    </div>
  );
}
