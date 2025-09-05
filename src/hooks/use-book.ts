"use client";

import { useState, useEffect } from "react";
import { Book } from "@/lib/types";
import { BooksAPI } from "@/lib/api";

const STORAGE_KEY = "booksearch.v1";

function loadFromStorage():
  | { query: string; books: Book[] }
  | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY); // use sessionStorage so it resets per tab
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      query: typeof parsed?.query === "string" ? parsed.query : "",
      books: Array.isArray(parsed?.books) ? parsed.books : [],
    };
  } catch {
    return null;
  }
}

export function useBookSearch() {
  const initial = loadFromStorage();
  const [query, setQuery] = useState<string>(() => initial?.query ?? "");
  const [books, setBooks] = useState<Book[]>(() => initial?.books ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist whenever query/results change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ query, books }));
    } catch {}
  }, [query, books]);

  const searchBooks = async (q: string) => {
    const trimmed = q.trim();
    setQuery(trimmed);
    if (!trimmed) {
      setBooks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await BooksAPI.searchBooks(trimmed);
      setBooks(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setBooks([]);
    setError(null);
    // keep query so the input still shows what the user typed
  };

  return { query, setQuery, books, loading, error, searchBooks, clearSearch };
}

export function useBook(id: string | null) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      setError(null);

      try {
        const bookData = await BooksAPI.getBookById(id);
        setBook(bookData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch book');
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
}