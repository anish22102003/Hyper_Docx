"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { submitContactForm } from "@/actions/contact"
import { Mail, Phone, MapPin, Loader2, Send, CheckCircle2 } from "lucide-react"

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof ContactSchema>) => {
    setIsLoading(true)
    try {
      const result = await submitContactForm(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.success)
        setIsSent(true)
        reset()
      }
    } catch (error) {
      toast.error("Failed to submit inquiry. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight dark:text-white">
          Get in Touch
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Have questions about Pro plans or feature requests? Contact our engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Support channels info cards */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm dark:text-white">Email Us</h4>
                <p className="text-xs text-slate-500">support@hyperdocx.com</p>
                <p className="text-[10px] text-slate-400">Response within 24 hours</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm dark:text-white">Call Support</h4>
                <p className="text-xs text-slate-500">+1 (800) 555-DOCS</p>
                <p className="text-[10px] text-slate-400">Mon-Fri 9am - 6pm EST</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm dark:text-white">HQ Office</h4>
                <p className="text-xs text-slate-500">San Francisco, CA</p>
                <p className="text-[10px] text-slate-400">HyperDocX Technologies Inc.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact form Card */}
        <div className="md:col-span-2">
          <Card className="border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/35 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader className="p-6 md:p-8">
                      <CardTitle className="text-lg font-bold dark:text-white">Send Inquiries</CardTitle>
                      <CardDescription className="text-xs">Fill out the credentials to initiate messaging.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 pt-0 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-xs font-semibold text-slate-500">Your Name</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            {...register("name")}
                            className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-xs"
                            disabled={isLoading}
                          />
                          {errors.name && <p className="text-[10px] text-rose-500 font-bold">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-semibold text-slate-500">Email Address</Label>
                          <Input
                            id="email"
                            placeholder="john@example.com"
                            {...register("email")}
                            className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-xs"
                            disabled={isLoading}
                          />
                          {errors.email && <p className="text-[10px] text-rose-500 font-bold">{errors.email.message}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-xs font-semibold text-slate-500">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="e.g. Pro subscription pricing query"
                          {...register("subject")}
                          className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-xs"
                          disabled={isLoading}
                        />
                        {errors.subject && <p className="text-[10px] text-rose-500 font-bold">{errors.subject.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="msg" className="text-xs font-semibold text-slate-500">Message Body</Label>
                        <textarea
                          id="msg"
                          rows={5}
                          placeholder="Provide detailed description..."
                          {...register("message")}
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-lg p-3 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none focus:border-cyan-500 dark:text-white"
                          disabled={isLoading}
                        />
                        {errors.message && <p className="text-[10px] text-rose-500 font-bold">{errors.message.message}</p>}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 md:p-8 pt-0 justify-end">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" /> Send Message
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-screen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 px-6 space-y-4 flex flex-col items-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-cyan-400 animate-bounce" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold dark:text-white">Message Dispatched!</h3>
                    <p className="text-xs text-slate-500 px-6 max-w-sm">
                      Your inquiry has been stored in PostgreSQL support queue. An expert will respond shortly.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsSent(false)}
                    className="border-slate-200 dark:border-white/10 dark:text-white text-xs font-bold"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  )
}
