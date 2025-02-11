import { client } from "@/sanity/lib/client";
import { GET_USER_QUERY } from "@/sanity/lib/queries";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Missing credentials");
          }

          const user = await client.fetch(GET_USER_QUERY, {
            email: credentials.email,
            status: "active",
          });

          if (!user) {
            console.log("User not found");
            return null;
          }

          if (credentials.password !== user.password) {
            console.log(
              "Password mismatch",
              credentials.password,
              user.password
            );
            return null;
          }

          const returnUser = {
            id: user._id,
            name: user.name,
            email: user.email,
          };
          console.log("Authorized user:", returnUser);
          return returnUser;
        } catch (error) {
          console.error("=== Authorization error ===");
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string; // Ensure session.user has id
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
