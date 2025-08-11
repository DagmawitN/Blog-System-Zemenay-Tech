import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

type AppUser = {
  id: string;
  email: string;
  role?: string;
};

type AppJWT = {
  id?: string;
  role?: string;
  sub?: string;
  email?: string | null;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        const appUser: AppUser = { id: user.id, email: user.email, role: user.role };
        return appUser as unknown as NextAuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as unknown as AppJWT;
      if (user) {
        const u = user as unknown as AppUser;
        t.id = u.id;
        t.role = u.role;
      }
      return t as unknown as typeof token;
    },
    async session({ session, token }) {
      const t = token as unknown as AppJWT;
      if (session.user) {
        session.user.id = (t.id as string) ?? (t.sub as string);
        if (t.role) session.user.role = t.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
