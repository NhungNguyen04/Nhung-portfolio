import React from 'react'
import ThemeToggle from '../components/ThemeToggle'
import StarBackground from '../components/StarBackground'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import AboutMe from '../components/AboutMe'
import SkillSections from '../components/SkillSections'
import Projects from '../components/Projects'
import Contact from '../components/Contact'


export default function Home () {
  return (
    <div className='min-h-screen bg-background text-foreground overflow-x-hidden'>
      {/* Theme toggle */}
      <ThemeToggle />
      {/* Background effects */}
      <StarBackground />
      {/* Navbar */}
      <Navbar />
      {/* Main content */}
      <main>
        <HeroSection />
        <AboutMe />
        <SkillSections />
        <Projects />
        <Contact />
      </main>
      {/* Footer */}
    </div>
  )
}