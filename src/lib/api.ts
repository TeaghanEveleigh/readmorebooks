import { Book, SearchFilters } from "./types";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;

function buildUrl(base: string, params: Record<string, string | number | undefined>) {
  const url = new URL(base);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
}

export class BooksAPI {
  static async searchBooks(
    query: string,
    maxResults: number = 20,
    filters?: SearchFilters,
    startIndex: number = 0,
    orderBy: "relevance" | "newest" = "relevance"
  ): Promise<Book[]> {
    try {
      let q = query.trim();
      if (!q) return [];

      if (filters?.author) q += `+inauthor:${filters.author}`;
      if (filters?.subject) q += `+subject:${filters.subject}`;
      if (filters?.publisher) q += `+inpublisher:${filters.publisher}`;

      const url = buildUrl(GOOGLE_BOOKS_API, {
        q,
        maxResults: Math.min(maxResults, 40),
        startIndex,
        orderBy,
        printType: "books",
        key: API_KEY || undefined, // only include if defined
      });

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      console.error("Error searching books:", err);
      throw new Error("Failed to search books");
    }
  }

  static async getBookById(id: string): Promise<Book | null> {
    try {
      const url = buildUrl(`${GOOGLE_BOOKS_API}/${id}`, {
        key: API_KEY || undefined, // optional
      });
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error fetching book:", err);
      return null;
    }
  }

  static async getBooksByCategory(category: string, maxResults: number = 20): Promise<Book[]> {
    try {
      const url = buildUrl(GOOGLE_BOOKS_API, {
        q: `subject:${category}`,
        maxResults: Math.min(maxResults, 40),
        printType: "books",
        key: API_KEY || undefined, // optional
      });
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      console.error("Error fetching books by category:", err);
      return [];
    }
  }
}
