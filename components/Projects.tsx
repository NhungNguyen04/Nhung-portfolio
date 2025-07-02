'use client';

import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../lib/languageContext';

const Projects = () => {
  const { messages } = useLanguage();

  const projects = [
    {
      id: 1,
      title: messages.projects.workspacing.title,
      description: messages.projects.workspacing.description,
      image: '/projects/workspacing.png',
      tags: ['Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'OpenAI API', 'Prisma'],
      demoUrl: 'https://workspacing.vercel.app',
      githubUrl: 'https://github.com/NhungNguyen04/Workspacing',
    },
    {
      id: 2,
      title: messages.projects.authentication.title,
      description: messages.projects.authentication.description,
      image: '/projects/authentication.png',
      tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma'],
      demoUrl: 'https://nhung-authentication.vercel.app',
      githubUrl: 'https://github.com/NhungNguyen04/Authentication',
    },
    {
      id: 3,
      title: messages.projects.clothing.title,
      description: messages.projects.clothing.description,
      image: '/projects/clothing.png',
      tags: ['ReactJS', 'Tailwind CSS', 'React Native', 'Nest.js', 'PostgreSQL', 'Prisma'],
      demoUrl: 'https://nh-clothing.netlify.app/',
      githubUrl: 'https://github.com/NhungNguyen04/Clothing-Shop-Main',
    },
    {
      id: 4,
      title: messages.projects.vonders.title,
      description: messages.projects.vonders.description,
      image: '/projects/vonders.jpeg',
      tags: ['NextJS', 'Tailwind CSS', 'Nest.js', 'PostgreSQL', 'Prisma'],
      demoUrl: 'https://front-end-vonder.vercel.app/',
      githubUrl: 'https://github.com/NhungNguyen04/Vonders-Main',
    },
  ];

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {messages.projects.featured + ' '}
          <span className="text-primary">{messages.projects.projects}</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {messages.projects.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, key) => (
            <div
              key={key}
              className="group bg-card rounded-lg shadow-xs card-hover p-4"
            >
              <div className="h-60 min-w-auto flex items-center justify-center overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="max-h-60 max-w-full object-contain mx-auto transition-transform duration-500 group-hover:scale-150"
                  style={{ background: 'transparent' }}
                />
              </div>

              <div className="p-2 my-2">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {project.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    className="text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    <ExternalLink />
                  </a>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    className="text-foreground/80 hover:text-primary transition-colors duration-300"
                  >
                    <Github />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/NhungNguyen04"
            target="_blank"
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
          >
            {messages.projects.githubCTA} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
