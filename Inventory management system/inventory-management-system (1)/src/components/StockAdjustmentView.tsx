import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Package,
  Users,
  QrCode,
  Camera,
  Layers,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Product, Category, Supplier, User, UserRole } from '../types';
import ScannerModal from './ScannerModal';
import { useSettings } from '../context/SettingsContext';

interface StockAdjustmentViewProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  currentUser: User;
  currentBranch: string;
  onRefreshData: () => void;
}

export default function StockAdjustmentView({
  products,
  categories,
  suppliers,
  currentUser,
  currentBranch,
  onRefreshData
}: StockAdjustmentViewProps) {
  const { t } = useSettings();

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [type, setType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState<'purchase' | 'damaged' | 'expired' | 'adjustment'>('purchase');
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Scan modal trigger
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Filter products by branch
  const branchProducts = currentBranch === 'ALL'
    ? products
    : products.filter(p => p.branch === currentBranch);

  const selectedProduct = branchProducts.find(p => p.id === selectedProductId);

  // Auto-set reasons based on type
  const handleTypeChange = (newType: 'in' | 'out') => {
    setType(newType);
    setReason(newType === 'in' ? 'purchase' : 'damaged');
    if (newType === 'in') {
      setSupplierId(suppliers[0]?.id || '');
    } else {
      setSupplierId('');
    }
  };

  const handleStockAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantity) {
      setErrorMsg('Please select a product and specify quantity.');
      return;
    }

    const qtyVal = parseInt(quantity, 10);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      setErrorMsg('Quantity must be a positive number.');
      return;
    }

    if (type === 'out' && selectedProduct && selectedProduct.quantity < qtyVal) {
      setErrorMsg(`Insufficient stock in hand. Available list: ${selectedProduct.quantity} unit(s).`);
      return;
    }

    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload = {
      productId: selectedProductId,
      quantity: qtyVal,
      type,
      reason,
      supplierId: type === 'in' ? supplierId : undefined,
      notes: notes || undefined,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      branch: selectedProduct?.branch || currentBranch
    };

    try {
      const res = await fetch('/api/stock-adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Successfully logged stock ${type === 'in' ? 'receipt' : 'deduction'}. Total stock is now ${data.product.quantity}!`);
        // Reset form
        setSelectedProductId('');
        setQuantity('');
        setNotes('');
        onRefreshData();
      } else {
        setErrorMsg(data.error || 'Adjustment failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network transmission failure.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called when barcode is scanned
  const handleBarcodeScanned = (barcodeValue: string) => {
    // Try to match standard barcode first or SKU
    const match = branchProducts.find(p => p.barcode === barcodeValue || p.sku.toUpperCase() === barcodeValue.toUpperCase());
    if (match) {
      setSelectedProductId(match.id);
      setIsScannerOpen(false);
      setSuccessMsg(`Scanner matched: '${match.name}'!`);
      setErrorMsg(null);
    } else {
      alert(`No product matching barcode/SKU: "${barcodeValue}" found in current branch setup.`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 flex flex-col items-center">
      
      {/* View Header */}
      <div className="w-full max-w-2xl border-b border-slate-200/60 pb-5 mb-6">
        <h2 className="text-xl font-sans font-semibold tracking-tight text-slate-900">{t('stock.title')}</h2>
        <p className="text-xs text-slate-400 mt-1">{t('stock.desc')}</p>
      </div>

      {/* Main Adjustment form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full max-w-2xl text-xs font-sans space-y-6">
        
        {/* Module Switcher Tab Bar */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => handleTypeChange('in')}
            className={`py-2 rounded-md font-sans font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              type === 'in'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Download className="h-4 w-4" /> {t('stock.in')}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('out')}
            className={`py-2 rounded-md font-sans font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              type === 'out'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Upload className="h-4 w-4" /> {t('stock.out')}
          </button>
        </div>

        {/* Message Banner */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-150 rounded-lg p-3.5 flex items-start gap-2.5 text-emerald-805">
            <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-150 rounded-lg p-3.5 flex items-start gap-2.5 text-rose-805">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleStockAdjustSubmit} className="space-y-4">
          
          {/* Autocomplete selection row */}
          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">{t('prod.name')} *</label>
              
              {/* Webcam scan trigger */}
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="inline-flex items-center gap-1 text-[10.5px] font-sans font-bold text-indigo-650 hover:underline cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" /> Use Webcam Scanner
              </button>
            </div>

            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-800 font-medium"
            >
              <option value="">-- Choose {t('prod.name')} --</option>
              {branchProducts.map(p => (
                <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku} | Block: {p.branch} | Stock: {p.quantity})</option>
              ))}
            </select>
          </div>

          {/* Displays basic product lookup details once selected */}
          {selectedProduct && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in text-[11px]">
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">{t('prod.sku')}</span>
                <span className="font-mono font-bold text-slate-750">{selectedProduct.sku}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">{t('prod.quantity')}</span>
                <span className={`font-semibold ${selectedProduct.quantity <= selectedProduct.minLevel ? 'text-rose-600' : 'text-slate-800'}`}>
                  {selectedProduct.quantity} units
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">{t('prod.minLevel')}</span>
                <span className="font-mono text-slate-650">{selectedProduct.minLevel} units</span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">{t('prod.price')}</span>
                <span className="font-mono font-semibold text-slate-900">KES {selectedProduct.price}</span>
              </div>
            </div>
          )}

          {/* Quantity adjustments and reason codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">{t('stock.count')} *</label>
              <input
                type="number"
                min="1"
                required
                placeholder="e.g. 50"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">{t('stock.reason')} *</label>
              <select
                value={reason}
                onChange={(e: any) => setReason(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none cursor-pointer"
              >
                {type === 'in' ? (
                  <>
                    <option value="purchase">New Order Procurement (Purchase)</option>
                    <option value="adjustment">Manual Stock Audit Correction</option>
                  </>
                ) : (
                  <>
                    <option value="damaged">Damaged Products Detection</option>
                    <option value="expired">Expired Products Log</option>
                    <option value="adjustment">Manual Stock Audit Correction</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Supplier registration (Only relevant if stock arrives) */}
          {type === 'in' && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">{t('prod.supplier')} *</label>
              <select
                required
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded p-2 focus:outline-none cursor-pointer text-slate-700"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                ))}
              </select>
            </div>
          )}

          {/* Remarks remarks */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">{t('stock.notes')}</label>
            <textarea
              rows={3}
              placeholder="Record remarks here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 focus:outline-none text-slate-755"
            />
          </div>

          {/* Form execute */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-6 rounded-md bg-slate-950 text-white hover:bg-slate-900 disabled:bg-slate-400 font-sans font-semibold tracking-wide text-xs transition shadow-sm cursor-pointer"
            >
              <ArrowUpDown className="h-4.5 w-4.5" />
              <span>{isSubmitting ? t('btn.adding') : t('stock.submit')}</span>
            </button>
          </div>

        </form>

      </div>

      {/* MODAL: CAMERA SCANNER */}
      {isScannerOpen && (
        <ScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onBarcodeScanned={handleBarcodeScanned}
          productsList={branchProducts}
        />
      )}

    </div>
  );
}
