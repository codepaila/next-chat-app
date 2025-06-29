import "next-auth";

declare module "next-auth" {
  interface User { id: string; role: "ADMIN" | "USER";  }
  interface Session {
    user: { id: string; name?: string; email?: string; image?: string; role: "ADMIN" | "USER"; };
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser { role: "ADMIN" | "USER"; }
}