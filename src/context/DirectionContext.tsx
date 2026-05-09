import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL as checkIsRTL } from '../i18n/direction';

interface DirectionContextType {
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export const DirectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(() => checkIsRTL(i18n.language || 'pt'));

  useEffect(() => {
    const lang = i18n.language || 'pt';
    const rtl = checkIsRTL(lang);
    setIsRTL(rtl);
    
    // Update HTML attributes for bidirectionality
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  const value = useMemo(() => ({
    isRTL,
    direction: isRTL ? 'rtl' : 'ltr' as 'rtl' | 'ltr',
  }), [isRTL]);

  return (
    <DirectionContext.Provider value={value}>
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirection = (): DirectionContextType => {
  const context = useContext(DirectionContext);
  if (context === undefined) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
};
