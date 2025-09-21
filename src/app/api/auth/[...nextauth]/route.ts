// src/app/api/auth/[...nextauth]/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Important: create one handler and export for both GET and POST.
// This catches ALL subpaths (/signin, /callback/*, /session, /_log, etc.)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
