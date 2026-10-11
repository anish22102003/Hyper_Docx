import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")

      if (isOnAdmin) {
        // Safe check for user role
        const userRole = (auth?.user as any)?.role
        if (isLoggedIn && userRole === "ADMIN") {
          return true
        }
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirects to signIn page ("/login")
      }

      // If user is logged in and tries to access login/register, redirect to dashboard
      const isOnAuthRoute = nextUrl.pathname === "/login" || nextUrl.pathname === "/register"
      if (isOnAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }

      return true
    },
  },
  providers: [], // Configuration defined in auth.ts
} satisfies NextAuthConfig
