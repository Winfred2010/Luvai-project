import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Edit, 
  History, 
  ChevronRight, 
  X,
  Search,
  BookOpen
} from 'lucide-react';
import { Supplier, Product, User, UserRole } from '../types';
import { useSettings } from '../context/SettingsContext';

interface SupplierViewProps {
  suppliers: Supplier[];
  products: Product[];
  currentUser: User;
  onRefreshData: () => void;
}

export default function SupplierView({
  suppliers,
  products,
  currentUser,
  onRefreshData
}: SupplierViewProps) {
  const { t } = useSettings();
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form fields
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const canModifySuppliers = [UserRole.ADMIN, UserRole.STORE_MANAGER].includes(currentUser.role);

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSupplierProducts = (supId: string) => products.filter(p => p.supplierId === supId);

  const openAddModal = () => {
    setId('');
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setIsAddEditOpen(true);
  };

  const openEditModal = (s: Supplier, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting card
    setId(s.id);
    setName(s.name);
    setEmail(s.email);
    setPhone(s.phone);
    setLocation(s.location);
    setIsAddEditOpen(true);
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !location) {
      alert('Please fill in all fields');
      return;
    }

    const payload = {
      action: id ? 'edit' : 'add',
      id,
      supplier: { name, email, phone, location },
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role
    };

    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
        setIsAddEditOpen(false);
        setSelectedSupplier(null);
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating supplier catalog');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 flex flex-col lg:flex-row gap-6">
      
      {/* Search / Grid Area */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <h2 className="text-xl font-sans font-semibold tracking-tight text-slate-900">{t('nav.suppliers')}</h2>
            <p className="text-xs text-slate-400 mt-1">Manage wholesaling supply companies, emails, contacts, and delivery logs.</p>
          </div>
          {canModifySuppliers && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium bg-slate-950 text-white rounded-md hover:bg-slate-900 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" /> {t('btn.addSupplier')}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-100 rounded-lg p-3 shadow-3xs flex items-center relative">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('btn.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-sans text-slate-700 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Supplier Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuppliers.map((s) => {
            const supplierProducts = getSupplierProducts(s.id);
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSupplier(s)}
                className={`bg-white border cursor-pointer hover:border-slate-350 p-5 rounded-lg flex flex-col justify-space gap-4 shadow-3xs transition-all duration-150 ${
                  selectedSupplier?.id === s.id ? 'ring-2 ring-slate-900 border-transparent' : 'border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-slate-50 text-slate-700 rounded-full flex items-center justify-center font-sans font-bold text-xs uppercase shrink-0">
                      {s.name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-sans font-semibold text-slate-800 line-clamp-1">{s.name}</h4>
                      <span className="text-[9px] font-mono text-slate-400 block flex items-center gap-0.5 mt-0.5"><MapPin className="h-2.5 w-2.5" /> {s.location}</span>
                    </div>
                  </div>
                  {canModifySuppliers && (
                    <button
                      onClick={(e) => openEditModal(s, e)}
                      className="text-slate-400 hover:text-slate-800 p-1 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-650 truncate">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    <span className="truncate block font-mono text-[11px]">{s.email}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px]">
                  <span className="text-slate-400 font-mono">{t('sup.providedProducts')}</span>
                  <span className="px-2 py-0.5 rounded font-sans font-semibold bg-slate-50 text-slate-700 border border-slate-100 block">
                    {supplierProducts.length} active item(s)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplier History Overview Detail Portal */}
      {selectedSupplier && (
        <div className="w-full lg:w-96 shrink-0 bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5 self-start sticky top-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-xs font-sans font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
              <History className="h-4 w-4" /> {t('sup.providedProducts')}
            </h3>
            <button 
              onClick={() => setSelectedSupplier(null)} 
              className="h-6 w-6 flex items-center justify-center text-slate-400 hover:text-slate-705 bg-slate-50 rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-sans font-semibold text-slate-900">{selectedSupplier.name}</h3>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide">{t('sup.location')}: {selectedSupplier.location}</p>
            </div>

            {/* List of supplied products */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Delivered Inventory Items
              </span>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {getSupplierProducts(selectedSupplier.id).length === 0 ? (
                  <p className="text-[10.5px] text-slate-400 italic">No products registered with this supplier yet.</p>
                ) : (
                  getSupplierProducts(selectedSupplier.id).map(p => (
                    <div key={p.id} className="border border-slate-100 rounded-lg p-2.5 bg-slate-50/50 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-sans font-semibold text-slate-800 break-words block truncate max-w-[150px]">{p.name}</span>
                        <span className="font-mono text-[9px] text-slate-400 block">{p.sku} | Branch: {p.branch}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-700 block">Qty: {p.quantity}</span>
                        <span className="font-mono text-[9px] text-slate-400 block">KES {p.price}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SUPPLIER */}
      {isAddEditOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white border rounded-xl w-full max-w-md shadow-md overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-sans font-semibold text-slate-900 text-sm">{id ? 'Edit Supplier Contact' : 'Register New Vendor/Supplier'}</h3>
              <button onClick={() => setIsAddEditOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white border rounded-full h-6 w-6 flex items-center justify-center"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-5 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Vendor/Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crown Paints Kenya Ltd"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@crownpaints.co.ke"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono text-slate-705"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+254 722 000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono text-slate-705"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Physical Office / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industrial Area, Likoni Road, Nairobi"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-1.8 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800"
                />
              </div>

              <div className="px-1 py-3 border-t border-slate-100 flex justify-end gap-2 pr-1 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddEditOpen(false)}
                  className="py-1.8 px-4 border hover:bg-slate-50 rounded text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.8 px-5 rounded bg-slate-950 text-white hover:bg-slate-900 font-medium shadow-sm cursor-pointer"
                >
                  {id ? 'Update Supplier' : 'Register Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
