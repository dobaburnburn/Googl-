import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@/components/google-analytics'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'The AI Grid | Exploring the Future of Artificial Intelligence',
  description: 'Your premier source for AI news, insights, tutorials, and in-depth analysis of the latest developments in artificial intelligence and machine learning.',
  keywords: ['AI', 'artificial intelligence', 'machine learning', 'deep learning', 'AI news', 'AI blog'],
  authors: [{ name: 'The AI Grid Team' }],
  openGraph: {
    title: 'The AI Grid',
    description: 'Exploring the Future of Artificial Intelligence',
    siteName: 'theaigrid.xyz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The AI Grid',
    description: 'Exploring the Future of Artificial Intelligence',
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
