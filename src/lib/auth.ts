import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { isLocked, recordFailure, reset } from "@/lib/rate-limit";

// A real bcrypt hash that no provided password will ever match. Used to keep the
// "user not found" path doing the same expensive comparison as the "wrong
// password" path, so response timing can't be used to enumerate valid emails.
const DUMMY_HASH = "$2b$10$hwxeQzGVWznIhC5b7n.4me5ACsPdADrXDE3GFXeIc8nSD0P.J2vA6";

function clientIp(request: Request | undefined): string {
  if (!request) return "unknown";
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        // Brute-force protection: lock out by both account (email) and source IP.
        // If either is currently locked, refuse without touching the database.
        const emailKey = `email:${email}`;
        const ipKey = `ip:${clientIp(request)}`;
        if (isLocked(emailKey).locked || isLocked(ipKey).locked) {
          return null;
        }

        const admin = await db.admin.findUnique({ where: { email } });

        if (!admin) {
          // Equalize timing with the real path to prevent email enumeration.
          await bcrypt.compare(password, DUMMY_HASH);
          recordFailure(emailKey);
          recordFailure(ipKey);
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
          recordFailure(emailKey);
          recordFailure(ipKey);
          return null;
        }

        // Success — clear any accumulated failure counters.
        reset(emailKey);
        reset(ipKey);
        return { id: String(admin.id), email: admin.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
