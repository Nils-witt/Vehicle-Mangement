import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

export class AccountDeactivatedError extends CredentialsSignin {
  code = "account_deactivated";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  // Required for self-hosted deployments (e.g. Docker) since Auth.js can't
  // otherwise verify the incoming Host header is safe to trust.
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : null;
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : null;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        if (!user.isActive) throw new AccountDeactivatedError();
        if (!user.emailVerified) throw new EmailNotVerifiedError();

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Fresh sign-in: authorize() already confirmed the account is active.
        token.id = user.id;
        return token;
      }

      // Existing session: re-check on every request so a deactivated
      // account is signed out immediately, not just blocked at next login.
      if (typeof token.id === "string") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
        });
        if (!dbUser || !dbUser.isActive) return null;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ request, auth: session }) {
      if (
        ["/login", "/register"].includes(request.nextUrl.pathname) ||
        request.nextUrl.pathname.startsWith("/api/verify-email")
      ) {
        return true;
      }
      return !!session?.user;
    },
  },
});
