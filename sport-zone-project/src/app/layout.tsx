import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sport Zone - المنطقة الرياضية',
  description: 'نظام إدارة النادي الرياضي - لوحة التحكم الإحصائية المتقدمة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Cairo, sans-serif' }}>{children}</body>
    </html>
  )
}
