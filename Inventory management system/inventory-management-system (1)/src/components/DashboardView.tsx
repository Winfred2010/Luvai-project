import React from 'react';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  AlertCircle,
  Calendar,
  CheckCircle2,
  Boxes,
  ActivityIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Product, Category, Supplier, Transaction, Sale, UserRole } from '../types';
import { useSettings } from '../context/SettingsContext';

interface DashboardViewProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  transactions: Transaction[];
  sales: Sale[];
  currentBranch: string;
}

export default function DashboardView({
  products,
  categories,
  suppliers,
  transactions,
  sales,
  currentBranch
}: DashboardViewProps) {
  const { t } = useSettings();


  // Current date for comparison: 2026-06-17
  const CURRENT_DATE = new Date('2026-06-17');

  // Filter products by branch if appropriate
  const branchProducts = currentBranch === 'ALL' 
    ? products 
    : products.filter(p => p.branch === currentBranch);

  const branchSales = currentBranch === 'ALL'
    ? sales
    : sales.filter(s => s.branch === currentBranch);

  const branchTransactions = currentBranch === 'ALL'
    ? transactions
    : transactions.filter(t => t.branch === currentBranch);

  // 1. Calculations & Metrics
  const totalProducts = branchProducts.length;
  
  const totalStockValue = branchProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  
  const lowStockItems = branchProducts.filter(p => p.quantity > 0 && p.quantity <= p.minLevel);
  const outOfStockItems = branchProducts.filter(p => p.quantity === 0);
  const lowStockCount = lowStockItems.length;
  const outOfStockCount = outOfStockItems.length;

  // Sales Today calculation (Simulate using June 17, 2026 transactions from active state)
  const salesTodayAmount = branchSales
    .filter(s => {
      const sDate = new Date(s.date);
      return sDate.getFullYear() === 2026 && sDate.getMonth() === 5 && sDate.getDate() === 17;
    })
    .reduce((sum, s) => sum + s.totalAmount, 0);

  const totalSuppliers = suppliers.length;

  // 2. Chart A: Stock Value by Category
  const stockByCategoryData = categories.map(cat => {
    const catProducts = branchProducts.filter(p => p.categoryId === cat.id);
    const value = catProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const itemsCount = catProducts.reduce((sum, p) => sum + p.quantity, 0);
    return {
      name: cat.name,
      value: value,
      itemsCount: itemsCount
    };
  }).filter(data => data.value > 0);

  // Colors for charts
  const CHART_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  // 3. Chart B: Sales revenue matching simulated timeline dates (June 10 to June 17, 2026)
  // Fill empty days cleanly
  const dates = ['2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14', '2026-06-15', '2026-06-16', '2026-06-17'];
  const dailySalesData = dates.map(dStr => {
    const rawDate = new Date(dStr);
    const amount = branchSales
      .filter(s => {
        const sDate = new Date(s.date);
        return sDate.getFullYear() === rawDate.getFullYear() && 
               sDate.getMonth() === rawDate.getMonth() && 
               sDate.getDate() === rawDate.getDate();
      })
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const formattedDate = new Date(dStr).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' });
    return {
      date: formattedDate,
      Revenue: amount
    };
  });

  // 4. Products expiring soon tracker (within next 30 days)
  const expiringProducts = branchProducts.filter(p => {
    if (!p.expiryDate) return false;
    const exp = new Date(p.expiryDate);
    const diffTime = exp.getTime() - CURRENT_DATE.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30; // within 30 days
  }).map(p => {
    const exp = new Date(p.expiryDate!);
    const diffDays = Math.ceil((exp.getTime() - CURRENT_DATE.getTime()) / (1000 * 60 * 60 * 24));
    return {
      ...p,
      daysLeft: diffDays
    };
  });

  // 5. Top selling items based on volume sold
  const productSalesMap: { [key: string]: { name: string, qty: number, revenue: number } } = {};
  branchSales.forEach(s => {
    s.items.forEach(item => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.price * item.quantity;
    });
  });

  const topSellingProducts = Object.keys(productSalesMap)
    .map(id => ({ id, ...productSalesMap[id] }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h2 className="text-xl font-sans font-semibold tracking-tight text-slate-900">{t('nav.dashboard')}</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time status metrics and warehouse indicators for <span className="font-semibold text-violet-605">{currentBranch === 'ALL' ? t('gen.all') : currentBranch}</span>.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-mono font-medium text-slate-600">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>June 17, 2026</span>
          </div>
        </div>
      </div>

      {/* Grid: Analytic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Products */}
        <div className="bg-white border border-slate-100 rounded-lg p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">{t('dash.skus')}</span>
            <div className="text-2xl font-semibold text-slate-900 font-sans tracking-tight">{totalProducts}</div>
            <p className="text-[10px] text-slate-550 flex items-center gap-1 text-emerald-600 font-medium">
              <TrendingUp className="h-3 w-3" /> Fully monitored in loop
            </p>
          </div>
          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-slate-50 text-slate-800">
            <Package className="h-5 w-5 text-indigo-505" />
          </div>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white border border-slate-100 rounded-lg p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">{t('dash.value')}</span>
            <div className="text-2xl font-semibold text-slate-900 font-sans tracking-tight">KES {totalStockValue.toLocaleString()}</div>
            <p className="text-[10px] text-slate-500 font-mono">Durable capital assets</p>
          </div>
          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-slate-100 text-slate-900 font-bold text-base">
            KES
          </div>
        </div>

        {/* Low Stock alerting */}
        <div className="bg-white border border-slate-100 rounded-lg p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">{t('dash.alerts')}</span>
            <div className="text-2xl font-semibold text-slate-900 font-sans tracking-tight">
              <span className="text-rose-600">{lowStockCount}</span>
              <span className="text-slate-350 text-sm font-medium mx-1.5">/</span>
              <span className="text-red-700">{outOfStockCount}</span>
            </div>
            <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
              {lowStockCount + outOfStockCount > 0 ? (
                <>
                  <AlertTriangle className="h-3 w-3 text-rose-500 shrink-0" />
                  <span className="text-rose-600 font-medium">Action required</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="text-emerald-600 font-medium">Fully stocked</span>
                </>
              )}
            </p>
          </div>
          <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-lg ${lowStockCount + outOfStockCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        {/* Sales simulation Today */}
        <div className="bg-white border border-slate-100 rounded-lg p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">{t('dash.salesToday')}</span>
            <div className="text-2xl font-semibold text-slate-900 font-sans tracking-tight">KES {salesTodayAmount.toLocaleString()}</div>
            <p className="text-[10px] text-slate-555 flex items-center gap-1 font-medium text-emerald-600">
              <Activity className="h-3 w-3" /> Live sales loop registry
            </p>
          </div>
          <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-indigo-50/50 text-indigo-600 text-indigo-505 bg-indigo-50">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Critical Action Alerts Section (Low stock alerts, Expiry alerts) */}
      {(lowStockItems.length > 0 || expiringProducts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Low Stock Warning List */}
          {lowStockItems.length > 0 && (
            <div className="border border-rose-100 bg-rose-50/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-rose-700 font-sans text-xs font-semibold uppercase tracking-wider mb-3">
                <AlertCircle className="h-4.5 w-4.5" /> 🚨 {t('dash.alerts')} / {t('prod.quantity')}
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {lowStockItems.map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-white border border-rose-100 rounded p-2.5 shadow-3xs">
                    <div className="min-w-0 flex-1 pr-3">
                      <span className="text-xs font-sans font-medium text-slate-800 break-words block leading-snug">{p.name}</span>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{p.sku} | Branch: {p.branch}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-rose-600 block">{t('prod.quantity')}: {p.quantity}</span>
                      <span className="text-[9px] text-slate-400 block uppercase font-mono">Min: {p.minLevel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Expiry Warning List */}
          {expiringProducts.length > 0 && (
            <div className="border border-amber-100 bg-amber-50/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-700 font-sans text-xs font-semibold uppercase tracking-wider mb-3">
                <Calendar className="h-4.5 w-4.5" /> ⚠️ Expiry warnings
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {expiringProducts.map(p => (
                  <div key={p.id} className="flex justify-between items-center bg-white border border-amber-100 rounded p-2.5 shadow-3xs">
                    <div className="min-w-0 flex-1 pr-3">
                      <span className="text-xs font-sans font-medium text-slate-800 break-words block leading-snug">{p.name}</span>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">Expiry: {new Date(p.expiryDate!).toLocaleDateString('en-KE')}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 text-[9px] font-semibold rounded bg-amber-50 text-amber-700 border border-amber-100 block font-mono">
                        {p.daysLeft} days active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales revenue trends (Line Chart) */}
        <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-2xs lg:col-span-2 flex flex-col h-80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-sans font-semibold text-slate-800 uppercase tracking-wider">Revenue Analysis Graph</h3>
              <p className="text-[10px] text-slate-400">Past 8 days of completed POS sales</p>
            </div>
            <span className="text-[9px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live Stream</span>
          </div>
          <div className="flex-1 w-full min-h-0 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySalesData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '4px', color: '#fff' }} 
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, strokeWidth: 0, fill: '#6366f1' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Value by Category (Horizontal Bar/Pie Chart representation) */}
        <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-2xs flex flex-col h-80">
          <div>
            <h3 className="text-xs font-sans font-semibold text-slate-800 uppercase tracking-wider">Asset Capital Composition</h3>
            <p className="text-[10px] text-slate-400">Distribution of stock value across departments</p>
          </div>
          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
            {stockByCategoryData.length === 0 ? (
              <span className="text-xs text-slate-400">No stock data available</span>
            ) : (
              <div className="w-full h-full flex flex-col justify-space">
                <div className="flex-1 min-h-16 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockByCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {stockByCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* List Legend */}
                <div className="space-y-1 overflow-y-auto max-h-24 px-1">
                  {stockByCategoryData.slice(0, 4).map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="h-2 w-2 shrink-0 rounded" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                        <span className="font-sans font-medium text-slate-600 truncate">{entry.name}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-800 shrink-0">KES {entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Bottom section (Top products & Recent Audits/activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products list */}
        <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-sans font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Best Selling Products
            </h3>
            <span className="text-[10px] font-mono text-slate-400">By Sales Volume</span>
          </div>

          <div className="flex-1 space-y-3">
            {topSellingProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Boxes className="h-8 w-8 text-slate-300 stroke-1 mb-2" />
                <span className="text-xs text-slate-400">No products sold in this branch yet</span>
              </div>
            ) : (
              topSellingProducts.map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[10px] font-semibold text-slate-500 font-mono">
                      #{idx+1}
                    </span>
                    <span className="text-xs font-sans font-medium text-slate-800 truncate block">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <span className="text-xs font-mono font-medium text-slate-505 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                      {p.qty} unit(s)
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 w-24">
                      KES {p.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Transactions / logs quick look */}
        <div className="bg-white border border-slate-100 rounded-lg p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-sans font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-500" /> Recent Transactions
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Audit trail</span>
          </div>

          <div className="flex-1 space-y-3 max-h-60 overflow-y-auto pr-1">
            {branchTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <ActivityIcon className="h-8 w-8 text-slate-300 stroke-1 mb-2" />
                <span className="text-xs text-slate-400">No recent transaction entries recorded</span>
              </div>
            ) : (
              branchTransactions.slice(-5).reverse().map((tx) => {
                const itemLabel = products.find(p => p.id === tx.productId)?.name || 'Unknown item';
                const isStockIn = tx.type === 'in';
                return (
                  <div key={tx.id} className="flex items-start justify-between gap-3 text-xs border-b border-dashed border-slate-105 pb-2 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isStockIn ? 'bg-emerald-505' : 'bg-rose-500'}`} />
                        <span className="font-sans font-semibold text-slate-800 leading-tight block truncate max-w-[150px]">{itemLabel}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                        {tx.notes || `${tx.reason.toUpperCase()} adjustment`}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`font-mono font-bold ${isStockIn ? 'text-emerald-600' : 'text-rose-550'}`}>
                        {isStockIn ? '+' : '-'}{tx.quantity}
                      </span>
                      <span className="text-[8px] font-mono text-slate-400 block mt-0.5">
                        {new Date(tx.date).toLocaleDateString('en-KE')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
