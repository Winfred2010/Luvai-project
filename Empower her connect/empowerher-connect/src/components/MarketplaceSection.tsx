import React, { useState } from 'react';
import { Product, UserRole } from '../types';
import { INITIAL_PRODUCTS } from '../data';
import { translations } from '../translations';
import { ShoppingBag, MessageSquare, Plus, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface MarketplaceSectionProps {
  language: 'en' | 'sw';
  userRole: UserRole;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export default function MarketplaceSection({ language, userRole, products, setProducts }: MarketplaceSectionProps) {
  const t = translations[language];
  const [showAddForm, setShowAddForm] = useState(false);
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // New product form states
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleSw, setNewTitleSw] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newDescSw, setNewDescSw] = useState('');
  const [newCategory, setNewCategory] = useState('Crafts');
  const [newImage, setNewImage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buyerPhone && inquiryProduct) {
      setInquirySent(true);
      setTimeout(() => {
        setInquirySent(false);
        setInquiryProduct(null);
        setBuyerPhone('');
        setBuyerMessage('');
      }, 5000);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitleEn && newPrice && newPhone) {
      const isAutoApproved = userRole === 'admin';
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        titleEn: newTitleEn,
        titleSw: newTitleSw || newTitleEn,
        price: Number(newPrice),
        sellerId: 'mother_user_self',
        sellerName: 'Wairimu Handmade Crafts (You)',
        sellerPhone: newPhone,
        image: newImage || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
        descriptionEn: newDescEn,
        descriptionSw: newDescSw || newDescEn,
        category: newCategory,
        approved: isAutoApproved, // Needs admin approval unless logged as admin
      };

      setProducts((prev) => [newProduct, ...prev]);
      setFormSubmitted(true);
      setShowAddForm(false);
      setNewTitleEn('');
      setNewTitleSw('');
      setNewPrice('');
      setNewPhone('');
      setNewDescEn('');
      setNewDescSw('');
      setNewImage('');

      setTimeout(() => {
        setFormSubmitted(false);
      }, 7000);
    }
  };

  const handleApprove = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approved: true } : p))
    );
  };

  // Regular members see only approved products
  // Admins see pending products too to approve them!
  const visibleProducts = userRole === 'admin'
    ? products
    : products.filter((p) => p.approved);

  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-purple-950 flex items-center gap-2">
            <ShoppingBag className="w-5.5 h-5.5 text-purple-600" />
            {t.marketplaceTitle}
          </h2>
          <p className="text-sm text-purple-900 mt-1 leading-relaxed">
            {t.marketplaceDesc}
          </p>
        </div>
        <button
          id="btn-show-sell-product"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg cursor-pointer transition shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.sellProductTitle}</span>
        </button>
      </div>

      {/* Success alert after posting product */}
      {formSubmitted && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-950 rounded-xl flex items-start gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
          <div>
            <h4 className="font-bold text-xs">Product Registered Safely</h4>
            <p className="text-[11px] text-teal-900/90 leading-relaxed mt-0.5">
              {t.productPending}
            </p>
          </div>
        </div>
      )}

      {/* Sell Your Product form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 max-w-2xl animate-fade-in">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-600" />
            {t.sellProductTitle}
          </h3>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Name (English)</label>
              <input
                type="text"
                required
                value={newTitleEn}
                onChange={(e) => setNewTitleEn(e.target.value)}
                placeholder={t.productNamePlaceholder}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Name (Kiswahili)</label>
              <input
                type="text"
                value={newTitleSw}
                onChange={(e) => setNewTitleSw(e.target.value)}
                placeholder="mfano, Kikapu cha mianzi kilichosukwa"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Price (KES)</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder={t.pricePlaceholder}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Seller Mobile Number</label>
              <input
                type="text"
                required
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. +254 712 345 678"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="Crafts">Handicrafts & Decor</option>
                <option value="Soaps">Chemical Soaps & Detergents</option>
                <option value="Garments">Tailored Garments</option>
                <option value="Bakeries">Baked Pastries & Bread</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Product Image URL</label>
              <input
                type="url"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder={t.uploadImagePlaceholder}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Describe how you crafted it (English)</label>
              <textarea
                value={newDescEn}
                onChange={(e) => setNewDescEn(e.target.value)}
                rows={3}
                placeholder={t.productDescPlaceholder}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Describe how you crafted it (Kiswahili)</label>
              <textarea
                value={newDescSw}
                onChange={(e) => setNewDescSw(e.target.value)}
                rows={3}
                placeholder="Eleza jinsi ulivyotengeneza bidhaa..."
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                {t.close}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer"
              >
                {isAdmin ? 'Publish & Approve' : t.submitProduct}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="h-48 overflow-hidden relative bg-gray-50">
                <img
                  src={prod.image}
                  alt={prod.titleEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {!prod.approved && (
                  <div className="absolute top-3 right-3 bg-amber-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>PENDING APPROVAL</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-purple-900/85 backdrop-blur-xs text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {prod.category}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-1">
                    {language === 'en' ? prod.titleEn : prod.titleSw}
                  </h3>
                  <p className="text-sm font-black text-purple-700 shrink-0">KES {prod.price}</p>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  {t.artisanName}: <span className="text-purple-950">{prod.sellerName}</span>
                </p>
                <p className="text-xs text-gray-600 leading-relaxed pt-1 line-clamp-2">
                  {language === 'en' ? prod.descriptionEn : prod.descriptionSw}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              {/* If not approved and user is admin, show APPROVE button */}
              {!prod.approved && isAdmin ? (
                <button
                  onClick={() => handleApprove(prod.id)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow-xs flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.approveButton}</span>
                </button>
              ) : (
                <button
                  id={`btn-contact-artisan-${prod.id}`}
                  onClick={() => setInquiryProduct(prod)}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.contactSeller}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Dialog Box */}
      {inquiryProduct && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-gray-100 shadow-xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">{t.buyInquiryPrompt}</h3>
              <button
                onClick={() => setInquiryProduct(null)}
                className="text-gray-400 hover:text-gray-600 font-extrabold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs">
              <p className="text-[10px] text-purple-700 uppercase tracking-wider font-bold">Inquiry For</p>
              <p className="font-bold text-purple-950">
                {language === 'en' ? inquiryProduct.titleEn : inquiryProduct.titleSw}
              </p>
              <p className="font-black text-purple-950">Price: KES {inquiryProduct.price}</p>
              <p className="text-gray-600 font-medium">Artisan: {inquiryProduct.sellerName}</p>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Your Phone Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +254 722..."
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-5"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Message (Simulated SMS to Artisan)
                </label>
                <textarea
                  rows={3}
                  value={buyerMessage}
                  onChange={(e) => setBuyerMessage(e.target.value)}
                  placeholder="Hi, I would like to purchase your beautiful product..."
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg bg-gray-5 resize-none"
                ></textarea>
              </div>

              <button
                id="btn-send-inquiry"
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
              >
                Send SMS Inquiry
              </button>
            </form>

            {inquirySent && (
              <div className="p-3 bg-teal-50 border border-teal-200 text-teal-950 rounded-xl text-xs flex items-start gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">
                  {t.inquirySuccess} (SMS dispatched to {inquiryProduct.sellerPhone})
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
