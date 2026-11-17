import {
  ArrowLeft,
  Download,
  Edit3,
  FileText,
  QrCode,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ProductImage } from '../components/ProductImage';
import { QRCodeModal } from '../components/QRCodeModal';
import { StatusBadge } from '../components/StatusBadge';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { PRODUCT_CATEGORIES } from '../data/mockData';
import {
  calculateExpiryDate,
  downloadWarrantyCardPNG,
  formatCurrency,
  formatDisplayDate,
  getCoverageProgressPercent,
  getDaysRemaining,
  getWarrantyStatus,
} from '../utils/warrantyUtils';

export default function WarrantyDetails() {
  const { id } = useParams<{ id: string }>();
  const { products, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  const [qrOpen, setQrOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(product?.name ?? '');
  const [editBrand, setEditBrand] = useState(product?.brand ?? '');
  const [editCategory, setEditCategory] = useState(product?.category ?? PRODUCT_CATEGORIES[0]);
  const [editPurchaseDate, setEditPurchaseDate] = useState(product?.purchaseDate ?? '');
  const [editPrice, setEditPrice] = useState(String(product?.purchasePrice ?? ''));
  const [editRetailer, setEditRetailer] = useState(product?.retailerName ?? '');
  const [editDuration, setEditDuration] = useState(String(product?.warrantyDurationMonths ?? '12'));
  const [editInvoiceNumber, setEditInvoiceNumber] = useState(product?.invoiceNumber ?? '');
  const [editSerial, setEditSerial] = useState(product?.serialNumber ?? '');
  const [editNotes, setEditNotes] = useState(product?.notes ?? '');

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Warranty record not found</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          This product may have been deleted from your local Warranty Vault.
        </p>
        <Link
          to="/products"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to My Products</span>
        </Link>
      </div>
    );
  }

  const status = getWarrantyStatus(product.warrantyExpiryDate);
  const daysRemaining = getDaysRemaining(product.warrantyExpiryDate);
  const progressPct = getCoverageProgressPercent(
    product.warrantyStartDate,
    product.warrantyExpiryDate
  );

  const openEditModal = () => {
    setEditName(product.name);
    setEditBrand(product.brand);
    setEditCategory(product.category);
    setEditPurchaseDate(product.purchaseDate);
    setEditPrice(String(product.purchasePrice));
    setEditRetailer(product.retailerName);
    setEditDuration(String(product.warrantyDurationMonths));
    setEditInvoiceNumber(product.invoiceNumber);
    setEditSerial(product.serialNumber ?? '');
    setEditNotes(product.notes ?? '');
    setEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = Math.max(1, Number(editDuration) || 12);
    const recalculatedExpiry = calculateExpiryDate(editPurchaseDate, duration);

    updateProduct(product.id, {
      name: editName.trim() || product.name,
      brand: editBrand.trim() || product.brand,
      category: editCategory,
      purchaseDate: editPurchaseDate,
      purchasePrice: Number(editPrice) || 0,
      retailerName: editRetailer.trim() || product.retailerName,
      warrantyDurationMonths: duration,
      warrantyStartDate: editPurchaseDate,
      warrantyExpiryDate: recalculatedExpiry,
      invoiceNumber: editInvoiceNumber.trim() || product.invoiceNumber,
      serialNumber: editSerial.trim() || undefined,
      notes: editNotes.trim() || undefined,
    });

    setEditOpen(false);
    showToast({
      type: 'success',
      title: 'Warranty updated',
      description: 'Expiry date and dashboard counts were recalculated.',
    });
  };

  const handleDownloadCard = () => {
    downloadWarrantyCardPNG(product);
    showToast({
      type: 'success',
      title: 'Warranty card downloaded',
      description: 'Saved digital warranty certificate PNG.',
    });
  };

  const handleDeleteConfirm = () => {
    deleteProduct(product.id);
    showToast({
      type: 'success',
      title: 'Warranty deleted',
      description: `${product.name} removed from your vault.`,
    });
    navigate('/products');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to My Products</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setInvoiceModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span>View Invoice</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCard}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Download Warranty Card</span>
          </button>

          <button
            type="button"
            onClick={() => setQrOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 whitespace-nowrap shrink-0"
          >
            <QrCode className="h-4 w-4" aria-hidden="true" />
            <span>Generate QR Code</span>
          </button>

          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Edit3 className="h-4 w-4" aria-hidden="true" />
            <span>Edit Details</span>
          </button>
        </div>
      </div>

      {/* Main Digital Warranty Certificate Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              category={product.category}
              className="h-72 w-full"
            />
            <div className="border-t border-slate-100 p-5 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Coverage Timeline
                </span>
                <span className="text-xs font-semibold text-slate-700 tabular-nums dark:text-slate-200">
                  {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${
                    status === 'Active'
                      ? 'bg-emerald-600'
                      : status === 'Expiring Soon'
                      ? 'bg-amber-500'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
                <span>Start: {formatDisplayDate(product.warrantyStartDate)}</span>
                <span>End: {formatDisplayDate(product.warrantyExpiryDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-4 bg-blue-950 p-6 text-white">
              <div>
                <p className="text-xs font-medium text-blue-200">
                  {product.brand} · {product.category}
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">{product.name}</h1>
              </div>
              <StatusBadge status={status} />
            </div>

            <div className="p-6">
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Purchase Date</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                    {formatDisplayDate(product.purchaseDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Purchase Price</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                    {formatCurrency(product.purchasePrice)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Warranty Start Date</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                    {formatDisplayDate(product.warrantyStartDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Warranty Duration</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
                    {product.warrantyDurationMonths} Months
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Expiry Date</dt>
                  <dd className="mt-1 text-sm font-bold text-blue-700 tabular-nums dark:text-blue-400">
                    {formatDisplayDate(product.warrantyExpiryDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Retailer</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {product.retailerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Invoice Number</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">
                    {product.invoiceNumber}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">Serial Number</dt>
                  <dd className="mt-1 font-mono text-sm text-slate-700 dark:text-slate-300">
                    {product.serialNumber || 'Not specified'}
                  </dd>
                </div>
              </dl>

              {product.notes && (
                <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Coverage Notes
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{product.notes}</p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                <span className="font-mono text-xs text-slate-400">
                  Token: {product.qrCodeToken}
                </span>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Delete Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Invoice Modal */}
      {invoiceModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Stored Purchase Invoice · {product.invoiceNumber}
              </h3>
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              {product.invoiceFileDataUrl && !product.invoiceFileType?.includes('pdf') ? (
                <img
                  src={product.invoiceFileDataUrl}
                  alt={`Invoice for ${product.name}`}
                  className="max-h-96 w-full rounded-lg border border-slate-200 object-contain dark:border-slate-700"
                />
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
                    <div>
                      <p className="text-base font-bold text-slate-900 dark:text-white">
                        {product.retailerName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Digital Purchase Receipt Summary
                      </p>
                    </div>
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {product.invoiceNumber}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Item</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Brand</span>
                      <span className="text-slate-900 dark:text-white">{product.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Date of Purchase</span>
                      <span className="tabular-nums text-slate-900 dark:text-white">
                        {formatDisplayDate(product.purchaseDate)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3 font-bold dark:border-slate-700">
                      <span className="text-slate-900 dark:text-white">Total Paid</span>
                      <span className="tabular-nums text-blue-600 dark:text-blue-400">
                        {formatCurrency(product.purchasePrice)}
                      </span>
                    </div>
                  </div>
                  {product.invoiceFileName && (
                    <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                      Attached file: {product.invoiceFileName}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Details Modal */}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Edit Warranty Details
              </h3>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Brand
                </label>
                <input
                  type="text"
                  required
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Purchase Date
                </label>
                <input
                  type="date"
                  required
                  value={editPurchaseDate}
                  onChange={(e) => setEditPurchaseDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Warranty Duration (Months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="240"
                  required
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Purchase Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Retailer
                </label>
                <input
                  type="text"
                  required
                  value={editRetailer}
                  onChange={(e) => setEditRetailer(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Invoice Number
                </label>
                <input
                  type="text"
                  required
                  value={editInvoiceNumber}
                  onChange={(e) => setEditInvoiceNumber(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={editSerial}
                  onChange={(e) => setEditSerial(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 sm:col-span-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <QRCodeModal
        product={qrOpen ? product : null}
        onClose={() => setQrOpen(false)}
        onDownloadSuccess={() =>
          showToast({ type: 'success', title: 'QR code downloaded', description: 'Saved PNG image.' })
        }
      />

      <ConfirmationModal
        isOpen={deleteOpen}
        title="Delete warranty record?"
        message={`This will permanently remove "${product.name}" from your Warranty Vault.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
