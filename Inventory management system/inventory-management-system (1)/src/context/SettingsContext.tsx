import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../translations';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  t: (key: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Read initial states from localStorage
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('stockmaster_lang');
    return (saved as Language) || 'en';
  });

  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('stockmaster_theme');
    return saved ? saved === 'dark' : true; // Default to dark obsidian mode as setup
  });

  // Handle translation
  const t = (key: string): string => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  };

  // Sync dark class on document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [darkMode]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('stockmaster_lang', lang);
  };

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem('stockmaster_theme', dark ? 'dark' : 'light');
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, darkMode, setDarkMode, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
