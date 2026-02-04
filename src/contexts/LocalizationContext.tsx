import React, { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'en' | 'ar';

interface LocalizationContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  return context;
};

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = (key: string): string => {
    const translations: Record<string, Record<Locale, string>> = {
      'app.title': { en: 'KNOUX Player X', ar: 'مشغل كنوكس إكس' },
      'player.play': { en: 'Play', ar: 'تشغيل' },
      'player.pause': { en: 'Pause', ar: 'إيقاف' },
      'player.stop': { en: 'Stop', ar: 'إيقاف' },
      'player.volume': { en: 'Volume', ar: 'الصوت' },
      'settings.title': { en: 'Settings', ar: 'الإعدادات' },
      'library.title': { en: 'Library', ar: 'المكتبة' },
      'browser.title': { en: 'Browser', ar: 'المستعرض' },
    };

    return translations[key]?.[locale] || key;
  };

  const value: LocalizationContextValue = {
    locale,
    t,
    setLocale,
  };

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};
