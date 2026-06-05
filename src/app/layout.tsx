import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Do You Know Hertford? | The Ultimate Hertford Quiz',
  description: 'Test your knowledge of Hertford, Hertfordshire! Free quiz with leaderboards, local history, and questions from local businesses.',
  keywords: ['Hertford', 'quiz', 'Hertfordshire', 'local knowledge', 'trivia'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
