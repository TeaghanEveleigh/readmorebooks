'use client';

import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchFilters } from '@/lib/types';

interface BookSearchProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  onClear: () => void;
  loading?: boolean;
}

export function BookSearch({ onSearch, onClear, loading = false }: BookSearchProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), filters);
    }
  };

  const handleClear = () => {
    setQuery('');
    setFilters({});
    onClear();
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books, authors, or topics..."
            className="pl-10 pr-20"
            disabled={loading}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-[var(--accent)] text-white' : ''}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {showFilters && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
          <h3 className="mb-3 font-medium">Advanced Filters</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Author"
              value={filters.author || ''}
              onChange={(e) => updateFilter('author', e.target.value)}
            />
            <Input
              placeholder="Subject"
              value={filters.subject || ''}
              onChange={(e) => updateFilter('subject', e.target.value)}
            />
            <Input
              placeholder="Publisher"
              value={filters.publisher || ''}
              onChange={(e) => updateFilter('publisher', e.target.value)}
            />
            <Input
              placeholder="Year (e.g., 2023)"
              value={filters.publishedDate || ''}
              onChange={(e) => updateFilter('publishedDate', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}