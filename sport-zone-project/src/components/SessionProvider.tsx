"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

/**
 * Session Provider wrapper
 * يوفر session context لجميع المكونات
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
