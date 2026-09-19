import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { StoreProvider } from '@/components/store-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'SERENDIPITY / ELVIS — Books for curious minds',
  description: 'An independent bookstore for ideas with staying power. Discover Practical Trading Psychology and more.',
  generator: 'insightnovatech.com',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f2ec',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <Nav />
          {children}
          <Footer />
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
