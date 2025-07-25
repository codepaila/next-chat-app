// providers/AuthSessionProvider.tsx 
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

async function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
export default AuthSessionProvider;