import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions, Session } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }

      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        token,
        user,
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },
};

export default NextAuth(authOptions);
