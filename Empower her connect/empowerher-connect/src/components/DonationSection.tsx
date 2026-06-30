import React, { useState } from 'react';
import { DonationCamp } from '../types';
import { INITIAL_DONATION_CAMPS } from '../data';
import { translations } from '../translations';
import { Heart, Landmark, CheckCircle, Smartphone, Award, Sparkles } from 'lucide-react';

interface DonationSectionProps {
  language: 'en' | 'sw';
}

export default function DonationSection({ language }: DonationSectionProps) {
  const t = translations[language];
  const [campaigns, setCampaigns] = useState<DonationCamp[]>(INITIAL_DONATION_CAMPS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('d1');
  const [donorName, setDonorName] = useState('');
  const [donateAmount, setDonateAmount] = useState('');
  const [success, setSuccess] = useState<number | null>(null);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(donateAmount);
    if (amt > 0 && selectedCampaignId) {
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === selectedCampaignId) {
            return {
              ...c,
              raised: c.raised + amt,
              supporters: c.supporters + 1,
            };
          }
          return c;
        })
      );

      setSuccess(amt);
      setDonateAmount('');
      setDonorName('');
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-purple-950 flex items-center gap-2">
          <Heart className="w-5.5 h-5.5 text-purple-600 animate-pulse" />
          {t.donationsTitle}
        </h2>
        <p className="text-sm text-purple-900 mt-1 leading-relaxed">
          {t.donationsDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-purple-600 pl-3">
            Active EmpowerHer Funds
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((camp) => {
              const isSelected = selectedCampaignId === camp.id;
              const percent = Math.round((camp.raised / camp.goal) * 100);

              return (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`bg-white rounded-2xl border p-5 space-y-3 cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'border-purple-600 ring-2 ring-purple-600/10' : 'border-gray-100'
                  }`}
                >
                  <div className="h-32 overflow-hidden bg-gray-50 rounded-lg">
                    <img
                      src={camp.image}
                      alt={camp.titleEn}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-gray-800 text-sm leading-tight">
                      {language === 'en' ? camp.titleEn : camp.titleSw}
                    </h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      {language === 'en' ? camp.descriptionEn : camp.descriptionSw}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                      <span>KES {camp.raised} {t.raisedOf} KES {camp.goal}</span>
                      <span className="text-purple-700">{percent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider pt-1.5 border-t border-gray-50">
                    <span>{camp.supporters} {t.supporters}</span>
                    {isSelected && (
                      <span className="text-purple-600 font-black">SELECTED FUND</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Money MPESA simulator */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
          <div className="border-b border-gray-100 pb-3 mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
              <Smartphone className="w-5 h-5 text-purple-600" />
              <span>{t.donateMoney}</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
              No real billing - Simulated sandbox
            </p>
          </div>

          <form onSubmit={handleDonateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sponsoring Campaign</label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'en' ? c.titleEn.split("'s")[0] : c.titleSw.split("'s")[0]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.donorName}</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Winifred Luvai"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">{t.amountToDonate}</label>
              <input
                type="number"
                required
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
                placeholder="Amount in KES (e.g. 5000)"
                className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              id="btn-execute-donation"
              type="submit"
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1"
            >
              <Award className="w-4 h-4" />
              <span>{t.submitDonation}</span>
            </button>
          </form>

          {success && (
            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 text-teal-950 rounded-xl flex items-start gap-2 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">Donation Processed Successfully!</p>
                <p className="text-[10px] text-teal-900 leading-relaxed mt-0.5">
                  {t.donationSuccess.replace('{amount}', success.toString())}
                </p>
              </div>
            </div>
          )}

          {/* Sponsoring info block */}
          <div className="mt-5 p-4 bg-purple-50/50 rounded-xl border border-purple-100/50 text-[10px] leading-relaxed text-purple-950 space-y-1">
            <h4 className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Sponsor a Vocation Kit</span>
            </h4>
            <p className="text-[10px] text-purple-900">
              Donate KES 12,000 to fully sponsor a manual sewing machine or KES 5,000 for a soap-making startup raw ingredient bundle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
