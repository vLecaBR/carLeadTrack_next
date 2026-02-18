import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      storeId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    storeId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    storeId?: string | null;
  }
}