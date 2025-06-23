import React, { createContext, useContext, useState, useEffect } from 'react';
import engMessages from './messages/eng.json';
import viMessages from './messages/vi.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get language from localStorage or default to 'en'
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const messages = language === 'en' ? engMessages : viMessages;

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'vi' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, messages }}>
      {children}
    </LanguageContext.Provider>
  );
};
