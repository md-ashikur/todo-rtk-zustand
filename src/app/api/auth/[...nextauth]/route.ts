// ...existing code...
import NextAuth from "next-auth/next";
import { SessionStrategy } from "next-auth";
import type { User, Account, Profile } from "next-auth";
type UserWithId = User & { id?: string };
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import connectToDatabase from "@/lib/dbConnect"; 
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/users";
import { verifyPassword } from "@/lib/pass";
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await connectToDatabase();

          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            return null;
          }

          const passwordString = String(user.get("password"));

          if (!passwordString) {
            return null;
          }

          const passwordInput =
            typeof credentials.password === "string"
              ? credentials.password
              : "";
          const isValid = await verifyPassword(passwordInput, passwordString);

          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: UserWithId }) {
      if (user) {
        token.id = user.id;
        if ((user as UserWithId & { role?: string }).role) {
          token.role = (user as UserWithId & { role?: string }).role;
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        (session.user as UserWithId & { role?: string }).id = token.id as string;
        if (token.role) {
          (session.user as UserWithId & { role?: string }).role = token.role as string;
        }
        if (token.name) {
          (session.user as UserWithId & { role?: string }).name = token.name as string;
        }
        // Fallback: if no name, use email
        if (!(session.user as UserWithId & { role?: string }).name && token.email) {
          (session.user as UserWithId & { role?: string }).name = token.email as string;
        }
      }
      return session;
    },
    async signIn(params: {
      user: UserWithId;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }) {
      const { user, account } = params;
      if (account?.provider === "google") {
        await connectToDatabase();
        let dbUser = await UserModel.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await UserModel.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
        user.id = dbUser._id.toString();
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/",
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const authOptions = authConfig;
const handlers = NextAuth(authOptions);
export const { GET, POST } = handlers;
