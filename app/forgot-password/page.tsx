"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, CheckCircle2 } from "lucide-react"
import { LogoIcon } from "@/components/shared/logo"

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
    setIsLoading(true)
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setIsSent(true)
      toast.success("Verification link sent! Check your inbox.")
    } catch (error) {
      toast.error("Failed to send reset link.")
    } finally {
      setIsLoading(false)
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
          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader className="space-y-2 text-center pb-6">
                  <div className="flex justify-center mb-2">
                    <Link href="/" title="HyperDocX Home" className="transition-transform hover:scale-105 active:scale-95">
                      <LogoIcon size="lg" />
                    </Link>
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Reset Password
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm">
                    We will send a password recovery link to your email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="name@example.com"
                        className="bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl focus:border-sky-500 focus:ring-sky-500/20 text-sm"
                        disabled={isLoading}
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="btn-orange w-full py-3 rounded-full font-bold text-sm shadow-md shadow-orange-500/20"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending link...
                        </>
                      ) : (
                        "Send Recovery Link"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-6"
              >
                <CardHeader className="space-y-4 pb-6">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-pulse" />
                  </div>
                  <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Check your Email
                  </CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400 px-6 text-xs sm:text-sm">
                    A recovery link has been successfully dispatched. Click the link inside the mail to reset your password.
                  </CardDescription>
                </CardHeader>
              </motion.div>
            )}
          </AnimatePresence>
          <CardFooter className="flex justify-center pb-6">
            <Link href="/login" className="text-xs font-bold text-sky-600 hover:underline dark:text-sky-400">
              Return to Sign In
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
