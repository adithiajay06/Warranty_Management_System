import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  PlusCircle,
  QrCode,
  ScanLine,
  XCircle,
} from 'lucide-react';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ProductImage } from '../components/ProductImage';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import {
  formatCurrency,
  formatDisplayDate,
  formatRelativeTime,
  getDaysRemaining,
  getWarrantyStatus,
} from '../utils/warrantyUtils';

export default function Dashboard() {
  const { user } = useAuth();
  const { products, stats, activities } = useProducts();
  const navigate = useNavigate();

  const statusChartData = useMemo(
    () => [
      { name: 'Active', value: stats.active, color: '#16A34A' },
      { name: 'Expiring Soon', value: stats.expiringSoon, color: '#D97706' },
      { name: 'Expired', value: stats.expired, color: '#DC2626' },
    ],
    [stats]
  );

  const categoryChartData = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      map.set(p.category, (map.get(p.category) || 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({
        name: name.split(' ')[0],
        fullName: name,
        count,
      }))
      .slice(0, 6);
  }, [products]);

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [products]
  );

  const upcomingExpirations = useMemo(
    () =>
      [...products]
        .filter((p) => getDaysRemaining(p.warrantyExpiryDate) > 0)
        .sort(
          (a, b) => getDaysRemaining(a.warrantyExpiryDate) - getDaysRemaining(b.warrantyExpiryDate)
        )
        .slice(0, 4),
    [products]
  );

  return (
    <div className="space-y-6">
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.fullName.split(' ')[0] || 'there'}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Overview of {stats.total} registered {stats.total === 1 ? 'warranty' : 'warranties'} worth{' '}
            <span className="font-semibold text-slate-900 tabular-nums dark:text-white">
              {formatCurrency(stats.totalValue)}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/scanner"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <ScanLine className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>Scan Invoice</span>
          </Link>
          <Link
            to="/add-warranty"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" />
            <span>Add Warranty</span>
          </Link>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={stats.total}
          helperText="Registered in vault"
          icon={Package}
          tone="navy"
          onClick={() => navigate('/products')}
        />
        <StatCard
          label="Active Warranties"
          value={stats.active}
          helperText="Covered beyond 45 days"
          icon={CheckCircle2}
          tone="success"
          onClick={() => navigate('/products?status=Active')}
        />
        <StatCard
          label="Expiring Soon"
          value={stats.expiringSoon}
          helperText="Within next 45 days"
          icon={AlertTriangle}
          tone="warning"
          onClick={() => navigate('/products?status=Expiring+Soon')}
        />
        <StatCard
          label="Expired Warranties"
          value={stats.expired}
          helperText="Coverage period ended"
          icon={XCircle}
          tone="danger"
          onClick={() => navigate('/products?status=Expired')}
        />
      </div>

      {/* Charts & Quick Action Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Warranty Status Distribution Chart */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Warranty Status Distribution
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live breakdown calculated from registered dates
              </p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              Add a warranty to view status distribution.
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-2">
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={76}
                      paddingAngle={3}
                    >
                      {statusChartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {statusChartData.map((item) => {
                  const pct = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="h-3 w-3 rounded-xs shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 tabular-nums dark:text-white">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Products by Category Bar Chart */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Coverage by Category
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Item distribution across hardware categories
          </p>

          {categoryChartData.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
              No category data yet.
            </div>
          ) : (
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Quick Actions Panel */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jump straight to core workflows
          </p>

          <div className="mt-4 space-y-2.5">
            <Link
              to="/scanner"
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
            >
              <span className="flex items-center gap-2.5">
                <ScanLine className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>AI Invoice Scanner</span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </Link>

            <Link
              to="/add-warranty"
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
            >
              <span className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>Manual Registration</span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </Link>

            <Link
              to="/qr-cards"
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
            >
              <span className="flex items-center gap-2.5">
                <QrCode className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>QR Warranty Cards</span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </Link>

            <Link
              to="/products"
              className="flex items-center justify-between rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-800 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
            >
              <span className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                <span>Browse All Products</span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom 3-Column Feed: Recently Added, Upcoming Expirations, Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recently Added Products */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recently Added Products
            </h2>
            <Link
              to="/products"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No products registered yet.
            </div>
          ) : (
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {recentProducts.map((product) => {
                const status = getWarrantyStatus(product.warrantyExpiryDate);
                return (
                  <Link
                    key={product.id}
                    to={`/warranty/${product.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-12 shrink-0 rounded-md border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="truncate text-xs text-slate-500 tabular-nums dark:text-slate-400">
                          {product.brand} · Purchased {formatDisplayDate(product.purchaseDate)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={status} compact />
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Upcoming Expirations */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Upcoming Expirations
            </h2>
            <Link
              to="/notifications"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Alerts
            </Link>
          </div>

          {upcomingExpirations.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No active upcoming expirations.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {upcomingExpirations.map((product) => {
                const days = getDaysRemaining(product.warrantyExpiryDate);
                const status = getWarrantyStatus(product.warrantyExpiryDate);
                return (
                  <Link
                    key={product.id}
                    to={`/warranty/${product.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 tabular-nums dark:text-slate-400">
                        Expires {formatDisplayDate(product.warrantyExpiryDate)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs font-semibold tabular-nums ${
                        status === 'Expiring Soon'
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {days}d left
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h2>

          {activities.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No activity logged yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3.5">
              {activities.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.action}</p>
                    <p className="mt-0.5 text-slate-600 dark:text-slate-400">{item.detail}</p>
                    <p className="mt-1 text-[11px] text-slate-400 tabular-nums">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
