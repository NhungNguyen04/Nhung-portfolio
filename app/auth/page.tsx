"use client"

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "../../lib/languageContext"
import { Globe } from "lucide-react"
import StarBackground from "../../components/StarBackground"

export default function AuthPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { messages, language, toggleLanguage } = useLanguage()

  useEffect(() => {
    // Redirect to owner dashboard if already authenticated
    if (session) {
      router.push("/owner")
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <StarBackground />
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <div className="text-lg text-muted-foreground">{messages.auth.loading}</div>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <StarBackground />
        <div className="relative z-10 flex flex-col items-center space-y-6 max-w-md mx-auto p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-primary">{messages.auth.signedInAs}</h2>
            <p className="text-lg text-muted-foreground">{session.user?.email}</p>
            <p className="text-sm text-muted-foreground">{messages.auth.redirecting}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors duration-300 hover:cursor-pointer"
          >
            {messages.auth.signOutButton}
          </button>
        </div>
      </div>
    )
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <StarBackground />
        
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="fixed top-6 right-6 z-50 flex items-center space-x-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 text-foreground/80 hover:text-primary transition-colors duration-300 hover:cursor-pointer"
        >
          <Globe size={20} />
          <span>{language.toUpperCase()}</span>
        </button>

        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{messages.auth.title}</h1>
                <p className="text-muted-foreground">
                  {messages.auth.subtitle}
                </p>
              </div>
              
              <button
                onClick={() => signIn("google")}
                className="w-full cosmic-button flex items-center justify-center space-x-3 hover:cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                </svg>
                <span>{messages.auth.signInButton}</span>
              </button>

              <div className="text-center">
                <button
                  onClick={() => router.push("/")}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm hover:cursor-pointer"
                >
                  ← {messages.authError.goHome}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}