'use client';

import React, { useState } from 'react';
import { Plus, BookOpen, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LibraryBook } from '@/lib/types';

// Mock data - replace with actual API calls
const mockCurrentlyReading: LibraryBook[] = [
  {
    id: 'book1',
    volumeInfo: {
      title: 'Dune',
      authors: ['Frank Herbert'],
      publishedDate: '1965-08-01',
      averageRating: 4.2,
      imageLinks: { thumbnail: '/placeholder-book.png' }
    },
    dateAdded: new Date().toISOString(),
    readingStatus: 'currently-reading',
    progress: 45
  },
  {
    id: 'book2',
    volumeInfo: {
      title: 'The Name of the Wind',
      authors: ['Patrick Rothfuss'],
      publishedDate: '2007-03-27',
      averageRating: 4.5,
      imageLinks: { thumbnail: '/placeholder-book.png' }
    },
    dateAdded: new Date().toISOString(),
    readingStatus: 'currently-reading',
    progress: 78
  }
];

interface ReadingProgressProps {
  book: LibraryBook;
  onUpdateProgress: (bookId: string, progress: number) => void;
}

function ReadingProgress({ book, onUpdateProgress }: ReadingProgressProps) {
  const [progress, setProgress] = useState(book.progress || 0);

  const handleProgressChange = (newProgress: number) => {
    setProgress(newProgress);
    onUpdateProgress(book.id, newProgress);
  };

  return (
    <Card>
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="mb-1 font-semibold text-lg">{book.volumeInfo.title}</h3>
          <p className="mb-4 text-[var(--text-secondary)]">
            {book.volumeInfo.authors?.join(', ')}
          </p>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Reading Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${progress}%, var(--bg-secondary) ${progress}%, var(--bg-secondary) 100%)`
                }}
              />
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                <TrendingUp className="mr-1 h-3 w-3" />
                Update Progress
              </Button>
              {progress === 100 && (
                <Button size="sm">
                  Mark as Finished
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function CurrentlyReadingPage() {
  const [books, setBooks] = useState(mockCurrentlyReading);

  const handleUpdateProgress = (bookId: string, progress: number) => {
    setBooks(prev => 
      prev.map(book => 
        book.id === bookId ? { ...book, progress } : book
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
            Currently Reading
          </h1>
          <p className="text-[var(--text-secondary)]">
            Track your reading progress and stay motivated
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Book
        </Button>
      </div>
      
      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-[var(--text-muted)]" />
          <h3 className="mb-2 text-xl font-semibold">No books currently reading</h3>
          <p className="mb-4 text-[var(--text-secondary)]">
            Add some books to start tracking your reading progress!
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Book
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {books.map((book) => (
            <ReadingProgress
              key={book.id}
              book={book}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
}