import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Replace with your authorized email address
      const authorizedEmail = process.env.AUTHORIZED_EMAIL || "your-email@gmail.com"
      
      // Check if the user's email matches the authorized email
      if (user.email === authorizedEmail) {
        return true
      }
      
      // Reject sign-in if email doesn't match
      return false
    },
    async session({ session, token }) {
      // Session is already authorized if it exists due to signIn callback
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.isAuthorized = true
      }
      return token
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error'
  },
  session: {
    strategy: "jwt"
  }
}
