import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";


export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name || ""}`.trim(),
          email: profile.email,
          image: profile.picture,
          role: "USER",
        };
      },
    }),
   
  ],
  callbacks: {
    async authorized({ auth }) {
      return !!auth;
    },
    async signIn({ account, profile }) {
  
        if (account?.provider === "google") {
          return profile?.email_verified as boolean && profile?.email?.endsWith("@gmail.com") as boolean
        }
        return true // Do different verification for other providers that don't have `email_verified`
  
      },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      try {
        const parsedUrl = new URL(url);
        const callbackUrlParam = parsedUrl.searchParams.get("callbackUrl");
        if (callbackUrlParam) {
          const decodedCallbackUrl = decodeURIComponent(callbackUrlParam);
          if (decodedCallbackUrl.startsWith("/")) return `${baseUrl}${decodedCallbackUrl}`;
          if (new URL(decodedCallbackUrl).origin === baseUrl) return decodedCallbackUrl;
        }
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        if (new URL(url).origin === baseUrl) return url;
      } catch (error) {
        console.error("Redirect error:", error);
      }
      return baseUrl;
    },
  },
  pages: { signIn: "/login", error: "/error" },
  debug: process.env.NODE_ENV === "development",
};
