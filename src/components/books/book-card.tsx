'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, BookOpen, Plus, Calendar } from 'lucide-react';
import { Book } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBookCover, getBookAuthors, getBookTitle } from '@/lib/utils';

interface BookCardProps {
  book: Book | null;
  showActions?: boolean;
  compact?: boolean;
}

export function BookCard({ book, showActions = true, compact = false }: BookCardProps) {
  const thumbnail = getBookCover(book);
  const title = getBookTitle(book);
  const authors = getBookAuthors(book);
  const rating = book?.volumeInfo.averageRating || 0;
  const publishedDate = book?.volumeInfo.publishedDate || '';
  const year = publishedDate ? new Date(publishedDate).getFullYear() : null;

  return (
    <Card className="group relative overflow-hidden">
     
      <div className={`flex gap-4 ${compact ? 'items-center' : ''}`}>
        <img src={thumbnail}></img>
        <div className="flex-shrink-0">
          <Link href={`/book/${book?.id}`}>
            <h3 className={`font-semibold transition-colors duration-200 hover:text-[var(--accent)] ${
              compact ? 'text-base' : 'text-lg'
            } mb-2`}>
              {title}
            </h3>
          </Link>
          
          <p className="text-[var(--text-secondary)] mb-2" style={{ fontSize: compact ? '0.875rem' : '1rem' }}>
            {authors}
          </p>
          
          {year && (
            <div className="flex items-center gap-1 mb-2">
              <Calendar className="h-3 w-3 text-[var(--text-muted)]" />
              <span className="text-sm text-[var(--text-muted)]">{year}</span>
            </div>
          )}
          
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--text-secondary)]">{rating}/5</span>
            </div>
          )}
          
          {showActions && !compact && (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                <Plus className="mr-1 h-3 w-3" />
                Add to Library
              </Button>
              <Button size="sm">
                <BookOpen className="mr-1 h-3 w-3" />
                Reading
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}