import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  FileCheck2,
  FolderLock,
  Menu,
  QrCode,
  ScanLine,
  ShieldCheck,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-blue-950 whitespace-nowrap shrink-0 dark:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-white dark:bg-blue-600">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>Warranty Vault</span>
          </Link>

          {/* Zone 2: Clean Single-Line Text Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#top"
              className="hover:text-blue-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 dark:hover:text-white"
            >
              Home
            </a>
            <a
              href="#features"
              className="hover:text-blue-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 dark:hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-blue-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 dark:hover:text-white"
            >
              How It Works
            </a>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="hover:text-blue-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 dark:hover:text-white"
            >
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              <span>{isAuthenticated ? 'Open Vault' : 'Get Started'}</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden dark:border-slate-800 dark:text-slate-200"
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              <a href="#top" onClick={() => setMobileNavOpen(false)} className="py-1.5">
                Home
              </a>
              <a href="#features" onClick={() => setMobileNavOpen(false)} className="py-1.5">
                Features
              </a>
              <a href="#how-it-works" onClick={() => setMobileNavOpen(false)} className="py-1.5">
                How It Works
              </a>
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                onClick={() => setMobileNavOpen(false)}
                className="py-1.5"
              >
                {isAuthenticated ? 'Dashboard' : 'Login'}
              </Link>
              <Link
                to={isAuthenticated ? '/dashboard' : '/register'}
                onClick={() => setMobileNavOpen(false)}
                className="mt-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {isAuthenticated ? 'Open Vault' : 'Get Started'}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                Every Warranty. One Secure Place.
              </p>
              <h1
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.6rem)' }}
                className="mt-3 font-extrabold leading-[1.08] tracking-tight text-blue-950 [text-wrap:balance] dark:text-white"
              >
                Never Lose Track of Your Warranties Again.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                Store invoices, track product warranties, and access your purchase records anytime – all in one place.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/register'}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  <span>Explore Features</span>
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-slate-200 pt-7 dark:border-slate-800">
                <div>
                  <p className="text-2xl font-bold text-blue-950 tabular-nums dark:text-white">30 sec</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Average receipt registration</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-950 tabular-nums dark:text-white">45 days</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Early expiration notice window</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-950 tabular-nums dark:text-white">1-tap</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">QR warranty card export</p>
                </div>
              </div>
            </div>

            {/* Interactive Dashboard Preview Illustration */}
            <div className="lg:col-span-6 flex">
              <div className="flex w-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Vault Overview · Personal Portfolio
                    </p>
                    <p className="mt-0.5 text-base font-bold text-slate-900 dark:text-white">
                      Coverage Summary
                    </p>
                  </div>
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                    4 Covered Items
                  </span>
                </div>

                {/* Preview KPI row */}
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Protected Value</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 tabular-nums dark:text-white">$5,164</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600 tabular-nums dark:text-emerald-400">2</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Expiring Soon</p>
                    <p className="mt-1 text-lg font-bold text-amber-600 tabular-nums dark:text-amber-400">2</p>
                  </div>
                </div>

                {/* Preview Product List */}
                <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        Samsung EcoBubble Washing Machine
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                        Best Buy · Expires 15 Jun 2028
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        Apple MacBook Air 13" M3
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                        Apple Store · Expires 20 Mar 2028
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 whitespace-nowrap dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        Sony WH-1000XM5 Headphones
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                        Amazon · Expires 10 Dec 2026
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 whitespace-nowrap dark:text-amber-400">
                      Expiring Soon
                    </span>
                  </div>
                </div>

                {/* Preview Digital QR Card Strip */}
                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-blue-950 p-4 text-white">
                  <div className="min-w-0">
                    <p className="text-xs text-blue-200">Instant Service Desk Verification</p>
                    <p className="mt-0.5 truncate text-sm font-semibold">
                      INV-APL-2026-3109 · AppleCare+
                    </p>
                    <p className="mt-1 font-mono text-xs text-blue-300">
                      warrantyvault.demo/verify/WV-APL-3109
                    </p>
                  </div>
                  <div className="shrink-0 rounded-lg bg-white p-1.5">
                    <QRCodeSVG value="https://warrantyvault.demo/verify/WV-APL-3109" size={56} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Section */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-blue-950 [text-wrap:balance] dark:text-white">
              Built for clear records and zero lost receipts
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Every tool inside Warranty Vault turns paper receipts into structured, searchable warranty records.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Marquee Feature 1 */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <ScanLine className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                01. AI Invoice Scanner
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Upload a receipt image or PDF and run simulated extraction to prefill product name, brand, purchase date, price, retailer, and invoice number. Low-confidence fields are highlighted for quick review before saving.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                <FolderLock className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                02. Digital Warranty Vault
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Organize appliances, laptops, audio gear, and office equipment in one searchable registry with attached purchase invoices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <BellRing className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                03. Expiry Reminders
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Automatic status calculation flags items entering their final 45 days of coverage so you never miss a repair or replacement claim window.
              </p>
            </div>

            {/* Marquee Feature 4 */}
            <div className="rounded-xl border border-slate-200 bg-white p-7 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <QrCode className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                04. QR Warranty Cards
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Generate scannable digital warranty cards for every registered product. Export PNG cards or QR badges containing purchase date, invoice number, and demo verification link for quick service center lookup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-y border-slate-200 bg-white py-16 sm:py-24 dark:border-slate-800 dark:bg-slate-900/40"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-blue-950 [text-wrap:balance] dark:text-white">
              How Warranty Vault works
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
              Four straightforward steps from checkout receipt to verified digital coverage.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01. Upload Invoice',
                desc: 'Drop a JPG, PNG, or PDF purchase receipt into the scanner or manual registration form.',
              },
              {
                step: '02. Extract Information',
                desc: 'Simulated receipt parsing fills product, price, retailer, and invoice IDs with confidence scores.',
              },
              {
                step: '03. Save Warranty',
                desc: 'Confirm the coverage duration to calculate your exact expiration date and store the record.',
              },
              {
                step: '04. Track Expiry',
                desc: 'Monitor active coverage, upcoming expirations, and downloadable QR warranty cards anytime.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <h3 className="text-base font-bold text-blue-950 dark:text-white">{item.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 className="text-3xl font-bold tracking-tight text-blue-950 [text-wrap:balance] dark:text-white">
                Keep proof of purchase ready before hardware issues happen
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Thermal paper receipts fade within months and email confirmations get buried. Warranty Vault keeps every serial number, invoice code, and coverage window structured so claims take minutes instead of hours.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>Automatic calculation of Active, Expiring Soon, and Expired statuses</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>Instant browser persistence via localStorage with zero account setup friction</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>Downloadable PNG warranty certificates and QR verification codes</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-200 bg-blue-950 p-8 text-white dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="h-6 w-6 text-blue-300" aria-hidden="true" />
                  <h3 className="text-xl font-bold">Ready to organize your devices?</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-blue-100">
                  Create a free local demo account or launch with preloaded sample warranties to explore the dashboard, invoice scanner, and QR card generator.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to={isAuthenticated ? '/dashboard' : '/register'}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 whitespace-nowrap shrink-0"
                  >
                    <span>{isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center rounded-lg border border-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 whitespace-nowrap shrink-0"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-blue-950 dark:text-white">
              <ShieldCheck className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <span>Warranty Vault</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Every Warranty. One Secure Place. · Frontend MVP Demo
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white">
              How It Works
            </a>
            <Link to="/login" className="hover:text-slate-900 dark:hover:text-white">
              Login
            </Link>
            <Link to="/register" className="hover:text-slate-900 dark:hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
