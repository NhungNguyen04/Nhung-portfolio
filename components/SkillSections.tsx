'use client';

import React, { useState } from 'react';
import { useLanguage } from '../lib/languageContext';

const skills = [
  {name: 'HTML/CSS', level:90, category: 'frontend'},
  {name: 'JavaScript', level:90, category: 'frontend'},
  {name: 'TypeScript', level:90, category: 'frontend'},
  {name: 'React', level:90, category: 'frontend'},
  {name: 'Vue.js', level:80, category: 'frontend'},
  {name: 'Next.js', level:85, category: 'frontend'},
  {name: 'Tailwind CSS', level:85, category: 'frontend'},
   {name: 'Node.js', level:90, category: 'backend'},
  {name: 'Rest APIs', level:90, category: 'backend'},
  {name: 'Express.js', level:85, category: 'backend'},
  {name: 'NestJS', level:85, category: 'backend'},
  {name: 'PostgreSQL', level:90, category: 'database'},
  {name: 'MongoDB', level:80, category: 'database'},
  {name: 'Prisma', level:85, category: 'database'},
  {name: 'Sequelize', level:80, category: 'database'},
  {name: 'Git/Github/Bitbucket', level:90, category: 'tools'},
  {name: 'Figma', level:85, category: 'tools'},
  {name: 'VS Code', level:90, category: 'tools'},
  {name: 'React Native', level:90, category: 'mobile'},
   {name: 'Python', level:70, category: 'ai'},
  {name: 'Google Colab', level:70, category: 'ai'},
];

const SkillSections = () => {
  const { messages } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: messages.skills.categories.all },
    { id: "frontend", label: messages.skills.categories.frontend },
    { id: "backend", label: messages.skills.categories.backend },
    { id: "database", label: messages.skills.categories.database },
    { id: "mobile", label: messages.skills.categories.mobile },
    { id: "ai", label: messages.skills.categories.ai },
    { id: "tools", label: messages.skills.categories.tools }
  ];

  return (
    <section id="skills" className='py-24 px-4 position-relative bg-secondary/30'>
      <div className='container mx-auto max-w-5xl'>
        <h2 className='text-3xl md:text-4xl font-bold mb-2 text-center'>
          {messages.skills.title.split(' ')[0]} {' '}<span className='text-primary'>{messages.skills.title.split(' ')[1]}</span>
        </h2>

        <div className='flex flex-wrap justify-center gap-4 mb-12'>
          {categories.map((category, index) => (
            <button 
              key={index} 
              className={`px-4 py-2 rounded-full transition-colors duration-300 hover:cursor-pointer ${activeCategory === category.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-primary/10'}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {skills.map((skill, key) => (
            (activeCategory === "all" || skill.category === activeCategory) &&
            <div key={key} className='bg-card p-4 rounded-lg shadow-xs card-hover'>
              <div className='text-left'>
                <h3 className='font-semibold text-md mb-2'>{skill.name}</h3>
                {/* Removed level bar and percentage */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillSections;
