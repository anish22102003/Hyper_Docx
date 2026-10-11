"use client"

import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LayoutDashboard, LogOut, ShieldAlert, Award } from "lucide-react"
import { Logo } from "@/components/shared/logo"

interface NavbarProps {
  session: Session | null
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname()
  const user = session?.user
  const isAdmin = (user as any)?.role === "ADMIN"
  const isPro = (user as any)?.plan === "PRO"

  return (
    <header className="sticky top-0 z-50 w-full pt-3.5 pb-2 px-4 sm:px-6 pointer-events-none">
      <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-2.5 flex items-center justify-between border border-slate-200/80 dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(15,23,42,0.08)] pointer-events-auto transition-all">
        {/* Logo */}
        <Logo size="md" href="/" />

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7">
          <Link
            href="/#tools"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            All Tools
          </Link>
          <Link
            href="/#features"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center focus:outline-none transition-transform hover:scale-105">
                    <Avatar className="w-8 h-8 ring-2 ring-sky-500/30">
                      <AvatarImage src={user.image || ""} alt={user.name || ""} />
                      <AvatarFallback className="bg-sky-500 text-white text-xs font-bold">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : "US"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-56 border-slate-200/80 dark:border-white/10 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {user.name}
                      {isPro && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          <Award className="w-3 h-3" /> PRO
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5" />
                <DropdownMenuItem
                  className="hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  render={
                    <Link href="/dashboard" className="flex w-full items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-slate-400" />
                      Dashboard
                    </Link>
                  }
                />
                {isAdmin && (
                  <DropdownMenuItem
                    className="hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer text-rose-500 dark:text-rose-400"
                    render={
                      <Link href="/admin" className="flex w-full items-center">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    }
                  />
                )}
                <DropdownMenuSeparator className="bg-slate-100 dark:bg-white/5" />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer text-rose-500 dark:text-rose-400 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-500/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex text-slate-700 dark:text-slate-200 hover:text-sky-600 font-semibold px-3 text-sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Link
                href="/register"
                className="btn-orange text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 rounded-full inline-flex items-center justify-center shadow-md shadow-orange-500/25 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
