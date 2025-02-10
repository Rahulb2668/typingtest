import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcryptjs";

// Configure NextAuth
const authOptions = {
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

        // Fetch user by email from Sanity
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]`,
          { email: credentials.email }
        );

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Compare the hashed password using bcrypt
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
};

// Export API routes for App Router
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
export { auth as GET, auth as POST }; // Required for App Router
