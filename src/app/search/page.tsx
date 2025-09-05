'use client';

import React from 'react';
import { BookSearch } from '@/components/books/book-search';
import { BookCard } from '@/components/books/book-card';
import { useBookSearch } from '@/hooks/use-book';
import { Book } from '@/lib/types';

export default function SearchPage() {
  const { books, loading, error, searchBooks, clearSearch  } = useBookSearch();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
          Search Books
        </h1>
        <p className="text-[var(--text-secondary)]">
          Discover your next great read from millions of books
        </p>
      </div>
      
      <BookSearch 
        onSearch={searchBooks} 
        onClear={clearSearch}
        loading={loading}
      />
      
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin mx-auto mb-4 h-8 w-8 rounded-full border-b-2 border-[var(--accent)]" />
          <p className="text-[var(--text-secondary)]">Searching for books...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {books.length > 0 && (
        <div>
          <h2 className="mb-6 text-xl font-semibold text-[var(--text-primary)]">
            Search Results ({books.length} found)
          </h2>
          <div className="grid gap-6">
            {books.map((book : Book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}
      
      {!loading && !error && books.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">
            Enter a search term to find books
          </p>
        </div>
      )}
    </div>
  );
}