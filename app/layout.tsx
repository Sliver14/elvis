import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JUST ELVIS JUSTICE | Dr. Elvis Justice Bedi | Official Book Launch',
  description: 'Welcome to the official launch portal of JUST ELVIS JUSTICE by Dr. Elvis Justice Bedi. Secure your exclusive pre-order access, explore key lessons, and register for the virtual launch event.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'JUST ELVIS JUSTICE | Dr. Elvis Justice Bedi | Official Book Launch',
    description: 'Welcome to the official launch portal of JUST ELVIS JUSTICE by Dr. Elvis Justice Bedi. Secure your exclusive pre-order access, explore key lessons, and register for the virtual launch event.',
    siteName: 'JUST ELVIS JUSTICE Book Launch',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JUST ELVIS JUSTICE | Dr. Elvis Justice Bedi | Official Book Launch',
    description: 'Welcome to the official launch portal of JUST ELVIS JUSTICE by Dr. Elvis Justice Bedi. Secure your exclusive pre-order access, explore key lessons, and register for the virtual launch event.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

import ClientLayout from '@/components/client-layout'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased bg-background text-foreground">
        <ClientLayout>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ClientLayout>
      </body>
    </html>
  )
}
