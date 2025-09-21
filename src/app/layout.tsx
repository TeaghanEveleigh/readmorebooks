import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/theme-context';
import { Header } from '@/components/layout/header';
import { AuthProvider } from '@/components/auth/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookKeeper - Track Your Reading Journey',
  description: 'A modern bookkeeping application to track your reading progress, create libraries, and connect with fellow book lovers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider><ThemeProvider>
          <div className="min-h-screen bg-[var(--bg-primary)]">
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </ThemeProvider></AuthProvider>
      </body>
    </html>
  );
}