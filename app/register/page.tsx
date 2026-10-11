"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Github } from "lucide-react"
import { LogoIcon } from "@/components/shared/logo"
import { registerUser } from "@/actions/auth"
import { signIn } from "next-auth/react"

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setIsLoading(true)
    try {
      const result = await registerUser(data)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success(result.success || "Account created! Redirecting to login...")
        // Automatically sign in or redirect to login
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      }
    } catch (error) {
      toast.error("An error occurred during registration.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (provider === "google") setIsGoogleLoading(true)
    if (provider === "github") setIsGithubLoading(true)

    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      toast.error(`Could not sign in with ${provider}.`)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center hero-gradient-syncro px-4 py-12 overflow-hidden">
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-sky-200/50 dark:bg-sky-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-slate-900/5 text-slate-800 dark:text-slate-100 rounded-3xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="flex justify-center mb-2">
              <Link href="/" title="HyperDocX Home" className="transition-transform hover:scale-105 active:scale-95">
                <LogoIcon size="lg" />
              </Link>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create an Account
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm">
              Start processing files instantly with HyperDocX
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <Input
                  {...register("name")}
                  type="text"
                  placeholder="John Doe"
                  className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus:border-sky-500 focus:ring-sky-500/20 text-sm"
                  disabled={isLoading || isGoogleLoading || isGithubLoading}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="name@example.com"
                  className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus:border-sky-500 focus:ring-sky-500/20 text-sm"
                  disabled={isLoading || isGoogleLoading || isGithubLoading}
                />
                {errors.email && (
                  <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus:border-sky-500 focus:ring-sky-500/20 text-sm"
                  disabled={isLoading || isGoogleLoading || isGithubLoading}
                />
                {errors.password && (
                  <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading || isGithubLoading}
                className="btn-orange w-full py-3 rounded-full font-bold text-sm shadow-md shadow-orange-500/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold">Or join with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialSignIn("google")}
                disabled={isLoading || isGoogleLoading || isGithubLoading}
                className="border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 rounded-xl font-semibold text-xs"
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialSignIn("github")}
                disabled={isLoading || isGoogleLoading || isGithubLoading}
                className="border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 hover:bg-slate-100 rounded-xl font-semibold text-xs"
              >
                {isGithubLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4 mr-2" />
                )}
                GitHub
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center pb-6">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-sky-600 hover:underline dark:text-sky-400 font-bold">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
