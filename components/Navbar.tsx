'use client';

import React, { useEffect } from 'react';
import { cn } from '../lib/utils';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';

interface NavItem {
  name: string;
  href: string;
}

interface Messages {
  nav: {
    home: string;
    about: string;
    skills: string;
    projects: string;
    contact: string;
  };
  [key: string]: any;
}

const getNavItems = (messages: Messages): NavItem[] => [
  { name: messages.nav.home, href: '#hero' },
  { name: messages.nav.about, href: '#about' },
  { name: messages.nav.skills, href: '#skills' }, 
  { name: messages.nav.projects, href: '#projects' },
  { name: messages.nav.contact, href: '#contact' },  
];

const Navbar = () => {
  const { language, toggleLanguage, messages } = useLanguage();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navItems = getNavItems(messages);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={cn("fixed w-full z-40 transition-all duration-300",
      isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5"
     )}>
      <div className='container flex items-center justify-between'>
        <a className="text-xl font-bold text-primary flex items-center" href="#hero">
          <span className='relative z-10'>
            <span className='text-glow text-foreground'>
              Nhung Nguyen 
            </span>
            {' '}Portfolio
          </span>
        </a>

        {/* desktop nav */}
        <div className='hidden md:flex items-center space-x-8'>
          {navItems.map((item, key) => (
            <a key={key} href={item.href} className='text-foreground/80 hover:text-primary transition-colors duration-300'>{item.name}</a>
          ))}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 text-foreground/80 hover:text-primary transition-colors duration-300"
          >
            <Globe size={20} />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>

        {/* mobile nav */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='md:hidden p-2 text-foreground z-50'
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24}/>}
        </button>
        <div className={cn("fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center",
          "transition-all duration-300 md:hidden",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}>
          <div className='flex flex-col space-y-8 text-xl'>
            {navItems.map((item, key) => (
              <a 
                key={key} 
                href={item.href} 
                className='text-foreground/80 hover:text-primary transition-colors duration-300'
                onClick={() => setIsMenuOpen(false)}
              >{item.name}
              </a>
            ))}
            <button
              onClick={() => {
                toggleLanguage();
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-center space-x-2 text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              <Globe size={20} />
              <span>{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
