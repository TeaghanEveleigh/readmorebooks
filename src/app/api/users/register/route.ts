import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

const DEFAULT_LIBRARIES = ['Currently Reading','Want to Read','Finished'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email }});
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        libraries: {
          create: DEFAULT_LIBRARIES.map((name) => ({ name })),
        },
      },
      include: { libraries: true },
    });
    return NextResponse.json({ id: user.id });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
