import { ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import {
  formatCurrency,
  formatDisplayDate,
  getDaysRemaining,
  getWarrantyStatus,
} from '../utils/warrantyUtils';
import { ProductImage } from './ProductImage';
import { StatusBadge } from './StatusBadge';

interface ProductCardProps {
  product: Product;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const status = getWarrantyStatus(product.warrantyExpiryDate);
  const daysRemaining = getDaysRemaining(product.warrantyExpiryDate);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors duration-150 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="relative overflow-hidden border-b border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          category={product.category}
          className="h-44 w-full transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
              {product.brand} · {product.category}
            </p>
            <h3 className="mt-1 truncate text-base font-semibold text-slate-900 dark:text-white">
              {product.name}
            </h3>
          </div>
          <StatusBadge status={status} compact />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Purchased</dt>
            <dd className="mt-0.5 font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {formatDisplayDate(product.purchaseDate)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Expires</dt>
            <dd className="mt-0.5 font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {formatDisplayDate(product.warrantyExpiryDate)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Coverage</dt>
            <dd className="mt-0.5 font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ended'}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Value</dt>
            <dd className="mt-0.5 font-medium text-slate-900 tabular-nums dark:text-slate-100">
              {formatCurrency(product.purchasePrice)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <Link
            to={`/warranty/${product.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(product)}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 whitespace-nowrap shrink-0 dark:text-slate-400 dark:hover:bg-red-950/50 dark:hover:text-red-400"
            aria-label={`Delete ${product.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
