import React from 'react'
import ThemeToggle from '../components/ThemeToggle'
import StarBackground from '../components/StarBackground'

export default function Home () {
  return (
    <div className='min-h-screen bg-background text-foreground overflow-x-hidden'>
      {/* Theme toggle */}
      <ThemeToggle />
      {/* Background effects */}
      <StarBackground />
      {/* Navbar */}
      {/* Main content */}
      {/* Footer */}
    </div>
  )
}