import { FileCheck, Info, ScanLine, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { OCRResultCard } from '../components/OCRResultCard';
import { UploadedInvoiceFile, UploadZone } from '../components/UploadZone';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { matchMockOCRByFilename, MOCK_OCR_PRESETS } from '../data/mockData';
import { OCRExtractionResult } from '../types';
import { calculateExpiryDate } from '../utils/warrantyUtils';

const SCAN_STAGES = [
  'Preparing document preview...',
  'Detecting merchant header & invoice ID...',
  'Extracting line items & purchase price...',
  'Calculating confidence scores...',
];

export default function InvoiceScanner() {
  const { addProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [file, setFile] = useState<UploadedInvoiceFile | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStageIdx, setScanStageIdx] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRExtractionResult | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isScanning) return;

    const interval = window.setInterval(() => {
      setScanProgress((prev) => {
        const next = Math.min(100, prev + 8);
        if (next >= 25 && next < 55) setScanStageIdx(1);
        else if (next >= 55 && next < 85) setScanStageIdx(2);
        else if (next >= 85) setScanStageIdx(3);
        return next;
      });
    }, 120);

    const doneTimer = window.setTimeout(() => {
      window.clearInterval(interval);
      setIsScanning(false);
      setScanProgress(100);
      const matched = matchMockOCRByFilename(file?.name || 'receipt');
      // Deep copy so editing does not mutate preset constants
      setOcrResult(JSON.parse(JSON.stringify(matched)) as OCRExtractionResult);
      setConfirmed(false);
      showToast({
        type: 'info',
        title: 'Simulated extraction complete',
        description: 'Review highlighted low-confidence fields before saving.',
      });
    }, 1700);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(doneTimer);
    };
  }, [isScanning, file, showToast]);

  const handleFileSelect = (nextFile: UploadedInvoiceFile | null) => {
    setFile(nextFile);
    setOcrResult(null);
    setConfirmed(false);
    setError('');
    setScanProgress(0);
  };

  const handleLoadSample = (presetIndex: number, sampleName: string) => {
    setError('');
    setOcrResult(null);
    setConfirmed(false);
    setScanProgress(0);

    // Build an SVG invoice preview as a data URL so UploadZone renders a crisp visual receipt
    const preset = MOCK_OCR_PRESETS[presetIndex];
    const svgReceipt = `
      <svg xmlns="http://www.w3.org/2000/svg" width="520" height="320" viewBox="0 0 520 320">
        <rect width="520" height="320" fill="#ffffff"/>
        <rect x="20" y="20" width="480" height="280" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="40" y="58" font-family="sans-serif" font-size="18" font-weight="bold" fill="#172554">${preset.retailerName.value}</text>
        <text x="40" y="82" font-family="monospace" font-size="12" fill="#64748b">INVOICE: ${preset.invoiceNumber.value}   DATE: ${preset.purchaseDate.value}</text>
        <line x1="40" y1="100" x2="480" y2="100" stroke="#e2e8f0"/>
        <text x="40" y="138" font-family="sans-serif" font-size="15" font-weight="600" fill="#0f172a">${preset.productName.value}</text>
        <text x="40" y="164" font-family="sans-serif" font-size="13" fill="#475569">Brand: ${preset.brand.value} · Warranty: ${preset.warrantyDurationMonths.value} Months</text>
        <line x1="40" y1="210" x2="480" y2="210" stroke="#e2e8f0"/>
        <text x="40" y="248" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">TOTAL PAID</text>
        <text x="400" y="248" font-family="monospace" font-size="18" font-weight="bold" fill="#2563eb">$${preset.price.value}</text>
        <text x="40" y="280" font-family="sans-serif" font-size="11" fill="#94a3b8">Sample Demo Invoice Preview (${sampleName})</text>
      </svg>
    `.trim();
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgReceipt)}`;

    setFile({
      name: sampleName,
      size: 24800,
      type: 'image/png',
      dataUrl,
    });
  };

  const handleStartScan = () => {
    if (!file) {
      setError('Please upload an invoice file or load a sample receipt first.');
      return;
    }
    setError('');
    setOcrResult(null);
    setScanProgress(8);
    setScanStageIdx(0);
    setIsScanning(true);
  };

  const handleFieldChange = (key: keyof OCRExtractionResult, value: string) => {
    setOcrResult((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          value,
        },
      };
    });
  };

  const handleSaveToVault = () => {
    if (!ocrResult) return;
    const purchaseDate = ocrResult.purchaseDate.value || new Date().toISOString().split('T')[0];
    const duration = Math.max(1, Number(ocrResult.warrantyDurationMonths.value) || 12);
    const expiryDate = calculateExpiryDate(purchaseDate, duration);

    const created = addProduct({
      name: ocrResult.productName.value.trim() || 'Scanned Product',
      brand: ocrResult.brand.value.trim() || 'Generic',
      category: ocrResult.category.value || 'Other Electronics',
      purchaseDate,
      purchasePrice: Number(ocrResult.price.value) || 0,
      retailerName: ocrResult.retailerName.value.trim() || 'Retail Store',
      warrantyDurationMonths: duration,
      warrantyStartDate: purchaseDate,
      warrantyExpiryDate: expiryDate,
      invoiceNumber: ocrResult.invoiceNumber.value.trim() || `INV-${Date.now()}`,
      invoiceFileName: file?.name,
      invoiceFileDataUrl: file?.dataUrl,
      invoiceFileType: file?.type,
      notes: 'Added via simulated invoice scanner.',
    });

    showToast({
      type: 'success',
      title: 'Saved to My Warranties',
      description: `${created.name} added with ${duration}-month warranty coverage.`,
    });
    navigate(`/warranty/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Invoice Scanner
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Upload a purchase receipt to preview simulated field extraction and register a product quickly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Try sample:</span>
          <button
            type="button"
            onClick={() => handleLoadSample(0, 'dyson-bestbuy-receipt.png')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Dyson Vacuum
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample(1, 'sony-ps5-invoice.png')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Sony Console
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample(2, 'samsung-oled-tv.png')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Samsung TV
          </button>
        </div>
      </div>

      {/* Honest Simulation Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <p>
          <span className="font-semibold">Frontend Simulation Notice:</span> No external OCR API or cloud AI model is called. Clicking <span className="font-semibold">Scan Invoice</span> simulates document parsing using realistic sample data so you can test confidence indicators and inline editing locally.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Upload & Scan Trigger Column */}
        <div className="space-y-4 lg:col-span-5">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
              1. Upload Invoice Document
            </h2>
            <div className="relative">
              <UploadZone
                file={file}
                onFileSelect={handleFileSelect}
                onError={(msg) => setError(msg)}
              />

              {/* Animated Scanning Sweep Overlay */}
              {isScanning && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl bg-blue-950/20 backdrop-blur-[1px]">
                  <div className="animate-scan-sweep h-1 w-full bg-blue-500 shadow-[0_0_16px_4px_rgba(37,99,235,0.65)]" />
                </div>
              )}
            </div>

            {isScanning && (
              <div className="mt-4 space-y-2 rounded-lg border border-blue-100 bg-blue-50/70 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30">
                <div className="flex items-center justify-between text-xs font-medium text-blue-900 dark:text-blue-200">
                  <LoadingSpinner label={SCAN_STAGES[scanStageIdx]} size="sm" />
                  <span className="tabular-nums font-semibold">{scanProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-900">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-150"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleStartScan}
              disabled={!file || isScanning}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ScanLine className="h-4 w-4" aria-hidden="true" />
              <span>{isScanning ? 'Scanning Invoice...' : 'Scan Invoice'}</span>
            </button>
          </div>
        </div>

        {/* Extracted Fields Column */}
        <div className="lg:col-span-7">
          {ocrResult ? (
            <OCRResultCard
              result={ocrResult}
              onChangeField={handleFieldChange}
              confirmed={confirmed}
              onToggleConfirm={setConfirmed}
              onSave={handleSaveToVault}
            />
          ) : (
            <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {file ? (
                  <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                ) : (
                  <FileCheck className="h-6 w-6" aria-hidden="true" />
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                {isScanning
                  ? 'Running simulated extraction...'
                  : file
                  ? 'Invoice ready to scan'
                  : 'Waiting for an invoice'}
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                {file
                  ? 'Click "Scan Invoice" on the left to populate product details and confidence indicators.'
                  : 'Upload a JPG, PNG, or PDF invoice—or load one of the sample receipts above.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
