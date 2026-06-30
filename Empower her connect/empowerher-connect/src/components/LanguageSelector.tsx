import { Language } from '../types';
import { translations } from '../translations';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export default function LanguageSelector({ language, setLanguage }: LanguageSelectorProps) {
  const t = translations[language];

  return (
    <button
      id="btn-language-selector"
      onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition duration-150 border border-teal-200 cursor-pointer shadow-xs"
    >
      <Globe className="w-4 h-4 text-teal-600" />
      <span>{t.switchLanguage}</span>
    </button>
  );
}
