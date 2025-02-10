import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { client } from "@/sanity/lib/client";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        const { email, password } = credentials;
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email }
        );
        if (user) {
          return { id: user._id, name: user.name, email: user.email };
        }

        // if (user && bcrypt.compareSync(password, user.password)) {
        //   return { id: user._id, name: user.name, email: user.email };
        // }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          name: session.user?.name,
          email: session.user?.email,
        },
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
