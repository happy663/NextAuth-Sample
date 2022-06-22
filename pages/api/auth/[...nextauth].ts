import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Adapters from "next-auth/adapters";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    //jwtが作成・更新された時に呼ばれる
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    //セッションがチェックされた時に呼ばれる
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
