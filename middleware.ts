import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export default NextAuth(authConfig).auth

export const config = {
  // Protect all dashboard, admin, and profile routes, but skip public assets and APIs
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
