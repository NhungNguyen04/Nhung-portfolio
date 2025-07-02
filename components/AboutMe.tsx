'use client';

import { Brain, Code, Group, GroupIcon } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../lib/languageContext';

const AboutMe = () => {
  const { messages } = useLanguage();

  return (
    <section id="about" className='py-24 px-4 relative'>
      <div className='container mx-auto max-w-5xl my-4'>
        <h2 className='text-3xl md:text-4xl font-bold mb-2 text-center'>
          {messages.about.title} <span className='text-primary'> {' '}{messages.about.me}</span>
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        <div className='space-y-6 flex flex-col items-center'>
          <h3 className='text-2xl font-semibold'>{messages.about.role}</h3>
          <p className='text-muted-foreground'>
            {messages.about.description1}
          </p>
          <p className='text-muted-foreground'>
            {messages.about.description2}
          </p>
          <div className='flex flex-col sm:flex-row pt-4 justify-center'>
            <a href="#contact" className='cosmic-button mr-4 hover:cursor-pointer'>{messages.about.getInTouch}</a>
            <a href="https://drive.google.com/file/d/1JajDMzG95z_SYeTJV4jfA86TiURxQGCG/view?usp=sharing" className='px-4 py-2 rounded-l-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300 hover:cursor-pointer'>
              {messages.about.downloadCVEng}
            </a>
            <a href="https://drive.google.com/file/d/1gil-gRZDYjrvtJ7OdgW0IFXpQUsVAYzB/view?usp=sharing" className='px-4 py-2 rounded-r-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300 hover:cursor-pointer'>
              {messages.about.downloadCVVie}
            </a>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6'>
          <div className='gradient-border p-6 card-hover'>
            <div className='flex items-start gap-4'>
              <div className='p-3 rounded-full bg-primary/10'>
                <Code className='text-primary w-6 h-6' />
              </div>
              <div className='text-left'>
                <h4 className='font-semibold text-lg'>{messages.about.cards.fullstack.title}</h4>
                <p>{messages.about.cards.fullstack.description}</p>
              </div>
            </div>
          </div>
          <div className='gradient-border p-6 card-hover'>
            <div className='flex items-start gap-4'>
              <div className='p-3 rounded-full bg-primary/10'>
                <GroupIcon className='text-primary w-6 h-6' />
              </div>
              <div className='text-left'>
                <h4 className='font-semibold text-lg'>{messages.about.cards.team.title}</h4>
                <p>{messages.about.cards.team.description}</p>
              </div>
            </div>
          </div>
          <div className='gradient-border p-6 card-hover'>
            <div className='flex items-start gap-4'>
              <div className='p-3 rounded-full bg-primary/10'>
                <Brain className='text-primary w-6 h-6' />
              </div>
              <div className='text-left'>
                <h4 className='font-semibold text-lg'>{messages.about.cards.ai.title}</h4>
                <p>{messages.about.cards.ai.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
