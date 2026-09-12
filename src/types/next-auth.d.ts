import "next-auth";
import "next-auth/jwt";
import type { Role } from "@/types";

declare module "next-auth" {
  interface User {
    id: string;
    role?: Role;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}