import { Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { formatCurrency, formatDisplayDate, getWarrantyStatus } from '../utils/warrantyUtils';
import { ProductImage } from './ProductImage';
import { StatusBadge } from './StatusBadge';

interface ProductTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Purchase Date</th>
              <th className="px-4 py-3">Expiry Date</th>
              <th className="px-4 py-3 text-right">Value</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((product) => {
              const status = getWarrantyStatus(product.warrantyExpiryDate);
              return (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-12 shrink-0 rounded-md border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/warranty/${product.id}`}
                          className="block truncate font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                        >
                          {product.name}
                        </Link>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {product.invoiceNumber}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap dark:text-slate-300">
                    {product.brand}
                  </td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums whitespace-nowrap dark:text-slate-400">
                    {formatDisplayDate(product.purchaseDate)}
                  </td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums whitespace-nowrap dark:text-slate-400">
                    {formatDisplayDate(product.warrantyExpiryDate)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900 tabular-nums whitespace-nowrap dark:text-slate-100">
                    {formatCurrency(product.purchasePrice)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={status} compact />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/warranty/${product.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>View</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-950/50 dark:hover:text-red-400"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
