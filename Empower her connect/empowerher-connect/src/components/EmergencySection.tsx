import { useState } from 'react';
import { EmergencyContact } from '../types';
import { INITIAL_EMERGENCY_CONTACTS } from '../data';
import { translations } from '../translations';
import { Phone, MapPin, AlertOctagon, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface EmergencySectionProps {
  language: 'en' | 'sw';
}

export default function EmergencySection({ language }: EmergencySectionProps) {
  const t = translations[language];
  const [contacts] = useState<EmergencyContact[]>(INITIAL_EMERGENCY_CONTACTS);
  const [panicActivated, setPanicActivated] = useState(false);
  const [rescueRequested, setRescueRequested] = useState<string | null>(null);

  const handlePanicClick = () => {
    setPanicActivated(true);
    // Auto reset after 8 seconds
    setTimeout(() => {
      setPanicActivated(false);
    }, 8000);
  };

  const handleRescueRequest = (contactName: string) => {
    setRescueRequested(contactName);
    setTimeout(() => {
      setRescueRequested(null);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Panic Button Call to Action */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-red-100 rounded-full opacity-50 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-red-600 animate-pulse" />
              {t.panicTitle}
            </h2>
            <p className="text-sm text-red-700 leading-relaxed">
              {t.panicDesc}
            </p>
          </div>
          <button
            id="btn-panic-call"
            onClick={handlePanicClick}
            className={`w-full md:w-auto px-8 py-5 text-lg font-black rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 cursor-pointer ${
              panicActivated
                ? 'bg-amber-600 text-white hover:bg-amber-700 animate-bounce'
                : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200 ring-4 ring-red-200'
            }`}
          >
            {panicActivated ? 'PANIC ACTIVE / ALERTER ON' : t.panicButton}
          </button>
        </div>

        {panicActivated && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg flex items-center gap-3 animate-fade-in">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs font-bold leading-relaxed">
              {language === 'sw' 
                ? 'Kengele Imewashwa! Sehemu yako imeshirikishwa na nambari ya 1195, na ujumbe wa dharura umetumwa kwa jirani yako aliyeidhinishwa na kituo cha uokoaji.' 
                : 'Alert Broadcasted! Your GPS coordinates have been sent to 1195 crisis center, and an automated SMS has been triggered to your trusted safe network.'}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotlines and Contacts */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-purple-600 pl-3">
            {t.hotlineHeader}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.filter(c => c.type === 'helpline').map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 hover:border-purple-200 transition-all">
                <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-purple-700 bg-purple-50 rounded-full uppercase mb-3">
                  Toll-Free Helpline
                </span>
                <h4 className="font-bold text-gray-800 leading-tight">{c.name}</h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-600 shrink-0" /> {c.location}
                </p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {language === 'en' ? c.descriptionEn : c.descriptionSw}
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${c.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{c.phone}</span>
                  </a>
                  <button
                    onClick={() => handleRescueRequest(c.name)}
                    className="px-3 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.requestRescue}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-purple-600 pl-3 pt-2">
            {t.shelterHeader}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.filter(c => c.type === 'shelter').map(c => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-xs p-5 hover:border-teal-200 transition-all">
                <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-teal-700 bg-teal-50 rounded-full uppercase mb-3">
                  Emergency Shelter
                </span>
                <h4 className="font-bold text-gray-800 leading-tight">{c.name}</h4>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-600 shrink-0" /> {c.location}
                </p>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {language === 'en' ? c.descriptionEn : c.descriptionSw}
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${c.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Staff</span>
                  </a>
                  <button
                    onClick={() => handleRescueRequest(c.name)}
                    className="px-3 py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.requestRescue}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {rescueRequested && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-3 text-teal-950 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-teal-600 shrink-0" />
              <p className="text-xs font-medium leading-relaxed">
                {t.rescueAlert} <strong>({rescueRequested})</strong>
              </p>
            </div>
          )}
        </div>

        {/* Safety Plan Block */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 border-l-4 border-teal-600 pl-3">
            {t.safetyPlanHeader}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {language === 'sw'
              ? 'Wakati wa dharura, uwezo wa kuondoka haraka ni muhimu. Hifadhi mwongozo huu wa hatua tatu.'
              : 'During crisis events, speed and stealth save lives. Memorize these guidelines to protect yourself and your children.'}
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100/50 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700 text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-purple-950">
                  {language === 'sw' ? 'Weka Nyaraka Salama' : 'Secure Identification Folder'}
                </h4>
                <p className="text-xs text-purple-900/80 leading-relaxed mt-1">
                  {t.safetyStep1.split(': ')[1]}
                </p>
              </div>
            </div>

            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100/50 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-teal-950">
                  {language === 'sw' ? 'Weka Mfumo wa Ishara' : 'Signal Code words'}
                </h4>
                <p className="text-xs text-teal-900/80 leading-relaxed mt-1">
                  {t.safetyStep2.split(': ')[1]}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-950">
                  {language === 'sw' ? 'Mpango wa Kuondoka' : 'Escape Coordinates'}
                </h4>
                <p className="text-xs text-gray-800/80 leading-relaxed mt-1">
                  {t.safetyStep3.split(': ')[1]}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 text-blue-900 rounded-xl text-xs flex items-start gap-2.5 mt-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {language === 'sw'
                ? 'Nambari hizi zote za simu ni bure (hazihitaji salio la airtime) kwenye mitandao yote ya simu.'
                : 'All listed emergency hotlines are 100% free of charge (toll-free) and do not require credit/airtime.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
