import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isRTL as checkIsRTL } from '../i18n/direction';
import { DirectionContext } from './types/DirectionContext';

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
