import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: "USER" | "ADMIN"
    plan?: "FREE" | "PRO"
  }
  interface Session {
    user: {
      id: string
      role: "USER" | "ADMIN"
      plan: "FREE" | "PRO"
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "ADMIN"
    plan?: "FREE" | "PRO"
  }
}
