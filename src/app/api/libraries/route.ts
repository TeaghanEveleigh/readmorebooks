import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || undefined;
  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const where:any = { userId: user.id };
  if (name) where.name = name;
  const libraries = await prisma.library.findMany({ where, include: { books: true }});
  return NextResponse.json(libraries);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { name } = body || {};
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email }});
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const lib = await prisma.library.create({ data: { name, userId: user.id }});
  return NextResponse.json(lib, { status: 201 });
}
