'use client';

import React from 'react';
import { useLanguage } from '../../lib/languageContext';
import { Globe, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StarBackground from '../../components/StarBackground';

export default function BlogPage() {
  const { messages, language, toggleLanguage } = useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StarBackground />
      
      {/* Header */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-300 hover:cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>{messages.blog.backToPortfolio}</span>
          </button>
          
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 text-foreground/80 hover:text-primary transition-colors duration-300 hover:cursor-pointer"
          >
            <Globe size={20} />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>

        {/* Blog Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 py-20">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              {messages.blog.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {messages.blog.comingSoon}
            </p>
            <p className="text-muted-foreground">
              {messages.blog.description}
            </p>
            
            <div className="pt-8">
              <button
                onClick={() => router.push('/')}
                className="cosmic-button hover:cursor-pointer"
              >
                {messages.blog.returnToPortfolio}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
