import React, { useState, useEffect } from 'react';
import { CounselingResource } from '../types';
import { INITIAL_COUNSELING_RESOURCES } from '../data';
import { translations } from '../translations';
import { Heart, Calendar, Smile, Clock, User, CheckCircle, Wind } from 'lucide-react';

interface CounselingSectionProps {
  language: 'en' | 'sw';
}

export default function CounselingSection({ language }: CounselingSectionProps) {
  const t = translations[language];
  const [resources] = useState<CounselingResource[]>(INITIAL_COUNSELING_RESOURCES);
  const [mood, setMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<{ date: string; mood: string }[]>([]);
  const [moodSaved, setMoodSaved] = useState(false);

  // Breathing state
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathTimer, setBreathTimer] = useState(4);

  // Booking state
  const [counselor, setCounselor] = useState('Dr. Jane Sang');
  const [dateTime, setDateTime] = useState('');
  const [booked, setBooked] = useState(false);

  // Breathing loop logic
  useEffect(() => {
    const timer = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          if (breathState === 'inhale') {
            setBreathState('hold');
            return 4; // Hold for 4 seconds
          } else if (breathState === 'hold') {
            setBreathState('exhale');
            return 4; // Exhale for 4 seconds
          } else {
            setBreathState('inhale');
            return 4; // Inhale for 4 seconds
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathState]);

  const handleMoodSelect = (selectedMood: string) => {
    setMood(selectedMood);
    const today = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'sw-KE', {
      month: 'short',
      day: 'numeric',
    });
    
    setMoodHistory((prev) => [{ date: today, mood: selectedMood }, ...prev.slice(0, 4)]);
    setMoodSaved(true);
    setTimeout(() => {
      setMoodSaved(false);
    }, 4000);
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateTime) {
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        setDateTime('');
      }, 6000);
    }
  };

  const moods = [
    { emoji: '🌸', nameEn: 'Peaceful', nameSw: 'Amani', color: 'bg-green-50 border-green-200 text-green-700' },
    { emoji: '☀️', nameEn: 'Resilient', nameSw: 'Imara', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
    { emoji: '🌧️', nameEn: 'Overwhelmed', nameSw: 'Nimelemewa', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { emoji: '🌱', nameEn: 'Healing', nameSw: 'Kupona', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Upper header */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-purple-950 flex items-center gap-2">
          <Heart className="w-5 h-5 text-purple-600 animate-pulse" />
          {t.counselingTitle}
        </h2>
        <p className="text-sm text-purple-900 mt-1 leading-relaxed">
          {t.counselingDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood tracker and Guided Breathing */}
        <div className="space-y-6 lg:col-span-2">
          {/* Mood tracker */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Smile className="w-5 h-5 text-purple-600" />
              {t.moodTrackerTitle}
            </h3>
            <p className="text-xs text-gray-500 mb-4">{t.moodPrompt}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {moods.map((m) => (
                <button
                  key={m.nameEn}
                  id={`mood-${m.nameEn}`}
                  onClick={() => handleMoodSelect(m.emoji)}
                  className={`flex flex-col items-center p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer hover:shadow-xs active:scale-95 ${
                    mood === m.emoji ? `${m.color} ring-2 ring-purple-600/20 scale-105` : 'bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span>{language === 'en' ? m.nameEn : m.nameSw}</span>
                </button>
              ))}
            </div>

            {moodSaved && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-950 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{t.moodSaved}</span>
              </div>
            )}

            {moodHistory.length > 0 && (
              <div className="mt-5 pt-4 border-t border-gray-50">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                  {t.moodHistory}
                </h4>
                <div className="flex gap-2">
                  {moodHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-gray-600">
                      <span className="text-base">{item.mood}</span>
                      <span>{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Guided breathing block */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 text-center space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center justify-center gap-2">
              <Wind className="w-5 h-5 text-teal-600" />
              {t.breathingTitle}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
              {t.breathingDesc}
            </p>

            <div className="flex flex-col items-center py-6 justify-center">
              {/* Animated visual breathing circle */}
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-[1000ms] border shadow-md ${
                  breathState === 'inhale'
                    ? 'bg-purple-100 border-purple-300 scale-110 text-purple-950'
                    : breathState === 'hold'
                    ? 'bg-teal-100 border-teal-300 scale-105 text-teal-950'
                    : 'bg-rose-50 border-rose-200 scale-95 text-rose-950'
                }`}
              >
                <span className="text-sm font-black uppercase tracking-widest">
                  {breathState === 'inhale' ? t.breathIn.split(' (')[0] : breathState === 'hold' ? t.breathHold : t.breathOut.split(' (')[0]}
                </span>
                <span className="text-3xl font-extrabold mt-1">{breathTimer}s</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-semibold italic">
              {breathState === 'inhale' 
                ? (language === 'sw' ? 'Vuta pumzi polepole na ujaze mapafu yako na matumaini...' : 'Inhale slowly and fill your core with fresh hope...')
                : breathState === 'hold'
                ? (language === 'sw' ? 'Shikilia amani na uhisi utulivu...' : 'Hold peace, letting it circulate through your muscles...')
                : (language === 'sw' ? 'Toa pumzi yote na uachilie wasiwasi na hofu...' : 'Exhale completely, letting go of any stored pressure...')}
            </p>
          </div>
        </div>

        {/* Therapist Booking panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-600" />
              {t.bookSessionTitle}
            </h3>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.counselorLabel}
                </label>
                <select
                  value={counselor}
                  onChange={(e) => setCounselor(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                >
                  <option value="Dr. Jane Sang">Dr. Jane Sang (Trauma Expert)</option>
                  <option value="Sister Amina Mavazi">Sister Amina (Support Counselor)</option>
                  <option value="Mama Beatrice Ngozi">Mama Beatrice (Grief Support)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {t.timeLabel}
                </label>
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <button
                id="btn-book-counseling"
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Clock className="w-4 h-4" />
                <span>{t.bookButton}</span>
              </button>
            </form>

            {booked && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl flex items-start gap-2 text-purple-950 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium leading-relaxed">
                  {t.bookingSuccess}
                </p>
              </div>
            )}
          </div>

          {/* Educational Healing resources */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {language === 'sw' ? 'Miongozo ya Uponyaji' : 'Therapeutic Guidelines'}
            </h4>
            {resources.map((res) => (
              <div key={res.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                <h5 className="text-xs font-bold text-gray-800">
                  {language === 'en' ? res.titleEn : res.titleSw}
                </h5>
                <p className="text-[10px] text-gray-600 leading-relaxed">
                  {language === 'en' ? res.contentEn : res.contentSw}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
