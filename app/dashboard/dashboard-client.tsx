"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import {
  FileText,
  Award,
  HardDrive,
  Trash2,
  Bookmark,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { deleteConversionHistory, deleteConversionItem } from "@/actions/conversions"
import { toggleSubscriptionPlan } from "@/actions/subscription"

interface ConversionLog {
  id: string
  toolUsed: string
  inputFileName: string
  outputFileName: string
  status: string
  size: number
  createdAt: string
}

interface DashboardClientProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    role?: "USER" | "ADMIN"
    plan?: "FREE" | "PRO"
  }
  initialConversions: ConversionLog[]
  storageUsedBytes: number
}

export function DashboardClient({
  user,
  initialConversions,
  storageUsedBytes,
}: DashboardClientProps) {
  const [conversions, setConversions] = useState<ConversionLog[]>(initialConversions)
  const [currentPlan, setCurrentPlan] = useState<string>(user.plan || "FREE")
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false)
  const [isClearingHistory, setIsClearingHistory] = useState(false)

  const isPro = currentPlan === "PRO"
  const storageQuotaMB = isPro ? 100 : 10 // 100MB for Pro, 10MB for Free
  const storageUsedMB = parseFloat((storageUsedBytes / (1024 * 1024)).toFixed(2))
  const storagePercent = Math.min(100, (storageUsedMB / storageQuotaMB) * 100)

  const handleTogglePlan = async () => {
    setIsUpdatingPlan(true)
    try {
      const res = await toggleSubscriptionPlan()
      if (res?.success && res.plan) {
        setCurrentPlan(res.plan)
        toast.success(res.message)
        window.location.reload()
      } else {
        toast.error(res?.error || "Failed to update subscription.")
      }
    } catch (err) {
      toast.error("An error occurred during subscription toggle.")
    } finally {
      setIsUpdatingPlan(false)
    }
  }

  const handleClearHistory = async () => {
    if (conversions.length === 0) return
    setIsClearingHistory(true)
    try {
      const res = await deleteConversionHistory()
      if (res?.success) {
        setConversions([])
        toast.success(res.message)
      } else {
        toast.error(res?.error || "Failed to clear history.")
      }
    } catch (err) {
      toast.error("Failed to empty logs.")
    } finally {
      setIsClearingHistory(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const res = await deleteConversionItem(id)
      if (res?.success) {
        setConversions((prev) => prev.filter((c) => c.id !== id))
        toast.success("History log removed.")
      } else {
        toast.error(res?.error || "Failed to delete log.")
      }
    } catch (err) {
      toast.error("An error occurred while deleting item.")
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">
            Welcome back, {user.name || "User"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage files, track conversion stats, and edit plans.</p>
        </div>
        <Button
          onClick={handleTogglePlan}
          disabled={isUpdatingPlan}
          className={`font-bold px-6 shadow-md ${
            isPro
              ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
              : "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white"
          }`}
        >
          {isUpdatingPlan ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : isPro ? (
            "Switch to Free Plan"
          ) : (
            "Upgrade to Pro"
          )}
        </Button>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan card */}
        <Card className="border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Account Level</CardTitle>
            <Award className={`w-5 h-5 ${isPro ? "text-cyan-500" : "text-slate-400"}`} />
          </CardHeader>
          <CardContent className="space-y-1">
            <h3 className="text-2xl font-black dark:text-white flex items-center gap-2">
              {currentPlan} PLAN
              {isPro && (
                <span className="text-[10px] uppercase font-extrabold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-2 py-0.5 rounded">
                  Premium
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {isPro
                ? "You enjoy unlimited conversions and 100MB file uploads."
                : "Free user. Up to 10MB limits. Upgrade for faster speed."}
            </p>
          </CardContent>
        </Card>

        {/* Quota storage usage */}
        <Card className="border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Storage Utilized</CardTitle>
            <HardDrive className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-baseline">
              <h3 className="text-2xl font-black dark:text-white">
                {storageUsedMB} <span className="text-xs text-slate-500 font-semibold">MB</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Quota: {storageQuotaMB} MB</span>
            </div>
            <Progress value={storagePercent} className="h-1.5 bg-slate-200 dark:bg-slate-800" />
          </CardContent>
        </Card>

        {/* Files processed count */}
        <Card className="border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 backdrop-blur shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Conversions</CardTitle>
            <FileText className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent className="space-y-1">
            <h3 className="text-2xl font-black dark:text-white">
              {conversions.length} <span className="text-xs text-slate-500 font-semibold">operations</span>
            </h3>
            <p className="text-xs text-slate-500">Recorded history of successfully completed tools workflows.</p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Favorite Tools shortcuts */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Quick Access Pinned Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Merge PDF", slug: "merge-pdf", desc: "Combine PDFs instantly" },
            { name: "Image Compressor", slug: "image-compressor", desc: "Compress image file sizes" },
            { name: "Background Remover", slug: "background-remover", desc: "Strip solid backdrops transparent" },
          ].map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card className="border border-slate-200/50 dark:border-white/5 hover:border-cyan-500 bg-white/50 dark:bg-slate-900/10 shadow-sm cursor-pointer hover:shadow transition">
                <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500" /> {tool.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">{tool.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Conversion Logs Table */}
      <Card className="border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/35 backdrop-blur-xl shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div>
            <CardTitle className="text-base font-bold dark:text-white">Conversion History</CardTitle>
            <CardDescription className="text-xs">Database logs of your file operations.</CardDescription>
          </div>
          {conversions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              disabled={isClearingHistory}
              onClick={handleClearHistory}
              className="text-xs text-rose-500 hover:text-rose-500 border-slate-200 dark:border-white/5 hover:bg-rose-500/10"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear History
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {conversions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100/50 dark:bg-white/5">
                  <TableRow className="border-b border-slate-200 dark:border-white/10">
                    <TableHead className="text-xs font-bold text-slate-500">Tool</TableHead>
                    <TableHead className="text-xs font-bold text-slate-500">Input File</TableHead>
                    <TableHead className="text-xs font-bold text-slate-500">Output File</TableHead>
                    <TableHead className="text-xs font-bold text-slate-500">File Size</TableHead>
                    <TableHead className="text-xs font-bold text-slate-500">Date</TableHead>
                    <TableHead className="text-xs font-bold text-slate-500 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {conversions.map((log) => (
                      <TableRow key={log.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <TableCell className="font-bold text-xs">
                          <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 uppercase tracking-wide text-[9px]">
                            {log.toolUsed}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-xs truncate">
                          {log.inputFileName}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                          {log.outputFileName}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-500">
                          {formatFileSize(log.size)}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500 font-medium">
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(log.id)}
                            className="w-8 h-8 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto animate-bounce" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No operations logged.</p>
                <p className="text-xs text-slate-500">Perform conversions in our tools pages to see records here.</p>
              </div>
              <Button asChild size="sm" className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold">
                <Link href="/#tools">Explore Tools</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
