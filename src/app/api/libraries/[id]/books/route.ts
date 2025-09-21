// src/app/api/libraries/[id]/books/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { googleId, title, authors, thumbnail, totalPages } = body as {
    googleId?: string;
    title?: string;
    authors?: string | string[];
    thumbnail?: string;
    totalPages?: number | null;
  };

  if (!googleId || !title) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Verify the library belongs to the signed-in user
  const lib = await prisma.library.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  if (!lib) return NextResponse.json({ error: 'Library not found' }, { status: 404 });
  if (lib.user.email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const book = await prisma.bookEntry.create({
    data: {
      googleId,
      title,
      authors: Array.isArray(authors) ? authors.join(', ') : authors ?? null,
      thumbnail: thumbnail ?? null,
      totalPages: typeof totalPages === 'number' ? totalPages : null,
      libraryId: lib.id,
    },
  });

  return NextResponse.json(book, { status: 201 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { bookId, currentPage, rating, notes } = body as {
    bookId?: string;
    currentPage?: number;
    rating?: number;
    notes?: string;
  };

  if (!bookId) {
    return NextResponse.json({ error: 'bookId required' }, { status: 400 });
  }

  // Ensure the book belongs to a library owned by the user
  const book = await prisma.bookEntry.findUnique({
    where: { id: bookId },
    include: { library: { include: { user: true } } },
  });
  if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  if (book.library.user.email !== session.user.email) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await prisma.bookEntry.update({
    where: { id: bookId },
    data: {
      currentPage:
        typeof currentPage === 'number' ? currentPage : book.currentPage,
      rating: typeof rating === 'number' ? rating : book.rating,
      notes: typeof notes === 'string' ? notes : book.notes,
    },
  });

  return NextResponse.json(updated);
}
