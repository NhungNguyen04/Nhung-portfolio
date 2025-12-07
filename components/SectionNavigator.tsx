'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/languageContext';

interface SectionNavItem {
  name: string;
  href: string;
}

interface Messages {
  sectionNav: {
    home: string;
    about: string;
    skills: string;
    experience: string;
    projects: string;
    contact: string;
  };
  [key: string]: any;
}

const getSectionNavItems = (messages: Messages): SectionNavItem[] => [
  { name: messages.sectionNav.home, href: '#hero' },
  { name: messages.sectionNav.about, href: '#about' },
  { name: messages.sectionNav.experience, href: '#experience' },
  { name: messages.sectionNav.skills, href: '#skills' },
  { name: messages.sectionNav.projects, href: '#projects' },
  { name: messages.sectionNav.contact, href: '#contact' },  
];

const SectionNavigator = () => {
  const { messages } = useLanguage();
  const [activeSection, setActiveSection] = useState('hero');
  const sectionNavItems = getSectionNavItems(messages);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSectionClick = (href: string) => {
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block p-2 bg-amber-50/50 rounded-2xl">
      <nav className="flex flex-col space-y-4">
        {sectionNavItems.map((item, index) => {
          const sectionId = item.href.replace('#', '');
          const isActive = activeSection === sectionId;
          
          return (
            <button
              key={index}
              onClick={() => handleSectionClick(item.href)}
              className={cn(
                "group relative flex items-center transition-all duration-300",
                "hover:scale-110 hover:cursor-pointer"
              )}
              title={item.name}
            >
              <div className={cn(
                "w-3 h-3 rounded-full border-2 transition-all duration-300",
                isActive 
                  ? "bg-primary border-primary scale-125" 
                  : "border-muted-foreground/50 hover:border-primary"
              )} />
              
              <span className={cn(
                "absolute right-full mr-4 px-3 py-1 rounded-md text-sm font-medium",
                "bg-background/80 backdrop-blur-sm border border-border/50",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                "whitespace-nowrap pointer-events-none",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SectionNavigator;
