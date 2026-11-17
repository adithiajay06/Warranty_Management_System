import {
  Bell,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  QrCode,
  ScanLine,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { logout } = useAuth();
  const { unreadCount } = useProducts();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/products', label: 'My Products', icon: Package },
    { to: '/add-warranty', label: 'Add Warranty', icon: PlusCircle },
    { to: '/scanner', label: 'Invoice Scanner', icon: ScanLine },
    { to: '/qr-cards', label: 'QR Warranty Cards', icon: QrCode },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    showToast({ type: 'info', title: 'Signed out', description: 'Your Warranty Vault session ended.' });
    navigate('/login');
  };

  const navContent = (
    <div className="flex h-full flex-col bg-blue-950 text-slate-200">
      <div className="flex h-16 items-center justify-between border-b border-blue-900/70 px-5">
        <NavLink
          to="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 text-white whitespace-nowrap shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-base font-bold tracking-tight">Warranty Vault</span>
        </NavLink>

        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-lg p-1.5 text-slate-300 hover:bg-blue-900 hover:text-white lg:hidden"
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Primary Sidebar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-blue-900/70 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </span>
              {item.badge !== undefined && (
                <span className="rounded-md bg-blue-500/30 px-2 py-0.5 text-xs font-semibold text-white tabular-nums">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-blue-900/70 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-blue-900/70 hover:text-white whitespace-nowrap"
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">{navContent}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <aside className="relative z-10 w-64 max-w-[80vw]">{navContent}</aside>
        </div>
      )}
    </>
  );
}
