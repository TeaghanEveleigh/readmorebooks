import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateShort(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function calculateReadingProgress(currentPage: number, totalPages: number): number {
  if (totalPages === 0) return 0;
  return Math.min(Math.round((currentPage / totalPages) * 100), 100);
}
export function toHttps(url?: string) {
  if (!url) return "/placeholder-book.png";
  try {
    const u = new URL(url);
    u.protocol = "https:";             
    return u.toString();
  } catch {
    return url;
  }
}


export function getBookCover(book: any): string {
        console.log("Book Is the following",book)
        console.log("Volume link is " ,  book.volumeInfo?.imageLinks?.thumbnail ||
    book.volumeInfo?.imageLinks?.smallThumbnail ||
    '/placeholder-book.png')

  return (
    book.volumeInfo?.imageLinks?.thumbnail ||
    book.volumeInfo?.imageLinks?.smallThumbnail ||
    '/placeholder-book.png'
  );
}

export function getBookAuthors(book: any): string {
  return book.volumeInfo?.authors?.join(', ') || 'Unknown Author';
}

export function getBookTitle(book: any): string {
  return book.volumeInfo?.title || 'Unknown Title';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
