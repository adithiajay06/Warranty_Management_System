import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ToastNotification } from './components/ToastNotification';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ToastProvider } from './context/ToastContext';
import AddWarranty from './pages/AddWarranty';
import Dashboard from './pages/Dashboard';
import InvoiceScanner from './pages/InvoiceScanner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import Products from './pages/Products';
import QRCards from './pages/QRCards';
import Register from './pages/Register';
import Settings from './pages/Settings';
import WarrantyDetails from './pages/WarrantyDetails';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated Workspace Routes */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/add-warranty" element={<AddWarranty />} />
                <Route path="/scanner" element={<InvoiceScanner />} />
                <Route path="/warranty/:id" element={<WarrantyDetails />} />
                <Route path="/qr-cards" element={<QRCards />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastNotification />
          </BrowserRouter>
        </ProductProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
