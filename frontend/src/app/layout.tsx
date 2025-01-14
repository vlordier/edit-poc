import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import './globals.css'
import ErrorBoundary from '../components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Edit POC',
  description: 'A proof of concept for editing functionality',
  keywords: ['edit', 'poc', 'nextjs'],
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  authors: [{ name: 'Your Name' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <ErrorBoundary>
          <main className="min-h-screen max-w-screen-2xl mx-auto px-4" role="main">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  )
}
