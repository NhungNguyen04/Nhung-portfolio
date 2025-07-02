'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '../lib/languageContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </SessionProvider>
  );
}
