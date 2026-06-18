import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  QrCode, 
  BarChart3, 
  Sparkles, 
  X, 
  Filter, 
  DollarSign, 
  Barcode, 
  ChevronRight,
  RefreshCw,
  Image,
  Layers,
  MapPin,
  CalendarCheck
} from 'lucide-react';
import { Product, Category, Supplier, UserRole, User } from '../types';
import { useSettings } from '../context/SettingsContext';

interface ProductManagementViewProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  currentUser: User;
  currentBranch: string;
  onRefreshData: () => void;
}

export default function ProductManagementView({
  products,
  categories,
  suppliers,
  currentUser,
  currentBranch,
  onRefreshData
}: ProductManagementViewProps) {
  const { t } = useSettings();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeActionProd, setActiveActionProd] = useState<Product | null>(null);
  
  // Form fields
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [minLevel, setMinLevel] = useState('10');
  const [formBranch, setFormBranch] = useState('Nairobi HQ');

  // Extended Electronics fields
  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [imei, setImei] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [warranty, setWarranty] = useState('');
  const [storage, setStorage] = useState('');
  const [ram, setRam] = useState('');
  const [color, setColor] = useState('');
  const [processor, setProcessor] = useState('');
  const [storageType, setStorageType] = useState('SSD');
  const [screenSize, setScreenSize] = useState('');
  const [os, setOs] = useState('');
  const [batteryHealth, setBatteryHealth] = useState('');
  const [condition, setCondition] = useState('New');
  const [connectivity, setConnectivity] = useState('Wireless');
  const [batteryLife, setBatteryLife] = useState('');
  const [capacity, setCapacity] = useState('');
  const [transferSpeed, setTransferSpeed] = useState('');
  const [interfaceType, setInterfaceType] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  // AI Prediction state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);

  // Permission settings
  const canModifyProducts = [UserRole.ADMIN, UserRole.STORE_MANAGER].includes(currentUser.role);

  // Filter listings
  const filteredProducts = products.filter(p => {
    const branchMatch = currentBranch === 'ALL' || p.branch === currentBranch;
    const catMatch = selectedCategory === 'ALL' || p.categoryId === selectedCategory;
    const queryMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.barcode.includes(searchQuery);
    const lowStockMatch = !filterLowStock || p.quantity <= p.minLevel;

    return branchMatch && catMatch && queryMatch && lowStockMatch;
  });

  const getCategoryName = (catId: string) => categories.find(c => c.id === catId)?.name || 'General';
  const getSupplierName = (supId: string) => suppliers.find(s => s.id === supId)?.name || 'Direct Procurement';

  // Handle SKU trigger
  const generateSku = (catId: string, nameInput: string) => {
    if (!catId || !nameInput) return;
    const cCode = catId.split('_')[1]?.slice(0, 3).toUpperCase() || 'GEN';
    const nCode = nameInput.slice(0, 3).replace(/\s+/g, '').toUpperCase() || 'PRD';
    const randomCode = Math.floor(100 + Math.random() * 900);
    setSku(`${cCode}-${nCode}-${randomCode}`);
    if (!barcode) {
      setBarcode(`600105678${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const openAddModal = () => {
    setId('');
    setName('');
    setSku('');
    setBarcode('');
    setCategoryId(categories[0]?.id || '');
    setPrice('');
    setQuantity('');
    setSupplierId(suppliers[0]?.id || '');
    setDescription('');
    setImage('');
    setExpiryDate('');
    setMinLevel('10');
    setFormBranch(currentBranch === 'ALL' ? 'Nairobi HQ' : currentBranch);
    setSelectedProduct(null);
    setAiPrediction(null);
    
    // Clear custom electronics values
    setBrand('');
    setModelName('');
    setImei('');
    setSerialNumber('');
    setWarranty('');
    setStorage('');
    setRam('');
    setColor('');
    setProcessor('');
    setStorageType('SSD');
    setScreenSize('');
    setOs('');
    setBatteryHealth('');
    setCondition('New');
    setConnectivity('Wireless');
    setBatteryLife('');
    setCapacity('');
    setTransferSpeed('');
    setInterfaceType('');
    setPurchasePrice('');

    setIsAddEditOpen(true);
  };

  const openEditModal = (p: Product) => {
    setId(p.id);
    setName(p.name);
    setSku(p.sku);
    setBarcode(p.barcode);
    setCategoryId(p.categoryId);
    setPrice(p.price.toString());
    setQuantity(p.quantity.toString());
    setSupplierId(p.supplierId);
    setDescription(p.description);
    setImage(p.image);
    setExpiryDate(p.expiryDate || '');
    setMinLevel(p.minLevel.toString());
    setFormBranch(p.branch);
    setActiveActionProd(p);

    // Populate custom electronics values
    setBrand(p.brand || '');
    setModelName(p.modelName || '');
    setImei(p.imei || '');
    setSerialNumber(p.serialNumber || '');
    setWarranty(p.warranty || '');
    setStorage(p.storage || '');
    setRam(p.ram || '');
    setColor(p.color || '');
    setProcessor(p.processor || '');
    setStorageType(p.storageType || 'SSD');
    setScreenSize(p.screenSize || '');
    setOs(p.os || '');
    setBatteryHealth(p.batteryHealth || '');
    setCondition(p.condition || 'New');
    setConnectivity(p.connectivity || 'Wireless');
    setBatteryLife(p.batteryLife || '');
    setCapacity(p.capacity || '');
    setTransferSpeed(p.transferSpeed || '');
    setInterfaceType(p.interfaceType || '');
    setPurchasePrice(p.purchasePrice ? p.purchasePrice.toString() : '');

    setIsAddEditOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId || !supplierId) {
      alert('Please fill in Name, Category, Price, and Supplier.');
      return;
    }

    const payload = {
      action: id ? 'edit' : 'add',
      id,
      product: {
        name,
        sku: sku || `GEN-${Date.now().toString().slice(-4)}`,
        barcode: barcode || `600${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        categoryId,
        price: parseFloat(price),
        quantity: parseInt(quantity || '0', 10),
        supplierId,
        description,
        image: image || 'https://picsum.photos/seed/product/400/300',
        expiryDate: expiryDate || undefined,
        minLevel: parseInt(minLevel || '10', 10),
        branch: formBranch,
        // Electronics specifics
        brand: brand || undefined,
        modelName: modelName || undefined,
        imei: imei || undefined,
        serialNumber: serialNumber || undefined,
        warranty: warranty || undefined,
        storage: storage || undefined,
        ram: ram || undefined,
        color: color || undefined,
        processor: processor || undefined,
        storageType: storageType || undefined,
        screenSize: screenSize || undefined,
        os: os || undefined,
        batteryHealth: batteryHealth || undefined,
        condition: condition || undefined,
        connectivity: connectivity || undefined,
        batteryLife: batteryLife || undefined,
        capacity: capacity || undefined,
        transferSpeed: transferSpeed || undefined,
        interfaceType: interfaceType || undefined,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : undefined
      },
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
        setIsAddEditOpen(false);
        setSelectedProduct(null);
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating inventory database');
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!canModifyProducts) return;
    const payload = {
      action: 'delete',
      id: prodId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
        setIsDeleting(false);
        setSelectedProduct(null);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calling server-side proxy routine for prompt matching AI prediction
  const fetchDemandPrediction = async (p: Product) => {
    setAiLoading(true);
    setAiPrediction(null);
    try {
      const res = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: p.id,
          currentStock: p.quantity,
          minStock: p.minLevel,
          categoryName: getCategoryName(p.categoryId),
          salesHistory: [
            { date: 'June 12, 2026', quantity: 85, customer: 'Local Contractor' },
            { date: 'June 15, 2026', quantity: 18, customer: 'Walk-in' }
          ]
        })
      });
      const data = await res.json();
      setAiPrediction(data.prediction);
    } catch (err) {
      console.error('Prediction failed', err);
      setAiPrediction('Unable to launch forecast server at current timeline.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-6 md:p-8 flex flex-col lg:flex-row gap-6">
      {/* Search / Filters / Grid Panel */}
      <div className="flex-1 space-y-6">
        {/* View Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h2 className="text-xl font-sans font-semibold tracking-tight text-slate-900">{t('nav.products')}</h2>
            <p className="text-xs text-slate-400 mt-1">Manage core stock entries, SKUs, barcode indexes, and branch allocations.</p>
          </div>
          {canModifyProducts && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium bg-slate-950 text-white rounded-md hover:bg-slate-900 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" /> {t('btn.addProduct')}
            </button>
          )}
        </div>

        {/* Filter bars */}
        <div className="bg-white border border-slate-100 rounded-lg p-4 flex flex-col md:flex-row gap-4 shadow-3xs">
          {/* Query Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('btn.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs font-sans text-slate-700 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category selection */}
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs font-sans text-slate-600 bg-white border border-slate-200 rounded-md py-1.5 px-2 cursor-pointer focus:outline-none"
              >
                <option value="ALL">{t('btn.filter')}</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Warn Checkbox */}
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-sans font-medium text-slate-650">
              <input
                type="checkbox"
                checked={filterLowStock}
                onChange={(e) => setFilterLowStock(e.target.checked)}
                className="rounded text-slate-900 focus:ring-slate-950 h-3.5 w-3.5 border-slate-300"
              />
              <span className="flex items-center gap-1 text-rose-600 font-semibold">
                <AlertTriangle className="h-3.5 w-3.5" /> {t('dash.lowStock')}
              </span>
            </label>
          </div>
        </div>

        {/* Directory Card Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-105 rounded-lg p-12 text-center flex flex-col items-center justify-center">
            <Search className="h-10 w-10 text-slate-300 stroke-1 mb-2.5" />
            <h4 className="text-xs font-sans font-semibold text-slate-700 uppercase tracking-wider">{t('prod.noProducts')}</h4>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => {
              const isLow = p.quantity <= p.minLevel;
              const isOut = p.quantity === 0;
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setAiPrediction(null);
                  }}
                  className={`bg-white border cursor-pointer hover:border-slate-400 rounded-lg overflow-hidden flex flex-col gap-3 shadow-3xs transition-all duration-150 ${
                    selectedProduct?.id === p.id ? 'ring-2 ring-slate-900 border-transparent' : 'border-slate-100'
                  }`}
                >
                  {/* Thumbnail and badges */}
                  <div className="h-32 w-full bg-slate-100 relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {/* Expiry / Branch Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase uppercase bg-slate-900/85 text-white/95 tracking-wide flex items-center gap-0.5 shadow-2xs">
                        <MapPin className="h-2.25 w-2.25 shrink-0" /> {p.branch}
                      </span>
                      {p.expiryDate && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-amber-600/90 text-white flex items-center gap-0.5 shadow-2xs">
                          XP: {new Date(p.expiryDate).toLocaleDateString('en-KE')}
                        </span>
                      )}
                    </div>

                    {/* Stock Warning Status Tags */}
                    {isOut ? (
                      <span className="absolute bottom-2.5 right-2.5 bg-red-600 text-white text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase shadow-2xs">
                        {t('prod.expired')}
                      </span>
                    ) : isLow ? (
                      <span className="absolute bottom-2.5 right-2.5 bg-rose-500 text-white text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase shadow-2xs">
                        {t('dash.lowStock')}
                      </span>
                    ) : null}
                  </div>

                  {/* Core details */}
                  <div className="px-4 pb-4 flex flex-col justify-between flex-1 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">{getCategoryName(p.categoryId)}</span>
                        <span className="text-[10px] font-mono font-medium text-slate-400 break-all">{p.sku}</span>
                      </div>
                      <h4 className="text-xs font-sans font-semibold text-slate-800 line-clamp-2 leading-snug">{p.name}</h4>
                    </div>

                    <div className="flex justify-between items-end border-t border-slate-100 pt-2.5">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase leading-none">{t('prod.price')}</span>
                        <span className="text-sm font-semibold font-sans text-slate-900 leading-none">KES {p.price.toLocaleString()}</span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 block uppercase leading-none">{t('prod.quantity')}</span>
                        <span className={`text-xs font-semibold font-mono ${isOut ? 'text-red-600' : isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                          {p.quantity} Unit(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Product Analytics Detail Dock */}
      {selectedProduct && (
        <div className="w-full lg:w-96 shrink-0 bg-white border border-slate-205 rounded-xl p-5 flex flex-col gap-5 self-start sticky top-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <QrCode className="h-4 w-4 text-slate-800" /> Item Deck
            </h3>
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="h-6 w-6 flex items-center justify-center text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Picture details and Actions */}
          <div className="space-y-4">
            <div className="h-40 bg-slate-100 rounded-lg overflow-hidden border border-slate-100 relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-mono text-slate-400 block">{selectedProduct.sku} | Barcode: {selectedProduct.barcode}</span>
              <h3 className="text-sm font-sans font-semibold text-slate-900 leading-snug">{selectedProduct.name}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5">{selectedProduct.description || 'No custom description provided.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold tracking-wider">{t('prod.supplier')}</span>
                <span className="text-[10px] font-sans font-semibold text-slate-700 leading-tight block truncate mt-0.5">{getSupplierName(selectedProduct.supplierId)}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-slate-400 block uppercase font-bold tracking-wider">{t('prod.branch')}</span>
                <span className="text-[10px] font-sans font-semibold text-slate-700 leading-tight flex items-center gap-0.5 mt-0.5"><MapPin className="h-3 w-3 shrink-0" /> {selectedProduct.branch}</span>
              </div>
            </div>

            {/* Custom Electronics technical specs */}
            {(selectedProduct.brand || selectedProduct.warranty || selectedProduct.ram || selectedProduct.storage || selectedProduct.processor || selectedProduct.imei || selectedProduct.serialNumber || selectedProduct.condition || selectedProduct.capacity || selectedProduct.connectivity || selectedProduct.purchasePrice) && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                <span className="text-[8.5px] font-mono text-slate-400 block uppercase font-bold tracking-wider border-b border-slate-200/65 pb-1 flex items-center gap-1">
                  Device Hardware Specifications
                </span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
                  {selectedProduct.brand && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Brand</span>
                      <span className="text-slate-800 font-semibold">{selectedProduct.brand}</span>
                    </div>
                  )}
                  {selectedProduct.modelName && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Model</span>
                      <span className="text-slate-800 font-semibold truncate block max-w-full">{selectedProduct.modelName}</span>
                    </div>
                  )}
                  {selectedProduct.purchasePrice && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Purchase Price</span>
                      <span className="text-slate-800 font-mono font-semibold">KES {selectedProduct.purchasePrice.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedProduct.warranty && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Warranty</span>
                      <span className="text-amber-700 font-semibold">{selectedProduct.warranty}</span>
                    </div>
                  )}
                  {selectedProduct.condition && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Condition</span>
                      <span className={`font-bold ${selectedProduct.condition === 'New' ? 'text-emerald-700' : 'text-indigo-700'}`}>{selectedProduct.condition}</span>
                    </div>
                  )}
                  {selectedProduct.processor && (
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium block text-[9px]">Processor (CPU)</span>
                      <span className="text-slate-800 font-semibold truncate block max-w-full">{selectedProduct.processor}</span>
                    </div>
                  )}
                  {selectedProduct.ram && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">RAM Memory</span>
                      <span className="text-slate-800 font-semibold">{selectedProduct.ram}</span>
                    </div>
                  )}
                  {selectedProduct.storage && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Storage Size</span>
                      <span className="text-slate-800 font-semibold">{selectedProduct.storage}</span>
                    </div>
                  )}
                  {selectedProduct.batteryHealth && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Battery Health</span>
                      <span className="text-emerald-700 font-bold">{selectedProduct.batteryHealth}</span>
                    </div>
                  )}
                  {selectedProduct.color && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Color Finish</span>
                      <span className="text-slate-700 font-semibold">{selectedProduct.color}</span>
                    </div>
                  )}
                  {selectedProduct.capacity && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Capacity</span>
                      <span className="text-slate-850 font-semibold">{selectedProduct.capacity}</span>
                    </div>
                  )}
                  {selectedProduct.connectivity && (
                    <div>
                      <span className="text-slate-400 font-medium block text-[9px]">Connectivity</span>
                      <span className="text-slate-700 font-semibold truncate block">{selectedProduct.connectivity}</span>
                    </div>
                  )}
                  {selectedProduct.imei && (
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium block text-[9px]">IMEI Code</span>
                      <span className="text-slate-700 font-mono text-[9px] selection:bg-indigo-100">{selectedProduct.imei}</span>
                    </div>
                  )}
                  {selectedProduct.serialNumber && (
                    <div className="col-span-2">
                       <span className="text-slate-400 font-medium block text-[9px]">Serial Number</span>
                       <span className="text-slate-700 font-mono text-[9px] truncate block">{selectedProduct.serialNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Official creator QR scanner creation */}
            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100 pt-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(selectedProduct.sku)}`}
                alt="Product QR code"
                referrerPolicy="no-referrer"
                className="h-20 w-20 border border-slate-200 rounded p-1 shadow-2xs shrink-0 bg-white"
              />
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono font-bold text-slate-700 block flex items-center gap-1 justify-center sm:justify-start">
                  <QrCode className="h-3 w-3" /> TRACKING PASSPORT ID
                </span>
                <p className="text-[9px] text-slate-450 leading-normal">Each item receives a QR code on arrival. Scan with cameras or barcode scanners to adjust immediately.</p>
              </div>
            </div>

            {/* Signature Gemini AI Demand Forecast Section */}
            <div className="border border-indigo-100 bg-indigo-50/15 rounded-lg p-3.5 space-y-3 shadow-3xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-700 flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" /> AI Demand Projections
                </span>
                <button
                  onClick={() => fetchDemandPrediction(selectedProduct)}
                  disabled={aiLoading}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-[10px] font-sans font-semibold text-white rounded flex items-center gap-1 cursor-pointer"
                >
                  {aiLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  <span>Forecast</span>
                </button>
              </div>

              {aiPrediction ? (
                <div className="text-[10px] font-sans text-slate-600 leading-relaxed bg-white border border-indigo-100 rounded-md p-2.5 max-h-48 overflow-y-auto">
                  {aiPrediction}
                </div>
              ) : (
                <p className="text-[9.5px] text-slate-400 leading-normal">
                  Evaluate real-time sales history of this item to dynamically forecast next month's demand with Gemini AI!
                </p>
              )}
            </div>

            {/* Edit / Delete option */}
            {canModifyProducts && (
              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => openEditModal(selectedProduct)}
                  className="flex-1 inline-flex justify-center items-center gap-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-[11px] font-sans font-medium text-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  <Edit className="h-3 w-3" /> {t('btn.edit')}
                </button>
                <button
                  onClick={() => {
                    setActiveActionProd(selectedProduct);
                    setIsDeleting(true);
                  }}
                  className="inline-flex items-center justify-center hover:bg-rose-50 h-8 w-8 text-rose-500 hover:text-rose-600 rounded-md border border-rose-200 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isAddEditOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white border rounded-xl w-full max-w-xl shadow-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-sans font-semibold text-slate-900 text-sm">{id ? 'Edit Product Details' : 'Register New Inventory Product'}</h3>
              <button onClick={() => setIsAddEditOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white border rounded-full h-6 w-6 flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-sans">
              
              {/* Product row Name & Branch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paracetamol Extra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-850"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Branch Target *</label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1.8 focus:outline-none cursor-pointer"
                  >
                    <option value="Nairobi HQ">Nairobi HQ</option>
                    <option value="Nakuru Branch">Nakuru Branch</option>
                    <option value="Mombasa Branch">Mombasa Branch</option>
                  </select>
                </div>
              </div>

              {/* Category selector & barcode SKU loader */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      generateSku(e.target.value, name);
                    }}
                    className="w-full bg-white border border-slate-200 rounded p-1.8 focus:outline-none cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase flex items-center justify-between">
                    <span>SKU Code</span>
                    {name && (
                      <button 
                        type="button" 
                        onClick={() => generateSku(categoryId, name)}
                        className="text-[9px] text-indigo-600 font-bold hover:underline"
                      >
                        Auto
                      </button>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="HW-CEM-TMB-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Barcode ID</label>
                  <input
                    type="text"
                    placeholder="6001056781234"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none text-slate-700"
                  />
                </div>
              </div>

              {/* Price, quantity & low-stock alerts minimum values */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase flex items-center gap-0.5"><DollarSign className="h-3 w-3" /> Retail Price (KES) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="850"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none text-slate-800 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Current Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Low Stock Trigger (Alert Min)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="15"
                    value={minLevel}
                    onChange={(e) => setMinLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Expiry Date Datepicker & Supplier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Supplier Wholesaler *</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded p-1.8 focus:outline-none cursor-pointer"
                  >
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none text-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Conditional Electronics Panel */}
              <div className="border border-slate-205 rounded-lg p-3.5 bg-slate-50/40 space-y-3.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block border-b border-slate-200/60 pb-1">
                  Device Hardware Details (Optional Specification)
                </span>
                
                {/* Brand & Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Lenovo, Apple, Samsung"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Model Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. ThinkPad L14 Gen 3"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Purchase Cost valuation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Purchase Cost (KES)</label>
                    <input
                      type="number"
                      placeholder="e.g. 65000"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Warranty Period</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Year, 2 Years Lenovo Warranty"
                      value={warranty}
                      onChange={(e) => setWarranty(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category specific layout: LAPTOPS, COMPUTING, TVs & AUDIO */}
                {(categoryId === 'cat_laptops' || categoryId === 'cat_computing' || categoryId === 'cat_tvs_audio') && (
                  <div className="space-y-3 pt-1 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Processor / CPU</label>
                        <input
                          type="text"
                          placeholder="e.g. AMD Ryzen 5 or QLED chip"
                          value={processor}
                          onChange={(e) => setProcessor(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">RAM Memory</label>
                        <input
                          type="text"
                          placeholder="e.g. 16GB DDR4"
                          value={ram}
                          onChange={(e) => setRam(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Storage Type</label>
                        <select
                          value={storageType}
                          onChange={(e) => setStorageType(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5 cursor-pointer"
                        >
                          <option value="SSD">SSD</option>
                          <option value="HDD">HDD</option>
                          <option value="eMMC">eMMC / Flash</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Operating System</label>
                        <input
                          type="text"
                          placeholder="e.g. Windows 11 Pro, Tizen OS"
                          value={os}
                          onChange={(e) => setOs(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Screen Size</label>
                        <input
                          type="text"
                          placeholder="e.g. 14-inch FHD, 55-inch UHD"
                          value={screenSize}
                          onChange={(e) => setScreenSize(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Serial Number</label>
                        <input
                          type="text"
                          placeholder="e.g. SN-K12456"
                          value={serialNumber}
                          onChange={(e) => setSerialNumber(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Category specific layout: MOBILE PHONES, IPHONES, GAMING */}
                {(categoryId === 'cat_mobile' || categoryId === 'cat_iphones' || categoryId === 'cat_gaming') && (
                  <div className="space-y-3 pt-1 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">IMEI / Unique ID</label>
                        <input
                          type="text"
                          placeholder="e.g. IMEI-352934-..."
                          value={imei}
                          onChange={(e) => setImei(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Cap. Storage</label>
                        <input
                          type="text"
                          placeholder="e.g. 256GB SSD, 1TB"
                          value={storage}
                          onChange={(e) => setStorage(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Color / Edition</label>
                        <input
                          type="text"
                          placeholder="e.g. Titanium Gray, Slim Edition"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                    </div>
                    {(categoryId === 'cat_iphones' || categoryId === 'cat_gaming') && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Battery Health / Power</label>
                          <input
                            type="text"
                            placeholder="e.g. 100% or 300W PSU"
                            value={batteryHealth}
                            onChange={(e) => setBatteryHealth(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1.5"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Device Condition</label>
                          <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1.5 cursor-pointer"
                          >
                            <option value="New">Grade New</option>
                            <option value="Used">Grade Used / Refurbished</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">RAM Memory</label>
                          <input
                            type="text"
                            placeholder="e.g. 8GB"
                            value={ram}
                            onChange={(e) => setRam(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1.5"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Category specific layout: HEADPHONES, ACCESSORIES, SMART DEVICES, BABY, BEAUTY, FASHION, APPLIANCES */}
                {(categoryId === 'cat_headphones' || categoryId === 'cat_accessories' || categoryId === 'cat_smart_devices' || categoryId === 'cat_baby' || categoryId === 'cat_health_beauty' || categoryId === 'cat_fashion' || categoryId === 'cat_appliances') && (
                  <div className="space-y-3 pt-1 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Connectivity / Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Wireless Bluetooth 5.3, Corded"
                          value={connectivity}
                          onChange={(e) => setConnectivity(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Battery Life / Consumption</label>
                        <input
                          type="text"
                          placeholder="e.g. 30 Hours, 1400 Watts"
                          value={batteryLife}
                          onChange={(e) => setBatteryLife(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Color / Styling</label>
                        <input
                          type="text"
                          placeholder="e.g. Fusion Pink, Matte Black"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Category specific layout: USB & STORAGE, SUPERMARKET */}
                {(categoryId === 'cat_usb_storage' || categoryId === 'cat_supermarket') && (
                  <div className="space-y-3 pt-1 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Storage / Capacity</label>
                        <input
                          type="text"
                          placeholder="e.g. 1TB SSD, 500g Container"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Transfer Speed / Weight</label>
                        <input
                          type="text"
                          placeholder="e.g. 1050 MB/s, 0.5 kg"
                          value={transferSpeed}
                          onChange={(e) => setTransferSpeed(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 uppercase font-bold">Interface / Packing Type</label>
                        <input
                          type="text"
                          placeholder="e.g. USB-C 3.2, Air-Tight Bag"
                          value={interfaceType}
                          onChange={(e) => setInterfaceType(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded p-1.5"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Image URL & Description box */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Product Image URL (Unsplash/Picsum / CDN)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or blank for auto-placeholder"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none text-slate-700 font-mono"
                />
              </div>

              <div className="space-y-1 flex flex-col">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide explicit usage cases, structural sizes, compound properties, or ingredients..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none text-slate-750"
                />
              </div>

              {/* Action Buttons */}
              <div className="px-1 py-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="py-2 px-4 rounded border hover:bg-slate-50 text-slate-650 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded bg-slate-950 text-white hover:bg-slate-900 font-medium shadow-sm cursor-pointer"
                >
                  {id ? 'Update Product' : 'Register Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL: DELETE PRODUCT */}
      {isDeleting && activeActionProd && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-40 animate-fade-in">
          <div className="bg-white border rounded-lg w-full max-w-sm p-5 space-y-4 shadow-md text-xs font-sans">
            <h3 className="font-sans font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="text-red-600 h-5 w-5" /> Danger Action
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to delete product <span className="font-semibold text-slate-800">'{activeActionProd.name}' ({activeActionProd.sku})</span> from active inventories? This changes references and records action in the audits.
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsDeleting(false)}
                className="py-1.5 px-3 pr-4 rounded border hover:bg-slate-50 text-slate-550 cursor-pointer"
              >
                No, Keep
              </button>
              <button
                onClick={() => handleDeleteProduct(activeActionProd.id)}
                className="py-1.5 px-4 rounded bg-red-650 hover:bg-red-705 text-white font-medium shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
