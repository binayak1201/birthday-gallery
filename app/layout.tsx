import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import ChangingBackground from './components/ChangingBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Birthday Photo Gallery',
  description: 'A special photo gallery with 3D animations',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#ec4899',
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen overflow-x-hidden relative dark:text-white`}>
        <ChangingBackground />
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  )
}

export default RootLayout
