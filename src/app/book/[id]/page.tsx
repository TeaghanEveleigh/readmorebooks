"use client";

import { useParams } from "next/navigation";
import { useBook } from "@/hooks/use-book";
import { BookCard } from "@/components/books/book-card";
import BookInfo from "@/components/books/book-info";

export default function BookPage() {
  const params = useParams<{ id: string }>();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const { book, loading, error } = useBook(id || "");

  if (!id) return <div className="surface-card p-6">Missing book id.</div>;
  if (loading) return <div className="surface-card p-6">Loading…</div>;
//   if (error) return <div className="surface-card p-6">Failed: {(error as Error).message}</div>;
  if (!book) return <div className="surface-card p-6">Not found.</div>;

  /* If your BookCard expects `volume` (my boilerplate), use:
     <BookCard volume={book} />
     If your version expects `book`, use the next line instead. */
  return <BookInfo book={book}   />;
}
