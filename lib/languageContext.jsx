'use client';

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
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get language from localStorage or default to 'en'
    const storedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(storedLanguage);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', language);
    }
  }, [language, mounted]);

  const messages = language === 'en' ? engMessages : viMessages;

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'vi' : 'en'));
  };

  if (!mounted) {
    return null; // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, messages }}>
      {children}
    </LanguageContext.Provider>
  );
};
