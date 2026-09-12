import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { connectDb } from "./db";
import { User } from "./models/User";
import type { Role } from "@/types";

function hasGoogle() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

function hasGitHub() {
  return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET || "codecraft-studio-jwt-secret-fallback-production-2026",
  pages: { signIn: "/login", error: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@school.edu" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required.");
        }
        await connectDb();
        const user = await User.findOne({
          email: credentials.email.toLowerCase().trim(),
        }).select("+passwordHash");
        if (!user) throw new Error("No account found with this email.");
        if (!user.passwordHash) {
          throw new Error("This account uses social sign-in. Please use Google or GitHub.");
        }
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) throw new Error("Incorrect password.");
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
    ...(hasGoogle()
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    ...(hasGitHub()
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Only touches the database on first sign-in; reads token otherwise.
      if (user) {
        try {
          await connectDb();
          const provider =
            account?.provider === "google" || account?.provider === "github"
              ? account.provider
              : "credentials";

          let dbUser = await User.findOne({ email: user.email!.toLowerCase() });
          if (!dbUser) {
            dbUser = await User.create({
              name: user.name || user.email!.split("@")[0],
              email: user.email!.toLowerCase(),
              image: user.image,
              role: user.role || "student",
              provider,
              providerAccountId: account?.providerAccountId,
              // OAuth users have no local password; credentials users exist already
              // because the register route hashed one for them.
            });
          }
          token.id = dbUser._id.toString();
          token.role = (dbUser.role as Role) || "student";
        } catch (error) {
          console.error("[auth] failed to sync user", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || session.user.id;
        session.user.role = (token.role as Role) || "student";
      }
      return session;
    },
  },
};

export async function getSession() {
  return getServerSession(authOptions);
}

/** Current authenticated user, or null. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;
  return { id: session.user.id, role: session.user.role as Role, ...session.user };
}