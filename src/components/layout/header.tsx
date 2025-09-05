'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Search, Home, Library, BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Currently Reading', href: '/currently-reading', icon: BookOpen },
  { name: 'Libraries', href: '/libraries', icon: Library },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Book className="h-8 w-8" style={{ color: 'var(--accent)' }} />
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Read More Books
            </span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-[var(--accent)] text-white'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
            
            <div className="ml-4 border-l border-[var(--border)] pl-4">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}