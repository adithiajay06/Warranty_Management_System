import { LayoutGrid, List, PackagePlus, PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { ProductCard } from '../components/ProductCard';
import { ProductTable } from '../components/ProductTable';
import { SearchBar } from '../components/SearchBar';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { Product, WarrantyStatus } from '../types';
import { getWarrantyStatus } from '../utils/warrantyUtils';

type StatusFilter = 'All' | WarrantyStatus;
type SortOption = 'purchase_desc' | 'purchase_asc' | 'expiry_asc' | 'price_desc';

export default function Products() {
  const { products, deleteProduct, searchQuery, setSearchQuery } = useProducts();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStatus = (searchParams.get('status') as StatusFilter) || 'All';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    ['All', 'Active', 'Expiring Soon', 'Expired'].includes(initialStatus) ? initialStatus : 'All'
  );
  const [sortBy, setSortBy] = useState<SortOption>('purchase_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    const paramStatus = searchParams.get('status') as StatusFilter | null;
    if (paramStatus && ['All', 'Active', 'Expiring Soon', 'Expired'].includes(paramStatus)) {
      setStatusFilter(paramStatus);
    }
  }, [searchParams]);

  const handleFilterChange = (next: StatusFilter) => {
    setStatusFilter(next);
    if (next === 'All') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', next);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((p) => {
      const status = getWarrantyStatus(p.warrantyExpiryDate);
      if (statusFilter !== 'All' && status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.invoiceNumber.toLowerCase().includes(q) ||
        p.retailerName.toLowerCase().includes(q)
      );
    });

    return list.sort((a, b) => {
      if (sortBy === 'purchase_desc') {
        return b.purchaseDate.localeCompare(a.purchaseDate);
      }
      if (sortBy === 'purchase_asc') {
        return a.purchaseDate.localeCompare(b.purchaseDate);
      }
      if (sortBy === 'expiry_asc') {
        return a.warrantyExpiryDate.localeCompare(b.warrantyExpiryDate);
      }
      return b.purchasePrice - a.purchasePrice;
    });
  }, [products, searchQuery, statusFilter, sortBy]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const name = deleteTarget.name;
    deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
    showToast({
      type: 'success',
      title: 'Product deleted',
      description: `${name} was removed from your vault.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Products
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold tabular-nums">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold tabular-nums">{products.length}</span> registered products
          </p>
        </div>

        <Link
          to="/add-warranty"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
        >
          <PlusCircle className="h-4 w-4" aria-hidden="true" />
          <span>Add Warranty</span>
        </Link>
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(['All', 'Active', 'Expiring Soon', 'Expired'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleFilterChange(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Filter by product, brand, invoice..."
            className="w-full sm:w-64"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort warranties"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="purchase_desc">Purchase Date: Newest</option>
            <option value="purchase_asc">Purchase Date: Oldest</option>
            <option value="expiry_asc">Expiry Date: Soonest</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <PackagePlus className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            No matching warranties found
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {products.length === 0
              ? 'Your Warranty Vault is empty. Register your first product or scan an invoice.'
              : 'Try adjusting your search query or status filter to view other products.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(searchQuery || statusFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  handleFilterChange('All');
                }}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Reset Filters
              </button>
            )}
            <Link
              to="/add-warranty"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              <span>Add Warranty</span>
            </Link>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={(item) => setDeleteTarget(item)}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onDelete={(item) => setDeleteTarget(item)}
        />
      )}

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete warranty record?"
        message={
          deleteTarget
            ? `This will permanently remove "${deleteTarget.name}" (${deleteTarget.invoiceNumber}) from your local Warranty Vault.`
            : ''
        }
        confirmLabel="Delete Product"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
