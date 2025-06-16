import { Brain, Code, Group, GroupIcon } from 'lucide-react'
import React from 'react'

const AboutMe = () => {
  return (
    <section id="about" className='py-24 px-4 relative'>
      <div className='container mx-auto max-w-5xl'>
        <h2 className='text-3xl md:text-4xl font-bold mb-2 text-center'>
          About <span className='text-primary'> {' '}Me</span>
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        <div className='space-y-6'>
          <h3 className='text-2xl font-semibold'>Aspiring Fullstack Developer</h3>
          <p className='text-muted-foreground'>
            I’m a third-year Software Engineering student passionate about building clean, user-friendly digital products. I specialize in fullstack web and mobile development using technologies like React, Next.js, NestJS, and PostgreSQL.
          </p>
          <p className='text-muted-foreground'>
            From solo projects to team-based academic platforms, I’ve built tools that support collaboration, e-commerce, and even AI-powered features. I enjoy learning new technologies and challenging myself to create real, usable solutions.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 pt-4 justify-center'>
            <a href="#contact" className='cosmic-button'>Get In Touch</a>
            <a href="https://drive.google.com/file/d/1VzYYFMfxGrOClNDw3dNCo_2IVt4AqH74/view?usp=sharing" className='px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300'>
            Download CV
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
                <h4 className='font-semibold text-lg'>Fullstack Web & Mobile Development</h4>
                <p>Building responsive websites and cross-platform mobile apps using modern frameworks like React, Next.js, and React Native.</p>
              </div>
            </div>
          </div>
          <div className='gradient-border p-6 card-hover'>
            <div className='flex items-start gap-4'>
              <div className='p-3 rounded-full bg-primary/10'>
                <GroupIcon className='text-primary w-6 h-6' />
              </div>
              <div className='text-left'>
                <h4 className='font-semibold text-lg'>Team Projects & Collaboration</h4>
                <p>Experienced in working with teams to deliver academic software projects with multiple user roles, backend APIs, and clean UI.</p>
              </div>
            </div>
          </div>
          <div className='gradient-border p-6 card-hover'>
            <div className='flex items-start gap-4'>
              <div className='p-3 rounded-full bg-primary/10'>
                <Brain className='text-primary w-6 h-6' />
              </div>
              <div className='text-left'>
                <h4 className='font-semibold text-lg'>AI Integration & Learning</h4>
                <p>Exploring how AI can enhance user experience—such as AI-generated tasks, virtual try-ons.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMe
