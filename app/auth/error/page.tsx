"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useLanguage } from "../../../lib/languageContext"
import { Globe, AlertTriangle } from "lucide-react"
import StarBackground from "../../../components/StarBackground"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const { messages, language, toggleLanguage } = useLanguage()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    setError(errorParam)
  }, [searchParams])

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case "AccessDenied":
        return messages.authError.accessDenied
      case "Configuration":
        return messages.authError.configuration
      case "Verification":
        return messages.authError.verification
      default:
        return messages.authError.default
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
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
            
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            
            {/* Error Title */}
            <h1 className="text-2xl font-bold text-foreground">
              {errorInfo.title}
            </h1>
            
            {/* Error Message */}
            <p className="text-muted-foreground leading-relaxed">
              {errorInfo.message}
            </p>

            {/* Access Denied Warning */}
            {error === "AccessDenied" && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                  <strong>{messages.authError.note.split(':')[0]}:</strong> {messages.authError.note.split(':')[1]}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/auth")}
                className="w-full cosmic-button hover:cursor-pointer"
              >
                {messages.authError.tryAgain}
              </button>
              
              <button
                onClick={() => router.push("/")}
                className="w-full px-4 py-3 bg-background/50 border border-border/50 text-foreground rounded-lg hover:bg-background/80 transition-colors duration-300 hover:cursor-pointer"
              >
                {messages.authError.goHome}
              </button>
            </div>

            {/* Technical Details */}
            {error && (
              <div className="pt-4 border-t border-border/30">
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                    {messages.authError.technicalDetails}
                  </summary>
                  <div className="mt-3 p-3 bg-muted/20 rounded-lg text-xs font-mono text-muted-foreground border border-border/30">
                    {messages.authError.errorCode}: {error}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}