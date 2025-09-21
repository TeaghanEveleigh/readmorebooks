// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs"; // use bcryptjs in serverless

const DEFAULT_LIBRARIES = ["Currently Reading", "Want to Read", "Finished"];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        // OAuth-only users won't have a password
        if (!user || !user.password) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        return ok
          ? {
              id: user.id,
              name: user.name ?? undefined,
              email: user.email ?? undefined,
            }
          : null;
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      await Promise.all(
        DEFAULT_LIBRARIES.map((name) =>
          prisma.library.upsert({
            where: { userId_name: { userId: user.id as string, name } }, // relies on @@unique([userId, name])
            create: { userId: user.id as string, name },
            update: {}, // nothing to update; we just ensure it exists
          })
        )
      );
    },
  },
  pages: { signIn: "/auth/signin" },
};
