import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight, 
  Check, 
  Search, 
  Camera, 
  CreditCard, 
  PhoneCall, 
  DollarSign, 
  FileText,
  RefreshCw,
  Printer,
  Badge,
  UserCheck
} from 'lucide-react';
import { Product, Category, User, Sale, UserRole } from '../types';
import ScannerModal from './ScannerModal';
import { useSettings } from '../context/SettingsContext';

interface SalesViewProps {
  products: Product[];
  categories: Category[];
  currentUser: User;
  currentBranch: string;
  onRefreshData: () => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function SalesView({
  products,
  categories,
  currentUser,
  currentBranch,
  onRefreshData
}: SalesViewProps) {
  const { t } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile_money'>('cash');
  
  // States of transactions
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Filter products relevant to branch & query
  const branchProducts = currentBranch === 'ALL'
    ? products
    : products.filter(p => p.branch === currentBranch);

  const filteredProducts = branchProducts.filter(p => {
    const catMatch = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const queryMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.barcode.includes(searchQuery);
    return catMatch && queryMatch && p.quantity > 0; // Exclude out of stock
  });

  const getCategoryName = (catId: string) => categories.find(c => c.id === catId)?.name || 'General';

  // Cart operations
  const addToCart = (product: Product) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty >= product.quantity) {
        alert(`Cannot add more. Only ${product.quantity} units are available in ${product.branch}.`);
        return;
      }
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setLastCompletedSale(null); // Clear last receipt if continuing
  };

  const updateCartQty = (productId: string, val: number) => {
    const idx = cart.findIndex(item => item.product.id === productId);
    if (idx === -1) return;

    const targetQty = cart[idx].quantity + val;
    if (targetQty <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
      return;
    }

    if (targetQty > cart[idx].product.quantity) {
      alert(`Only ${cart[idx].product.quantity} units available in stock.`);
      return;
    }

    const updatedCart = [...cart];
    updatedCart[idx].quantity = targetQty;
    setCart(updatedCart);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const VAT_RATE = 0.16; // 16% Kenyan VAT tax
  const taxAmount = subtotal * VAT_RATE;
  const totalAmount = subtotal + taxAmount;

  // Checkout call
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    const payload = {
      customerName: customerName || 'Self Retail Walk-in',
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      paymentMethod,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      branch: currentBranch === 'ALL' ? 'Nairobi HQ' : currentBranch
    };

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLastCompletedSale(data.sale);
        setCart([]);
        setCustomerName('');
        setPaymentMethod('cash');
        onRefreshData();
      } else {
        alert(data.error || 'Checkout process crashed');
      }
    } catch (err) {
      console.error(err);
      alert('Network sales error occurred.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Barcode scanned trigger inside checkout
  const handleBarcodeScanned = (barcodeValue: string) => {
    const matched = branchProducts.find(p => p.barcode === barcodeValue || p.sku.toUpperCase() === barcodeValue.toUpperCase());
    if (matched) {
      if (matched.quantity === 0) {
        alert(`Matched product "${matched.name}" is OUT OF STOCK.`);
      } else {
        addToCart(matched);
        setIsScannerOpen(false);
      }
    } else {
      alert(`No product matching barcode: "${barcodeValue}" found in current branch.`);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 flex flex-col lg:flex-row gap-6">
      
      {/* Product Catalog list (Left Panel) */}
      <div className="flex-1 space-y-5 flex flex-col h-[80vh] lg:h-auto min-h-0">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4 shrink-0">
          <div>
            <h2 className="text-xl font-sans font-semibold tracking-tight text-slate-900">{t('sale.title')}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{t('sale.desc')}</p>
          </div>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-sans font-bold bg-indigo-650 text-white rounded-md hover:bg-indigo-700 shadow-sm transition cursor-pointer shrink-0 animate-pulse"
          >
            <Camera className="h-4 w-4" /> {t('prod.barcode')} / Scan
          </button>
        </div>

        {/* Filter / Search bars */}
        <div className="bg-white border border-slate-100 rounded-lg p-3 flex flex-col sm:flex-row gap-3 shadow-3xs shrink-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('sale.searchProd')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.8 text-xs font-sans text-slate-705 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-sans text-slate-600 bg-white border border-slate-200 rounded-md py-1.8 px-2 focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t('gen.all')}</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Dynamic products catalogs grid */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border rounded-lg p-10 text-center flex flex-col items-center justify-center">
              <ShoppingBag className="h-9 w-9 text-slate-300 stroke-1 mb-2" />
              <span className="text-xs font-sans font-semibold text-slate-600">{t('prod.noProducts')}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-white border border-slate-100 hover:border-slate-350 p-3.5 rounded-lg flex flex-col justify-between gap-3 shadow-3xs hover:shadow-2xs cursor-pointer group transition-all duration-150"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider">{getCategoryName(p.categoryId)}</span>
                      <span className="text-[10px] text-indigo-455 font-mono group-hover:text-indigo-600 font-semibold">{p.sku}</span>
                    </div>
                    <h4 className="text-xs font-sans font-semibold text-slate-800 line-clamp-2 leading-snug">{p.name}</h4>
                  </div>

                  <div className="flex justify-between items-end border-t border-slate-50 pt-2.5">
                    <div>
                      <span className="text-[8px] font-mono text-slate-400 block uppercase leading-none">{t('prod.price')} (KES)</span>
                      <span className="text-xs font-mono font-bold text-slate-900 leading-none">KES {p.price.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-mono text-slate-505 block uppercase leading-none">{t('prod.quantity')}</span>
                      <span className="text-[10.5px] font-mono font-bold text-slate-550 block leading-none">
                        {p.quantity} Unit(s)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* POS Shopping Cart & Receipt View (Right Panel) */}
      <div className="w-full lg:w-[420px] shrink-0 bg-white border border-slate-205 rounded-xl p-5 flex flex-col h-[80vh] lg:h-[85vh] sticky top-6 shadow-sm">
        
        {/* Cart Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
          <h3 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
            <ShoppingBag className="h-4 w-4 text-indigo-505" /> {t('sale.cart')} ({cart.reduce((s,i) => s + i.quantity, 0)} {t('sale.itemsCount')})
          </h3>
          {cart.length > 0 && (
            <button 
              onClick={clearCart} 
              className="text-[10px] font-sans font-bold text-rose-600 hover:underline cursor-pointer"
            >
              {t('btn.cancel')}
            </button>
          )}
        </div>

        {/* Dynamic content rendering (Basket List OR Invoice Receipt) */}
        {lastCompletedSale ? (
          
          /* Renders Digital Printable Receipt once checkout is completed! */
          <div className="flex-1 flex flex-col justify-space min-h-0">
            <div className="flex-1 overflow-y-auto pr-1">
              {/* Receipt Styling */}
              <div id="print-area" className="border-2 border-dashed border-slate-300 p-4 rounded bg-slate-50/50 space-y-4 font-mono text-[10.5px]">
                <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
                  <h3 className="font-sans font-bold text-slate-900 text-sm tracking-wide uppercase">STOCKMASTER RETAIL</h3>
                  <p className="text-[9px] text-slate-500 leading-normal">General Wholesalers & Distributors</p>
                  <p className="text-[9px] text-slate-400">Branch: {lastCompletedSale.branch}</p>
                </div>

                <div className="space-y-1 text-slate-600">
                  <div><strong>Invoice No:</strong> {lastCompletedSale.receiptNumber}</div>
                  <div><strong>Date:</strong> {new Date(lastCompletedSale.date).toLocaleString('en-KE')}</div>
                  <div><strong>Cashier:</strong> {lastCompletedSale.userName}</div>
                  <div><strong>Customer:</strong> {lastCompletedSale.customerName}</div>
                </div>

                {/* Items List */}
                <table className="w-full border-b border-dashed border-slate-300 pb-2">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="text-left py-1 font-mono">ITEM</th>
                      <th className="text-center py-1 font-mono">QTY</th>
                      <th className="text-right py-1 font-mono">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastCompletedSale.items.map((it, idx) => (
                      <tr key={idx} className="border-b border-dashed border-slate-105/30 last:border-b-0">
                        <td className="py-1 min-w-0 font-mono pr-2">{it.productName}</td>
                        <td className="py-1 text-center font-mono font-medium">{it.quantity}</td>
                        <td className="py-1 text-right font-mono font-semibold">KES {(it.price * it.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Math Breakdown */}
                <div className="space-y-1.5 text-right font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-450 uppercase">Subtotal:</span>
                    <span>KES {(lastCompletedSale.totalAmount / 1.16).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450 uppercase">16% VAT:</span>
                    <span>KES {(lastCompletedSale.totalAmount - (lastCompletedSale.totalAmount / 1.16)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-dashed border-slate-200">
                    <span className="uppercase">TOTAL AMOUNT Paid:</span>
                    <span>KES {lastCompletedSale.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center pt-3 border-t border-dashed border-slate-300 text-slate-500 text-[8.5px] uppercase tracking-wider">
                  *** Thank you for doing business with us! ***
                </div>
              </div>
            </div>

            {/* Print trigger dummy */}
            <div className="pt-4 space-y-2 shrink-0">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full inline-flex justify-center items-center gap-1.5 py-2 px-4 rounded border hover:bg-slate-50 text-[11px] font-sans font-bold cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Print Receipt Invoice
              </button>
              <button
                onClick={() => setLastCompletedSale(null)}
                className="w-full inline-flex justify-center items-center py-2 px-4 bg-slate-900 hover:bg-slate-950 text-white font-sans font-semibold rounded text-[11px] cursor-pointer"
              >
                Start New Basket Run
              </button>
            </div>
          </div>

        ) : cart.length === 0 ? (
          
          /* Empty Basket State */
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
            <ShoppingBag className="h-10 w-10 text-slate-350 stroke-1 mb-2.5 animate-bounce text-indigo-505" />
            <span className="text-xs font-sans font-bold text-slate-600 uppercase tracking-wider">{t('sale.cartEmpty')}</span>
            <p className="text-[10.5px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">{t('sale.cartEmptyDesc')}</p>
          </div>

        ) : (
          
          /* Active Cart list & billing details form */
          <div className="flex-1 flex flex-col justify-space min-h-0">
            {/* Basket Items Roll */}
            <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-2.5 divide-y divide-slate-100 min-h-0">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs pt-2.5 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <span className="font-sans font-semibold text-slate-800 break-words block leading-snug">{item.product.name}</span>
                    <span className="font-mono text-[9px] text-slate-400 block mt-0.5">KES {item.product.price.toLocaleString()} | stock: {item.product.quantity}</span>
                  </div>

                  <div className="flex items-center gap-2shrink-0">
                    {/* Quantity triggers */}
                    <div className="flex items-center border border-slate-205 rounded-md p-0.5 bg-slate-50">
                      <button 
                        type="button" 
                        onClick={() => updateCartQty(item.product.id, -1)}
                        className="h-5 w-5 flex items-center justify-center hover:bg-white rounded text-slate-500 cursor-pointer"
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className="px-2 font-mono font-bold text-slate-800 text-xs">{item.quantity}</span>
                      <button 
                        type="button" 
                        onClick={() => updateCartQty(item.product.id, 1)}
                        className="h-5 w-5 flex items-center justify-center hover:bg-white rounded text-slate-500 cursor-pointer"
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-rose-500 hover:text-rose-700 h-6 w-6 flex items-center justify-center bg-rose-50 rounded cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Transaction Settings Form */}
            <div className="border-t border-slate-100 pt-4 space-y-4 shrink-0">
              
              {/* Customer tracking */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono tracking-wider font-bold text-slate-400 uppercase">{t('sale.customer')}</label>
                <input
                  type="text"
                  placeholder="e.g. walk-in client, or private entity"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none"
                />
              </div>

              {/* Payment selector */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono tracking-wider font-bold text-slate-400 uppercase">{t('sale.payMethod')}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-1.5 rounded flex flex-col items-center justify-center gap-1 border transition cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-750 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-[9px]">{t('sale.payCash')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-1.5 rounded flex flex-col items-center justify-center gap-1 border transition cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-750 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span className="text-[9px]">{t('sale.payCard')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`py-1.5 rounded flex flex-col items-center justify-center gap-1 border transition cursor-pointer ${
                      paymentMethod === 'mobile_money'
                        ? 'border-indigo-650 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-750 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span className="text-[9px]">{t('sale.payMobile')}</span>
                  </button>
                </div>
              </div>

              {/* Math breakdown summary */}
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5 text-right leading-none">
                <div className="flex justify-between text-[10.5px]">
                  <span className="text-slate-450 font-mono">{t('sale.subtotal')}:</span>
                  <span className="font-mono text-slate-700">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10.5px]">
                  <span className="text-slate-450 font-mono">16% KES VAT Tax:</span>
                  <span className="font-mono text-slate-650">KES {taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span className="font-sans uppercase">{t('sale.total')}:</span>
                  <span className="font-mono">KES {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout submit */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || cart.length === 0}
                className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 rounded-md bg-slate-950 text-white hover:bg-slate-900 disabled:bg-slate-400 font-sans font-semibold tracking-wide text-xs transition shadow-sm cursor-pointer"
              >
                {isCheckingOut ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{t('sale.complete')}...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4.5 w-4.5 animate-pulse" />
                    <span>{t('sale.complete')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WEBCAM PRODUCT SCANNER MODAL */}
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
