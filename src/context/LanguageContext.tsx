
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { englishTranslations, indonesianTranslations } from '@/utils/translations';

type Language = 'en' | 'id';

type TranslationsType = {
  [key: string]: string;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('en');
  
  // Get translations based on selected language
  const translations: TranslationsType = 
    language === 'en' ? englishTranslations : indonesianTranslations;
  
  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
