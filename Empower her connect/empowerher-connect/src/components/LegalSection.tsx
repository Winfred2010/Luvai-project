import React, { useState } from 'react';
import { LegalReferral } from '../types';
import { INITIAL_LEGAL_REFERRALS } from '../data';
import { translations } from '../translations';
import { Scale, Phone, Mail, MapPin, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

interface LegalSectionProps {
  language: 'en' | 'sw';
}

export default function LegalSection({ language }: LegalSectionProps) {
  const t = translations[language];
  const [referrals] = useState<LegalReferral[]>(INITIAL_LEGAL_REFERRALS);
  const [disputeText, setDisputeText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disputeText.trim()) {
      setSubmitted(true);
      setDisputeText('');
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informational Rights Guide */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xs">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-teal-300" />
          {t.legalRightsGuide}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-xs">
            <h3 className="font-bold text-teal-300 text-sm flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              {t.childCustody}
            </h3>
            <p className="text-xs text-purple-100 mt-2 leading-relaxed">
              {t.childCustodyDesc}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-xs">
            <h3 className="font-bold text-teal-300 text-sm flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-300 animate-pulse" />
              {t.violenceProtection}
            </h3>
            <p className="text-xs text-purple-100 mt-2 leading-relaxed">
              {t.violenceProtectionDesc}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lawyers list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-purple-600 pl-3">
            {t.proBonoTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {referrals.map((lawyer) => (
              <div key={lawyer.id} className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 flex flex-col justify-between hover:border-purple-200 transition-all">
                <div className="space-y-2">
                  <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-indigo-700 bg-indigo-50 rounded-full uppercase">
                    Pro-Bono Advocate
                  </span>
                  <h4 className="font-bold text-gray-800 leading-tight">{lawyer.name}</h4>
                  <p className="text-xs text-purple-700 font-semibold">{lawyer.specialty}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>{lawyer.location}</span>
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    {language === 'en' ? lawyer.experienceEn : lawyer.experienceSw}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex flex-wrap gap-2">
                  <a
                    href={`tel:${lawyer.phone}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{lawyer.phone.split(' &')[0]}</span>
                  </a>
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email Support</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Dispute Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
          <h3 className="text-base font-bold text-gray-900 border-l-4 border-teal-600 pl-2.5 mb-4">
            {t.requestLegalCallback}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            {language === 'sw'
              ? 'Tuma ombi kwa siri. Timu ya FIDA au mawakili wetu washirika watapitia maelezo yako na kukupigia simu.'
              : 'Submit your issue securely. FIDA legal clinic or pro-bono attorneys will review your case file and contact you.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t.legalFormTitle}
              </label>
              <textarea
                value={disputeText}
                onChange={(e) => setDisputeText(e.target.value)}
                rows={4}
                required
                placeholder={
                  language === 'sw'
                    ? 'mfano, Kuhusu kupata msaada wa matunzo ya mtoto wangu wa miaka miwili...'
                    : 'e.g., Seeking child support maintenance order; my partner abandoned us 6 months ago...'
                }
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden leading-relaxed resize-none"
              ></textarea>
            </div>

            <button
              id="btn-submit-legal"
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <span>{t.submitLegal}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {submitted && (
            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2.5 text-teal-950 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">
                {t.legalSuccess}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
