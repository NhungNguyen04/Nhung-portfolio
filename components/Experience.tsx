'use client';

import React from 'react';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { useLanguage } from '../lib/languageContext';
import Image from 'next/image';

const Experience = () => {
  const { messages } = useLanguage();

  const getIconForExperience = (role: string) => {
    if (role.toLowerCase().includes('bachelor') || role.toLowerCase().includes('university')) {
      return <GraduationCap className="h-6 w-6" />;
    }
    return <Briefcase className="h-6 w-6" />;
  };

  const getLogoForCompany = (company: string) => {
    if (company.toLowerCase().includes('university') || company.toLowerCase().includes('uit')) {
      return '/companies/uit_logoo.png';
    }
    if (company.toLowerCase().includes('consortia')) {
      return '/companies/consortiagroupco_logo.jpg';
    }
    return null;
  };

  return (
    <section id="experience" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My <span className="text-primary">Journey</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/50 via-primary to-primary/50 hidden md:block" />

          <div className="space-y-12">
            {messages.experience.experiences.map((exp: any, index: number) => {
              const isEven = index % 2 === 0;
              const isEducation = exp.role.toLowerCase().includes('bachelor') || exp.role.toLowerCase().includes('university');
              const logo = getLogoForCompany(exp.company);

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg z-10">
                      <div className="text-primary">
                        {getIconForExperience(exp.role)}
                      </div>
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`w-full md:w-[calc(50%-2rem)] ${
                      isEven ? 'md:pr-6 md:text-right' : 'md:pl-6 md:text-left'
                    }`}
                  >
                    <div
                      className={`group bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                        isEducation ? 'hover:border-primary/50' : 'hover:border-primary/50'
                      }`}
                    >
                      {/* Mobile icon */}
                      <div className="md:hidden flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mr-4">
                          <div className="text-primary">
                            {getIconForExperience(exp.role)}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {exp.duration}
                        </div>
                      </div>

                      {/* Desktop duration - positioned absolutely */}
                      <div className={`hidden md:flex items-center text-sm text-muted-foreground mb-3 ${
                        isEven ? 'justify-end' : 'justify-start'
                      }`}>
                        <Calendar className="h-4 w-4 mr-2" />
                        {exp.duration}
                      </div>

                      {/* Role */}
                      <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>

                      {/* Company with Logo */}
                      <div className={`flex items-center gap-2.5 mb-3 ${
                        isEven ? 'md:justify-end' : 'md:justify-start'
                      }`}>
                        {logo && (
                          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white flex-shrink-0 ring-2 ring-primary/20">
                            <Image
                              src={logo}
                              alt={exp.company}
                              fill
                              className="object-contain p-0.5"
                            />
                          </div>
                        )}
                        <span className="text-primary font-semibold text-sm">
                          {exp.company}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {exp.description}
                      </p>

                      {/* Decorative element */}
                      <div
                        className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary/20 rounded-full hidden md:block ${
                          isEven ? '-right-2' : '-left-2'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-16 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Experience;
