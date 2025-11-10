import './globals.css'
import type { Metadata } from 'next'
import { SessionProvider } from "@/components/SessionProvider"

export const metadata: Metadata = {
  title: 'Sport Zone - المنطقة الرياضية',
  description: 'نظام إدارة النادي الرياضي',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
