import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Activity, 
  Search, 
  MapPin, 
  Calendar,
  Printer, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Download,
  AlertTriangle,
  History,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { Product, Category, Supplier, Transaction, Sale, AuditLog, UserRole } from '../types';
import { useSettings } from '../context/SettingsContext';

interface ReportsViewProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  transactions: Transaction[];
  sales: Sale[];
  auditLogs: AuditLog[];
  currentBranch: string;
}

export default function ReportsView({
  products,
  categories,
  suppliers,
  transactions,
  sales,
  auditLogs,
  currentBranch
}: ReportsViewProps) {
  const { t } = useSettings();
  const [activeReportTab, setActiveReportTab] = useState<'inventory' | 'sales' | 'transactions' | 'audit'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Filter lists based on current branch selection
  const branchProducts = currentBranch === 'ALL' ? products : products.filter(p => p.branch === currentBranch);
  const branchSales = currentBranch === 'ALL' ? sales : sales.filter(s => s.branch === currentBranch);
  const branchTransactions = currentBranch === 'ALL' ? transactions : transactions.filter(t => t.branch === currentBranch);
  const branchAudits = currentBranch === 'ALL' ? auditLogs : auditLogs.filter(a => a.branch === currentBranch || a.branch === 'ALL');

  const getCategoryName = (catId: string) => categories.find(c => c.id === catId)?.name || 'General';
  const getSupplierName = (supId: string) => suppliers.find(s => s.id === supId)?.name || 'Direct Wholesale';

  // Calculations for static totals
  const totalValuation = branchProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalStockCount = branchProducts.reduce((sum, p) => sum + p.quantity, 0);
  const totalRevenue = branchSales.reduce((sum, s) => sum + s.totalAmount, 0);

  // Filtered tables based on search filters
  const filteredProductsReport = branchProducts.filter(p => {
    const query = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const cat = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    return query && cat;
  });

  const filteredSalesReport = branchSales.filter(s => 
    s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransactionsReport = branchTransactions.filter(t => {
    const pName = products.find(p => p.id === t.productId)?.name.toLowerCase() || '';
    return pName.includes(searchQuery.toLowerCase()) || t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || t.reason.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredAuditsReport = branchAudits.filter(a => 
    a.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.userRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerMockDownload = () => {
    alert(`CSV file generated successfully! Downloading StockMaster_${activeReportTab}_report.csv...`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5 shrink-0">
        <div>
          <h2 className="text-xl font-sans font-semibold tracking-tight text-slate-900">{t('rep.title')}</h2>
          <p className="text-xs text-slate-400 mt-1">{t('rep.desc')}</p>
        </div>
        
        {/* Actions bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerMockDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.8 bg-white border border-slate-200 hover:border-slate-350 text-xs text-slate-650 rounded-md shadow-3xs cursor-pointer transition"
          >
            <Download className="h-4 w-4 text-slate-400" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.8 bg-slate-950 hover:bg-slate-900 text-xs text-white rounded-md shadow-3xs cursor-pointer transition"
          >
            <Printer className="h-4 w-4" /> Print Sheet
          </button>
        </div>
      </div>

      {/* Analytical Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border rounded-xl p-4.5 space-y-1 shadow-3xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{t('rep.totalInventory')}</span>
            <FileText className="h-4 w-4 text-slate-450" />
          </div>
          <p className="text-xl font-sans font-bold text-slate-900">{totalStockCount.toLocaleString()} <span className="text-xs font-mono font-medium text-slate-400">units</span></p>
        </div>

        <div className="bg-white border rounded-xl p-4.5 space-y-1 shadow-3xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{t('dash.totalValue')}</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-xl font-sans font-bold text-slate-900">KES {totalValuation.toLocaleString()}</p>
        </div>

        <div className="bg-white border rounded-xl p-4.5 space-y-1 shadow-3xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">{t('rep.turnover')}</span>
            <CheckCircle className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-xl font-sans font-bold text-slate-900">KES {totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Grid Filter and Ledger Tab Panels */}
      <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs flex flex-col">
        
        {/* Ledger Category selector */}
        <div className="flex border-b border-slate-100 bg-slate-50/40 p-1 flex-wrap shrink-0">
          <button
            onClick={() => {
              setActiveReportTab('inventory');
              setSearchQuery('');
            }}
            className={`py-2 px-4.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeReportTab === 'inventory' ? 'bg-white text-slate-900 shadow-3xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="h-4 w-4" /> {t('nav.products')}
          </button>
          
          <button
            onClick={() => {
              setActiveReportTab('sales');
              setSearchQuery('');
            }}
            className={`py-2 px-4.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeReportTab === 'sales' ? 'bg-white text-slate-900 shadow-3xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="h-4 w-4" /> {t('nav.sales')}
          </button>

          <button
            onClick={() => {
              setActiveReportTab('transactions');
              setSearchQuery('');
            }}
            className={`py-2 px-4.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeReportTab === 'transactions' ? 'bg-white text-slate-900 shadow-3xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="h-4 w-4" /> {t('nav.stock')}
          </button>

          <button
            onClick={() => {
              setActiveReportTab('audit');
              setSearchQuery('');
            }}
            className={`py-2 px-4.5 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeReportTab === 'audit' ? 'bg-white text-slate-900 shadow-3xs font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="h-4 w-4" /> {t('rep.activityAudit')}
          </button>
        </div>

        {/* Dynamic Inner Filter options */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/10 shrink-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('btn.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.8 text-xs font-sans bg-white border border-slate-205 rounded-md focus:outline-none"
            />
          </div>

          {activeReportTab === 'inventory' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-sans text-slate-650 bg-white border border-slate-200 rounded-md py-1.8 px-2 cursor-pointer focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Dynamic Table Sheets */}
        <div className="flex-1 overflow-x-auto min-h-[40vh] max-h-[50vh]">
          {activeReportTab === 'inventory' && (
            <table className="w-full text-left text-xs font-sans text-slate-700 min-w-[700px]">
              <thead className="bg-slate-50/50 text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase border-b border-slate-100 sticky top-0 bg-white z-10">
                <tr>
                  <th className="py-3 px-5">PRODUCT</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">CATEGORY</th>
                  <th className="py-3 px-3">WHIP VALUE</th>
                  <th className="py-3 px-3">QUANTITY</th>
                  <th className="py-3 px-3">TOTAL ASSET VALUE</th>
                  <th className="py-3 px-5">DEALER SUPPLIER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProductsReport.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/40">
                    <td className="py-3 px-5 font-medium text-slate-900">{p.name}</td>
                    <td className="py-3 px-3 font-mono text-[10.5px] text-slate-450">{p.sku}</td>
                    <td className="py-3 px-3 font-medium text-slate-600">{getCategoryName(p.categoryId)}</td>
                    <td className="py-3 px-3 font-mono">KES {p.price.toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono">
                      <span className={`font-semibold ${p.quantity <= p.minLevel ? 'text-rose-550' : 'text-slate-805'}`}>{p.quantity}</span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">KES {(p.price * p.quantity).toLocaleString()}</td>
                    <td className="py-3 px-5 text-slate-550">{getSupplierName(p.supplierId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReportTab === 'sales' && (
            <table className="w-full text-left text-xs font-sans text-slate-700 min-w-[700px]">
              <thead className="bg-slate-50/50 text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase border-b border-slate-100 sticky top-0 bg-white z-10">
                <tr>
                  <th className="py-3 px-5">RECEIPT ID</th>
                  <th className="py-3 px-3">CLIENT</th>
                  <th className="py-3 px-3">BRANCH</th>
                  <th className="py-3 px-3">PAYMENT MODE</th>
                  <th className="py-3 px-3">CASHIER REGISTER</th>
                  <th className="py-3 px-3">GROSS SUM</th>
                  <th className="py-3 px-5">DATE & TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSalesReport.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/40">
                    <td className="py-3 px-5 font-mono font-bold text-slate-900">{s.receiptNumber}</td>
                    <td className="py-3 px-3 font-medium text-slate-830">{s.customerName}</td>
                    <td className="py-3 px-3 flex items-center gap-0.5 mt-2.5 text-slate-500 font-medium"><MapPin className="h-3 w-3 shrink-0" /> {s.branch}</td>
                    <td className="py-3 px-3 uppercase text-[10px] font-semibold text-slate-600 font-mono">{s.paymentMethod.replace('_', ' ')}</td>
                    <td className="py-3 px-3 text-slate-600">{s.userName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">KES {s.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-5 font-mono text-slate-400">{new Date(s.date).toLocaleString('en-KE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReportTab === 'transactions' && (
            <table className="w-full text-left text-xs font-sans text-slate-700 min-w-[700px]">
              <thead className="bg-slate-50/50 text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase border-b border-slate-100 sticky top-0 bg-white z-10">
                <tr>
                  <th className="py-3 px-5">TX ID</th>
                  <th className="py-3 px-3">PRODUCT</th>
                  <th className="py-3 px-3">ADJUST QUANTITY</th>
                  <th className="py-3 px-3">DIRECTIONS TYPE</th>
                  <th className="py-3 px-3">REASON CODE</th>
                  <th className="py-3 px-3">RECORDED BY</th>
                  <th className="py-3 px-5">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactionsReport.map(tx => {
                  const pName = products.find(p => p.id === tx.productId)?.name || 'Deleted Product';
                  const isStockIn = tx.type === 'in';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/40">
                      <td className="py-3 px-5 font-mono text-slate-450">{tx.id}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{pName}</td>
                      <td className="py-3 px-3 font-mono font-semibold">
                        <span className={isStockIn ? 'text-emerald-600' : 'text-rose-550'}>
                          {isStockIn ? '+' : '-'}{tx.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold uppercase border tracking-wider leading-none ${isStockIn ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-rose-50 text-rose-700 border-rose-150'}`}>
                          {isStockIn ? 'Stock In' : 'Stock Out'}
                        </span>
                      </td>
                      <td className="py-3 px-3 uppercase text-[9.5px] font-mono text-slate-550 font-bold">{tx.reason}</td>
                      <td className="py-3 px-3 text-slate-555">{tx.userName}</td>
                      <td className="py-3 px-5 font-mono text-slate-400">{new Date(tx.date).toLocaleDateString('en-KE')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeReportTab === 'audit' && (
            <table className="w-full text-left text-xs font-sans text-slate-700 min-w-[700px]">
              <thead className="bg-slate-50/50 text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase border-b border-slate-100 sticky top-0 bg-white z-10">
                <tr>
                  <th className="py-3 px-5">AUDIT TIMESTAMP</th>
                  <th className="py-3 px-3">EMPLOYEE</th>
                  <th className="py-3 px-3">ROLE PERMISSION</th>
                  <th className="py-3 px-3">BRANCH DECK</th>
                  <th className="py-3 px-5">ACTION DESCRIPTION JOURNAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAuditsReport.map(a => {
                  const getRoleBadgeColor = (role: UserRole) => {
                    switch (role) {
                      case UserRole.ADMIN: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
                      case UserRole.STORE_MANAGER: return 'bg-blue-50 text-blue-700 border-blue-100';
                      case UserRole.STAFF: return 'bg-amber-50 text-amber-700 border-amber-100';
                    }
                  };
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/40">
                      <td className="py-3 px-5 font-mono text-slate-400 break-keep flex items-center gap-1.5 mt-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(a.date).toLocaleString('en-KE')}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">{a.userName}</td>
                      <td className="py-3 px-3">
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-semibold uppercase border ${getRoleBadgeColor(a.userRole)}`}>
                          {a.userRole.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-medium flex items-center gap-0.5 mt-2.5"><MapPin className="h-3 w-3 shrink-0" /> {a.branch}</td>
                      <td className="py-3 px-5 font-sans text-slate-700 font-medium max-w-[300px] leading-relaxed select-text">{a.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
}
