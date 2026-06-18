import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Boxes, 
  RefreshCw, 
  AlertCircle, 
  MapPin, 
  Bell, 
  Calendar,
  Layers, 
  CheckCircle,
  Menu,
  ChevronDown,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { User, Category, Supplier, Product, Transaction, Sale, AuditLog, UserRole } from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ProductManagementView from './components/ProductManagementView';
import SupplierView from './components/SupplierView';
import StockAdjustmentView from './components/StockAdjustmentView';
import SalesView from './components/SalesView';
import ReportsView from './components/ReportsView';
import { useSettings } from './context/SettingsContext';
import { Language } from './translations';

export default function App() {
  const { t, darkMode, setDarkMode, language, setLanguage } = useSettings();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentBranch, setCurrentBranch] = useState('Nairobi HQ'); // Nairobi HQ is default

  
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [branches, setBranches] = useState<string[]>(['Nairobi HQ', 'Nakuru Branch', 'Mombasa Branch']);
  const [usersList, setUsersList] = useState<User[]>([]);
  
  // Active User session (Simulated for persona role overrides)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load from REST servers
  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) {
        throw new Error('Database server offline');
      }
      const data = await res.json();
      
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setSuppliers(data.suppliers || []);
      setTransactions(data.transactions || []);
      setSales(data.sales || []);
      setAuditLogs(data.auditLogs || []);
      setBranches(data.branches || ['Nairobi HQ', 'Nakuru Branch', 'Mombasa Branch']);
      setUsersList(data.users || []);

      // If active user is still null, set to first user (Admin Winfred Luvai!)
      if (!currentUser && data.users && data.users.length > 0) {
        setCurrentUser(data.users[0]);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to establish contact with full-stack storage services. Rebuilding states...');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute metrics counts for Notification badges in Sidebar top level
  // Low Stock criteria: items in current branch where quantity is less than minimum alerts boundary
  const currentBranchProducts = currentBranch === 'ALL'
    ? products
    : products.filter(p => p.branch === currentBranch);

  const lowStockCount = currentBranchProducts.filter(p => p.quantity > 0 && p.quantity <= p.minLevel).length;

  // Expiring count within next 30 days
  const CURRENT_DATE = new Date('2026-06-17');
  const expiringCount = currentBranchProducts.filter(p => {
    if (!p.expiryDate) return false;
    const exp = new Date(p.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - CURRENT_DATE.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }).length;

  // Main UI routing renderer
  const renderTabContent = () => {
    if (!currentUser) return null;

    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            products={products}
            categories={categories}
            suppliers={suppliers}
            transactions={transactions}
            sales={sales}
            currentBranch={currentBranch}
          />
        );
      case 'products':
        return (
          <ProductManagementView
            products={products}
            categories={categories}
            suppliers={suppliers}
            currentUser={currentUser}
            currentBranch={currentBranch}
            onRefreshData={fetchData}
          />
        );
      case 'suppliers':
        return (
          <SupplierView
            suppliers={suppliers}
            products={products}
            currentUser={currentUser}
            onRefreshData={fetchData}
          />
        );
      case 'stock-adjust':
        return (
          <StockAdjustmentView
            products={products}
            categories={categories}
            suppliers={suppliers}
            currentUser={currentUser}
            currentBranch={currentBranch}
            onRefreshData={fetchData}
          />
        );
      case 'sales':
        return (
          <SalesView
            products={products}
            categories={categories}
            currentUser={currentUser}
            currentBranch={currentBranch}
            onRefreshData={fetchData}
          />
        );
      case 'reports':
        return (
          <ReportsView
            products={products}
            categories={categories}
            suppliers={suppliers}
            transactions={transactions}
            sales={sales}
            auditLogs={auditLogs}
            currentBranch={currentBranch}
          />
        );
      default:
        return (
          <DashboardView
            products={products}
            categories={categories}
            suppliers={suppliers}
            transactions={transactions}
            sales={sales}
            currentBranch={currentBranch}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div id="loading-stage" className="fixed inset-0 h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3 animate-pulse">
        <Boxes className="h-10 w-10 text-indigo-505 animate-spin" />
        <h3 className="font-sans font-bold tracking-widest text-xs uppercase text-slate-300">Loading Warehouse Ledger Data...</h3>
        <p className="text-[10px] font-mono text-slate-500">StockMaster Portal Version 1.0.5</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div id="error-stage" className="fixed inset-0 h-screen w-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-slate-100 gap-4">
        <AlertCircle className="h-12 w-12 text-rose-500 animate-bounce" />
        <h3 className="font-sans font-bold text-lg">{errorMsg}</h3>
        <button
          onClick={fetchData}
          className="px-5 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reconnect Database
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070814] text-slate-800 dark:text-slate-150 flex overflow-hidden select-none transition-colors duration-200">
      
      {/* Sidebar Controller Segment (Left side pane) */}
      {currentUser && (
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          usersList={usersList}
          currentBranch={currentBranch}
          setCurrentBranch={setCurrentBranch}
          branches={[...branches, 'ALL']} // Append 'ALL' branch for combined supervisor ledger lookups
          lowStockCount={lowStockCount}
          expiringCount={expiringCount}
        />
      )}

      {/* Main Container Core (Right dynamic content panel) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Global Premium Control Bar (Theme & Translator Core) */}
        <header className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-200 dark:border-[#1e2040] bg-white dark:bg-[#0c0d21] z-10 transition-all duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-705 dark:text-slate-200 uppercase tracking-wider font-mono">
              {t(`nav.${currentTab}`)}
            </span>
            <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-150/40">
              <MapPin className="h-3 w-3" />
              {currentBranch === 'ALL' ? t('gen.all') : currentBranch}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Visual Theme Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-slate-200 dark:border-[#27284d] hover:bg-slate-100 dark:hover:bg-[#161835] text-slate-600 dark:text-slate-300 transition-all flex items-center justify-center cursor-pointer"
              title={darkMode ? t('gen.light') : t('gen.dark')}
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-500" />
              )}
            </button>

            {/* Language Switch Dropdown (With Flags) */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#27284d] bg-white dark:bg-[#161835] hover:bg-slate-50 dark:hover:bg-[#1e2040] transition-all">
              <Globe className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="text-xs font-semibold text-slate-700 dark:text-slate-200 bg-transparent border-none outline-none focus:ring-0 cursor-pointer p-0 pr-1"
                style={{ WebkitAppearance: 'none', appearance: 'none', border: 'none' }}
              >
                <option value="en" className="dark:bg-[#0c0d21] dark:text-white">🇬🇧 EN</option>
                <option value="sw" className="dark:bg-[#0c0d21] dark:text-white">🇰🇪 SW</option>
                <option value="fr" className="dark:bg-[#0c0d21] dark:text-white">🇫🇷 FR</option>
                <option value="es" className="dark:bg-[#0c0d21] dark:text-white">🇪🇸 ES</option>
                <option value="hi" className="dark:bg-[#0c0d21] dark:text-white">🇮🇳 HI</option>
                <option value="zh" className="dark:bg-[#0c0d21] dark:text-white">🇨🇳 ZH</option>
                <option value="pt" className="dark:bg-[#0c0d21] dark:text-white">🇵🇹 PT</option>
              </select>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab + currentBranch}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex-1 flex flex-col min-h-0"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
