import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { UploadedInvoiceFile, UploadZone } from '../components/UploadZone';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { PRODUCT_CATEGORIES } from '../data/mockData';
import {
  calculateExpiryDate,
  formatCurrency,
  formatDisplayDate,
  getWarrantyStatus,
} from '../utils/warrantyUtils';

const STEPS = [
  { id: 1, title: 'Product Information' },
  { id: 2, title: 'Warranty Information' },
  { id: 3, title: 'Invoice Information' },
  { id: 4, title: 'Review & Save' },
];

export default function AddWarranty() {
  const { addProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const todayISO = new Date().toISOString().split('T')[0];

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Step 1
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(PRODUCT_CATEGORIES[0]);
  const [purchaseDate, setPurchaseDate] = useState(todayISO);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [retailerName, setRetailerName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');

  // Step 2
  const [warrantyDurationMonths, setWarrantyDurationMonths] = useState('12');
  const [warrantyStartDate, setWarrantyStartDate] = useState(todayISO);
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState(() =>
    calculateExpiryDate(todayISO, 12)
  );
  const [startSyncedToPurchase, setStartSyncedToPurchase] = useState(true);

  // Step 3
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [invoiceFile, setInvoiceFile] = useState<UploadedInvoiceFile | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (startSyncedToPurchase && purchaseDate) {
      setWarrantyStartDate(purchaseDate);
    }
  }, [purchaseDate, startSyncedToPurchase]);

  useEffect(() => {
    const months = Number(warrantyDurationMonths);
    if (warrantyStartDate && Number.isFinite(months) && months > 0) {
      setWarrantyExpiryDate(calculateExpiryDate(warrantyStartDate, months));
    }
  }, [warrantyStartDate, warrantyDurationMonths]);

  const validateCurrentStep = (): boolean => {
    setError('');
    if (step === 1) {
      if (!productName.trim()) {
        setError('Product Name is required.');
        return false;
      }
      if (!brand.trim()) {
        setError('Brand is required.');
        return false;
      }
      if (!purchaseDate) {
        setError('Purchase Date is required.');
        return false;
      }
      const price = Number(purchasePrice);
      if (!purchasePrice || isNaN(price) || price <= 0) {
        setError('Please enter a valid purchase price greater than 0.');
        return false;
      }
      if (!retailerName.trim()) {
        setError('Retailer Name is required.');
        return false;
      }
    }

    if (step === 2) {
      const months = Number(warrantyDurationMonths);
      if (!Number.isFinite(months) || months < 1 || months > 240) {
        setError('Warranty Duration must be between 1 and 240 months.');
        return false;
      }
      if (!warrantyStartDate || !warrantyExpiryDate) {
        setError('Please provide valid warranty start and expiry dates.');
        return false;
      }
    }

    if (step === 3) {
      if (!invoiceNumber.trim()) {
        setError('Invoice Number is required.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((s) => Math.min(4, s + 1));
    }
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSave = () => {
    const created = addProduct({
      name: productName.trim(),
      brand: brand.trim(),
      category,
      purchaseDate,
      purchasePrice: Number(purchasePrice),
      retailerName: retailerName.trim(),
      warrantyDurationMonths: Number(warrantyDurationMonths),
      warrantyStartDate,
      warrantyExpiryDate,
      invoiceNumber: invoiceNumber.trim(),
      invoiceFileName: invoiceFile?.name,
      invoiceFileDataUrl: invoiceFile?.dataUrl,
      invoiceFileType: invoiceFile?.type,
      serialNumber: serialNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    showToast({
      type: 'success',
      title: 'Warranty added to vault',
      description: `${created.name} is now tracked and visible in My Products.`,
    });
    navigate(`/warranty/${created.id}`);
  };

  const previewStatus = getWarrantyStatus(warrantyExpiryDate);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Add New Warranty
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Register a purchased product in four steps with automatic expiry calculation.
        </p>
      </div>

      {/* Step Indicator */}
      <nav aria-label="Registration steps" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STEPS.map((s) => {
          const isCurrent = step === s.id;
          const isComplete = step > s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (s.id < step) {
                  setError('');
                  setStep(s.id);
                }
              }}
              disabled={s.id > step}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors ${
                isCurrent
                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 dark:border-blue-500 dark:bg-blue-950/30 dark:text-white'
                  : isComplete
                  ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-200'
                  : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold tabular-nums ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isComplete
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : s.id}
              </span>
              <span className="truncate text-xs font-semibold">{s.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Form Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Step 1: Product Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Bose QuietComfort Ultra Headphones"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Brand *
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Bose"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Purchase Price (USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="429.00"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Retailer Name *
                </label>
                <input
                  type="text"
                  value={retailerName}
                  onChange={(e) => setRetailerName(e.target.value)}
                  placeholder="e.g. Best Buy"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. SN-8841209"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Step 2: Warranty Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Quick Duration Presets
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {['6', '12', '18', '24', '36', '60'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setWarrantyDurationMonths(m)}
                    className={`rounded-lg border px-3.5 py-1.5 text-xs font-semibold tabular-nums transition-colors ${
                      warrantyDurationMonths === m
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Warranty Duration (Months) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="240"
                  value={warrantyDurationMonths}
                  onChange={(e) => setWarrantyDurationMonths(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Warranty Start Date *
                </label>
                <input
                  type="date"
                  value={warrantyStartDate}
                  onChange={(e) => {
                    setStartSyncedToPurchase(false);
                    setWarrantyStartDate(e.target.value);
                  }}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Calculated Expiry Date *
                </label>
                <input
                  type="date"
                  value={warrantyExpiryDate}
                  onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold tabular-nums text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {warrantyExpiryDate && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Computed Coverage Status
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                    Valid from {formatDisplayDate(warrantyStartDate)} through{' '}
                    {formatDisplayDate(warrantyExpiryDate)}
                  </p>
                </div>
                <StatusBadge status={previewStatus} />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Step 3: Invoice Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Invoice Number *
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. INV-2026-4910"
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                Upload Purchase Invoice (Optional)
              </label>
              <UploadZone
                file={invoiceFile}
                onFileSelect={setInvoiceFile}
                onError={(msg) => setError(msg)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Coverage Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add repair center contacts, extended plan terms, or accessory details..."
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Step 4: Review and Save
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verify your warranty details before registering in Warranty Vault.
                </p>
              </div>
              <StatusBadge status={previewStatus} />
            </div>

            <dl className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-800/40">
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Product</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                  {productName}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Brand · Category</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                  {brand} · {category}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Purchase Date</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900 tabular-nums dark:text-white">
                  {formatDisplayDate(purchaseDate)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Purchase Price</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900 tabular-nums dark:text-white">
                  {formatCurrency(Number(purchasePrice))}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Retailer</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">
                  {retailerName}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Invoice Number</dt>
                <dd className="mt-0.5 font-mono text-sm font-medium text-slate-900 dark:text-white">
                  {invoiceNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Warranty Term</dt>
                <dd className="mt-0.5 text-sm font-medium text-slate-900 tabular-nums dark:text-white">
                  {warrantyDurationMonths} Months
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Warranty Expiry</dt>
                <dd className="mt-0.5 text-sm font-semibold text-blue-700 tabular-nums dark:text-blue-400">
                  {formatDisplayDate(warrantyExpiryDate)}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Previous</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>Save Warranty</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
