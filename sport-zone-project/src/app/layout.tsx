import './globals.css'
import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'

const cairo = Cairo({ 
  subsets: ['arabic', 'latin'],
  display: 'swap',
})

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
      <body className={cairo.className}>{children}</body>
    </html>
  )
}
