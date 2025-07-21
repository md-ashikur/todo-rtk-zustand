import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Todo List',
  description: 'Next.js Todo App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}