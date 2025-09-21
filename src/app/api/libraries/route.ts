// src/app/api/libraries/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') ?? undefined;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const where = { userId: user.id, ...(name ? { name } : {}) };
    const libraries = await prisma.library.findMany({
      where,
      include: { books: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(libraries);
  } catch (e) {
    console.error('[LIBRARIES.GET]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { name } = body as { name?: string };
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const lib = await prisma.library.create({
      data: { name: name.trim(), userId: user.id },
    });

    return NextResponse.json(lib, { status: 201 });
  } catch (e: any) {
    // Handle unique constraint if you try to create a duplicate library name
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Library with that name already exists' }, { status: 409 });
    }
    console.error('[LIBRARIES.POST]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
