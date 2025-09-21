import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string }}) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { googleId, title, authors, thumbnail, totalPages } = body || {};
  if (!googleId || !title) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  // verify library belongs to user
  const lib = await prisma.library.findUnique({ where: { id: params.id }, include: { user: true }});
  if (!lib) return NextResponse.json({ error: 'Library not found' }, { status: 404 });
  if (lib.user.email !== session.user.email) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const book = await prisma.bookEntry.create({
    data: {
      googleId, title,
      authors: Array.isArray(authors) ? authors.join(', ') : authors,
      thumbnail, totalPages: totalPages ?? null, libraryId: lib.id
    }
  });
  return NextResponse.json(book, { status: 201 });
}

export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { bookId, currentPage, rating, notes } = body || {};
  const book = await prisma.bookEntry.findUnique({ where: { id: bookId }, include: { library: { include: { user: true }}}});
  if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  if (book.library.user.email !== session.user.email) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const updated = await prisma.bookEntry.update({
    where: { id: bookId },
    data: { 
      currentPage: typeof currentPage === 'number' ? currentPage : book.currentPage,
      rating: typeof rating === 'number' ? rating : book.rating,
      notes: typeof notes === 'string' ? notes : book.notes
    }
  });
  return NextResponse.json(updated);
}
