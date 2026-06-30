import React, { useState } from 'react';
import { Product, Course } from '../types';
import { translations } from '../translations';
import { Shield, CheckCircle, Clock, Server, Eye, FileText, Activity } from 'lucide-react';

interface AdminSectionProps {
  language: 'en' | 'sw';
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  courses: Course[];
}

export default function AdminSection({ language, products, setProducts, courses }: AdminSectionProps) {
  const t = translations[language];
  const pendingProducts = products.filter((p) => !p.approved);

  const handleApprove = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, approved: true } : p))
    );
  };

  const logs = [
    { time: '10:41:45', tag: 'EMERGENCY', msg: 'Panic broadcast SOS received from user: mother_user_1 (Nairobi Westlands).' },
    { time: '10:40:12', tag: 'DATABASE', msg: 'New pro-bono advocate referral requested (FIDA pipeline).' },
    { time: '09:12:44', tag: 'DONATION', msg: 'Simulated Mobile MPESA payment received for Fund: Butterly Sewing Kits.' },
    { time: '08:00:00', tag: 'SYSTEM', msg: 'Safe House capacity monitors verified: Kisumu center has 4 vacancies remaining.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Intro card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2">
          <Shield className="w-5.5 h-5.5 text-amber-700" />
          {t.adminTitle}
        </h2>
        <p className="text-sm text-amber-900 mt-1 leading-relaxed">
          {t.adminDesc}
        </p>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs text-center space-y-1">
          <p className="text-2xl font-black text-gray-800">142</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.totalMothers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs text-center space-y-1">
          <p className="text-2xl font-black text-rose-600">18 / 25 Beds</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.shelterCapacity}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs text-center space-y-1">
          <p className="text-2xl font-black text-purple-700">{pendingProducts.length}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.pendingApprovals}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs text-center space-y-1">
          <p className="text-2xl font-black text-teal-600">KES 226,000</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Donated Funds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketplace Approvals Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>Marketplace Verification Queue</span>
          </h3>

          {pendingProducts.length > 0 ? (
            <div className="space-y-3">
              {pendingProducts.map((p) => (
                <div key={p.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-block px-2 py-0.5 text-[8px] font-black text-purple-700 bg-purple-50 rounded-full uppercase tracking-wider">
                      {p.category}
                    </span>
                    <h4 className="font-bold text-gray-800 text-xs">{language === 'en' ? p.titleEn : p.titleSw}</h4>
                    <p className="text-[10px] text-gray-500">Artisan: {p.sellerName} | Price: KES {p.price}</p>
                  </div>
                  <button
                    id={`btn-admin-approve-${p.id}`}
                    onClick={() => handleApprove(p.id)}
                    className="self-start sm:self-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition shadow-xs flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve Product</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-xs text-gray-400 italic">
              All marketplace item submissions are verified and approved! No items in queue.
            </div>
          )}
        </div>

        {/* System safety logs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-3">
            <Activity className="w-5 h-5 text-amber-600" />
            <span>{t.adminLogHeader}</span>
          </h3>

          <div className="space-y-3 font-mono text-[11px]">
            {logs.map((log, idx) => (
              <div key={idx} className="p-3 bg-gray-900 text-gray-200 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-amber-400">{log.tag}</span>
                  <span className="text-gray-400">{log.time}</span>
                </div>
                <p className="leading-relaxed">{log.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
