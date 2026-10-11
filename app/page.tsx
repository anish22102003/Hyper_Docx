"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Search,
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Star,
  Users,
  Files,
  TrendingUp,
  HelpCircle,
  Merge,
  Scissors,
  Trash2,
  Move,
  RotateCw,
  FileImage,
  Image as ImageIcon,
  FileCode,
  FileSpreadsheet,
  Table,
  Presentation,
  Tv,
  FileDown,
  Lock,
  Unlock,
  Stamp,
  Camera,
  RefreshCw,
  Sparkles,
  Minimize2,
  Maximize2,
  Crop,
  Undo,
  GitCompare,
  Eraser,
  CheckCircle2,
  Layers,
  HardDrive,
  LockKeyhole,
  PlayCircle,
  Eye,
  Sliders,
  Check,
} from "lucide-react"
import { TOOLS_DATA, CATEGORIES, ToolItem } from "@/lib/tools-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Map string icon identifier to Lucide component
const IconMapper: Record<string, React.ComponentType<{ className?: string }>> = {
  Merge,
  Split: Scissors,
  Trash2,
  Move,
  RotateCw,
  FileImage,
  Image: ImageIcon,
  FileCode,
  FileSpreadsheet,
  Sheet: FileSpreadsheet,
  Table2: Table,
  Presentation,
  Tv,
  FileDown,
  Lock,
  Unlock,
  Stamp,
  Camera,
  RefreshCw,
  Sparkles,
  Bookmark: FileImage,
  Scissors,
  Minimize2,
  Maximize2,
  Crop,
  Undo,
  GitCompare,
  Eraser,
}

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("popular")
  const [demoSlider, setDemoSlider] = useState(72)

  // Filter tools based on query and selected category
  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (activeCategory === "popular") {
        return !!tool.popular
      }
      return tool.category === activeCategory
    })
  }, [searchQuery, activeCategory])

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden text-slate-800 dark:text-slate-100">
      
      {/* 1. Hero Section - Styled after Photo 1 (Syncro) */}
      <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 hero-gradient-syncro overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-sky-200/40 dark:bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-7">
          
          {/* Centered pill badge (from Photo 1) */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-900/80 text-sky-800 dark:text-sky-300 border border-sky-200/90 dark:border-sky-500/20 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>V2.0 IS NOW LIVE: 100% PRIVATE IN-BROWSER WASM ENGINE</span>
            </div>
          </motion.div>

          {/* Hero Headline (Photo 1 typography & emphasis) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Productivity <span className="text-sky-500 dark:text-sky-400">reimagined</span> <br />
            for the modern era.
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-normal"
          >
            HyperDocX brings your files together in a unified workspace. Merge, compress, convert, and protect documents with zero server uploads—fast, secure, and private.
          </motion.p>

          {/* Dual Action Buttons (Photo 1: Warm Orange CTA + Clean White/Blue Button) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
          >
            <Link
              href="/register"
              className="btn-orange px-8 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              Start Your Free Trial
            </Link>
            <a
              href="#interactive-demo"
              className="bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-white/10 px-7 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-sm transition-all hover:border-sky-300 hover:text-sky-600 flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-sky-500" />
              Watch Demo
            </a>
          </motion.div>

          {/* Hero Application Interface Container & Floating Micro-cards (Photo 1) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative max-w-4xl mx-auto pt-10"
            id="interactive-demo"
          >
            {/* Main Interface Window */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden backdrop-blur-xl">
              {/* Window Header */}
              <div className="px-5 py-3.5 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-1 rounded-full border border-slate-200/60 dark:border-white/5 shadow-xs">
                  HyperDocX Interface • Client-Side Buffer
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>Ready</span>
                </div>
              </div>

              {/* Window Interactive Body */}
              <div className="p-6 sm:p-8 space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                      <FileDown className="w-5 h-5 text-sky-500" />
                      Live PDF Compression Preview
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Adjust the slider below to simulate real-time client-side optimization.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-full border border-emerald-200/80">
                      -{demoSlider}% file size
                    </span>
                    <span className="text-xs font-bold px-3 py-1 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 rounded-full border border-sky-200/80">
                      0ms upload latency
                    </span>
                  </div>
                </div>

                {/* Simulated file visual cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Annual_Report.pdf</p>
                        <p className="text-[11px] text-slate-400">14.8 MB • 32 pages</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Compression Engine</p>
                        <p className="text-[11px] text-slate-400">Target Quality: {100 - demoSlider}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Optimized Result</p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          {(14.8 * (1 - demoSlider / 100)).toFixed(1)} MB (Ready)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slider control */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Low Compression (Highest Quality)</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">{demoSlider}% Max Savings</span>
                    <span>Extreme Compression</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={demoSlider}
                    onChange={(e) => setDemoSlider(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Floating pill card bottom-left (Photo 1: Avatars + "+12 online") */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-white/10 rounded-full px-4 py-2.5 shadow-xl shadow-slate-900/5 flex items-center gap-3 backdrop-blur-md z-20"
            >
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full bg-sky-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  AK
                </span>
                <span className="w-7 h-7 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  MR
                </span>
                <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  SJ
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>+14.2k active now</span>
              </div>
            </motion.div>

            {/* Floating card bottom-right (Photo 1: Checkmark + "Task Completed Quarterly Sync UI") */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-6 -right-4 sm:-right-8 bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-white/10 rounded-2xl px-4 py-2.5 shadow-xl shadow-slate-900/5 flex items-center gap-3 backdrop-blur-md z-20 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Task Completed</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">PDF Merged in 0.38s</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 2. Sponsors / Social Proof Logo Bar (Styled after Photo 2 "Our sponsors") */}
      <section className="py-12 border-y border-slate-200/60 dark:border-white/5 bg-white/60 dark:bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Trusted by creators & organizations across modern teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 dark:text-slate-500 font-bold text-base sm:text-lg">
            <span className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Microsoft
            </span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Slack
            </span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Google
            </span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-500" /> Notion
            </span>
            <span className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Figma
            </span>
          </div>
        </div>
      </section>

      {/* 3. Alternating Feature Section 1 (Photo 2 "Project Management" demo style) */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/80">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Document Control</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Organize, Merge & Edit <br />
              with Surgical Precision.
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Rearrange pages visually, delete unwanted sections, or combine multiple PDF files in seconds. Every tool is built with a responsive canvas interface that gives you total visibility over page sequences before generating final output.
            </p>

            <ul className="space-y-3.5 pt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Visual drag-and-drop page reordering and thumbnail inspection</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Lossless splitting by custom page ranges, zip export support</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>Diagonal copyright watermarks and 256-bit password locks</span>
              </li>
            </ul>

            <div className="pt-4">
              <a
                href="#tools"
                onClick={() => setActiveCategory("organize")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all hover:gap-3"
              >
                <span>Try PDF Organizers</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Visual Card Column */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl shadow-slate-900/5 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Document Page Manager</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                  3 Pages Selected
                </span>
              </div>

              {/* Visual Document Pages Thumbnail Representation */}
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-[3/4] rounded-lg border-2 border-sky-400 bg-sky-50/50 dark:bg-sky-950/20 p-2 flex flex-col justify-between shadow-xs">
                  <div className="flex justify-between items-center text-[10px] text-sky-700 dark:text-sky-300 font-bold">
                    <span>Page 1</span>
                    <RotateCw className="w-3 h-3 cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 bg-sky-300/80 rounded-full w-4/5" />
                    <div className="h-1.5 bg-sky-200/80 rounded-full w-full" />
                    <div className="h-1.5 bg-sky-200/80 rounded-full w-2/3" />
                  </div>
                  <span className="text-[9px] text-center font-bold text-sky-600">Cover.pdf</span>
                </div>

                <div className="aspect-[3/4] rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 p-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <span>Page 2</span>
                    <RotateCw className="w-3 h-3 cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 bg-slate-300 rounded-full w-full" />
                    <div className="h-1.5 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-1.5 bg-slate-200 rounded-full w-4/5" />
                  </div>
                  <span className="text-[9px] text-center font-bold text-slate-400">Chapter_1.pdf</span>
                </div>

                <div className="aspect-[3/4] rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/40 p-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <span>Page 3</span>
                    <RotateCw className="w-3 h-3 cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 bg-slate-300 rounded-full w-2/3" />
                    <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                    <div className="h-1.5 bg-slate-200 rounded-full w-1/2" />
                  </div>
                  <span className="text-[9px] text-center font-bold text-slate-400">Summary.pdf</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <Move className="w-4 h-4 text-sky-500" />
                  <span>Drag thumbnails to reorder anytime</span>
                </div>
                <span className="font-bold text-sky-600">Active</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Alternating Feature Section 2 (Photo 2 "Work together / Network" demo style) */}
      <section className="py-24 bg-white/70 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Visual Network / Hub Graphic (Photo 2 network diagram) */}
            <div className="order-2 lg:order-1 relative flex items-center justify-center p-6">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Orbital rings */}
                <div className="absolute inset-0 rounded-full border border-sky-200/80 dark:border-sky-500/20 animate-spin" style={{ animationDuration: "35s" }} />
                <div className="absolute inset-8 rounded-full border border-dashed border-sky-300/60 dark:border-sky-500/10 animate-spin" style={{ animationDuration: "25s", animationDirection: "reverse" }} />
                
                {/* Central Local Device Core */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 text-white flex flex-col items-center justify-center shadow-xl shadow-sky-500/30 z-10 p-2 text-center">
                  <HardDrive className="w-7 h-7 mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Local Device</span>
                  <span className="text-[8px] opacity-80">100% Private</span>
                </div>

                {/* Satellite format nodes */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-rose-500 shadow-md">
                  PDF
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-blue-500 shadow-md">
                  DOCX
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-emerald-500 shadow-md">
                  XLSX
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-amber-500 shadow-md">
                  WEBP
                </div>
              </div>
            </div>

            {/* Right Text Column */}
            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80">
                <LockKeyhole className="w-3.5 h-3.5" />
                <span>Zero Server Uploads</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Work with Total Privacy. <br />
                Your Files Never Leave Your Browser.
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Traditional SaaS converters send confidential invoices, tax forms, and IDs to foreign servers. HyperDocX executes operations locally via WebAssembly buffers, eliminating data leak risks entirely.
              </p>

              <ul className="space-y-3.5 pt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>100% compliant with strict enterprise data protection policies</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Instant offline execution once the tool application loads</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Zero server upload queue times regardless of file congestion</span>
                </li>
              </ul>

              <div className="pt-4">
                <a
                  href="#tools"
                  onClick={() => setActiveCategory("convert")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all hover:gap-3"
                >
                  <span>Explore All Converters</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Interactive Tools Directory & Search */}
      <section id="tools" className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore 28+ Professional Tools
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every utility you need to manipulate documents and media files in one click.
          </p>

          {/* Search Box */}
          <div className="pt-3 max-w-lg mx-auto">
            <div className="relative rounded-full p-1 bg-white dark:bg-slate-900 shadow-md border border-slate-200/80 dark:border-white/10 flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search tools... (e.g. Merge PDF, Compress, JPG to PNG)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2 border-0 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 rounded-full focus-visible:ring-0 focus:outline-none w-full text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-3 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none justify-start md:justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:border-sky-300 hover:text-sky-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => {
              const Icon = IconMapper[tool.icon] || FileText
              return (
                <motion.div
                  layout
                  key={tool.slug}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/tools/${tool.slug}`} className="block h-full">
                    <div className="card-soft h-full rounded-2xl p-6 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800/30">
                            <Icon className="w-5 h-5" />
                          </div>
                          {tool.popular && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                              Popular
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="pt-2 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400 group/link">
                        Open Tool <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/link:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <p className="text-slate-500 dark:text-slate-400 font-medium">No tools found matching your query.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("popular")
              }}
              className="rounded-full text-xs font-bold text-sky-600 border-sky-200"
            >
              Reset Search Filter
            </Button>
          </div>
        )}
      </section>

      {/* 6. High-Impact Performance Metrics Bar */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-8 shadow-sm text-center">
          <div className="space-y-1">
            <div className="flex justify-center text-sky-500 mb-1"><Files className="w-5 h-5" /></div>
            <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white">2.8M+</h4>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents Processed</p>
          </div>
          <div className="space-y-1 border-l border-slate-100 dark:border-white/5">
            <div className="flex justify-center text-sky-500 mb-1"><Users className="w-5 h-5" /></div>
            <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white">85,000+</h4>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Users</p>
          </div>
          <div className="space-y-1 border-l border-slate-100 dark:border-white/5">
            <div className="flex justify-center text-sky-500 mb-1"><Zap className="w-5 h-5" /></div>
            <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white">0.0s</h4>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Server Upload Latency</p>
          </div>
          <div className="space-y-1 border-l border-slate-100 dark:border-white/5">
            <div className="flex justify-center text-sky-500 mb-1"><Star className="w-5 h-5 fill-amber-400 text-amber-400" /></div>
            <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white">4.95/5</h4>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">User Rating</p>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section (Directly inspired by Photo 2 "Choose Your Plan") */}
      <section id="pricing" className="py-24 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Choose Your Plan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Start processing for free right in your browser, or upgrade to unlock unrestricted file sizes and batch pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
            {/* Free Starter Plan */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between shadow-sm relative">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal</span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Free Starter</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Perfect for quick, one-off file conversions and basic document organizing.
                </p>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white pt-2">
                  $0 <span className="text-sm font-semibold text-slate-400">/ forever</span>
                </div>
                
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-medium pt-4 border-t border-slate-100 dark:border-white/5">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Up to 15MB file size limit
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Full access to 28+ browser tools
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" /> 100% Client-side privacy
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" /> Unlimited standard downloads
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="w-full mt-8 py-3 rounded-full text-center text-xs font-bold border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Membership - Highlighted with Syncro/Whitespace deep styling */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative border border-sky-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 bg-sky-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-xs">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Organization</span>
                <h3 className="text-2xl font-extrabold text-white">Pro Membership</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Maximum capacity and multi-file batch processing for heavy document workflows.
                </p>
                <div className="text-4xl font-extrabold text-white pt-2">
                  $9 <span className="text-sm font-semibold text-slate-400">/ month</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-200 font-medium pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0" /> Up to 150MB file size limits
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0" /> High-speed multi-threaded WebAssembly
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0" /> Batch document conversions
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0" /> AI background remover & OCR tools
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-sky-400 shrink-0" /> Priority 24/7 dedicated support
                  </li>
                </ul>
              </div>

              <Link
                href="/register"
                className="btn-orange w-full mt-8 py-3 rounded-full text-center text-xs font-bold shadow-md shadow-orange-500/25 transition-all"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section (Styled after Photo 2 "What Our Clients Says") */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
            Trusted by individual creators, legal advisors, and digital agencies worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/5 rounded-2xl p-7 space-y-5 shadow-sm">
            <div className="flex gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal italic">
              "HyperDocX has completely replaced bulky desktop editors for our legal team. The fact that sensitive client contracts never touch a remote server provides peace of mind that no other platform could deliver."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
              <div className="w-9 h-9 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-xs">
                SM
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sarah Mercer</h4>
                <p className="text-[11px] text-slate-400">Senior Legal Consultant</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/5 rounded-2xl p-7 space-y-5 shadow-sm">
            <div className="flex gap-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal italic">
              "Converting batches of screenshots to WebP and combining mockups into formatted client presentations now takes seconds instead of minutes. The browser performance is staggering."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
              <div className="w-9 h-9 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                DK
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">David Kim</h4>
                <p className="text-[11px] text-slate-400">Lead Product Designer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQs Section */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
              <HelpCircle className="w-7 h-7 text-sky-500" /> Frequently Asked Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Answers to common queries about privacy, file limitations, and subscriptions.
            </p>
          </div>

          <Accordion className="w-full space-y-3.5">
            <AccordionItem value="item-1" className="border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 rounded-2xl px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:no-underline">
                Are my documents ever uploaded to remote servers?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No. All primary manipulation tools (Merge, Split, Rotate, Compress, Format Converters) operate in-memory on your machine using client WebAssembly. Your files stay strictly on your device.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 rounded-2xl px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:no-underline">
                Can I process files without an internet connection?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Yes. Once HyperDocX loads in your browser cache, the WebAssembly binaries can continue executing file conversions even when you are working offline.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-slate-200/80 dark:border-white/5 bg-white dark:bg-slate-900 rounded-2xl px-5 py-1">
              <AccordionTrigger className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:no-underline">
                How does the Pro trial and cancellation work?
              </AccordionTrigger>
              <AccordionContent className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                You can try Pro features risk-free and cancel anytime directly in your customer dashboard with one click via our secure billing portal.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* 10. Call to Action Banner (Vibrant Syncro/Whitespace aesthetic) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Sky blue ambient glow in background */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Ready to Supercharge Your Document Workflow?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of professionals streamlining document operations with speed, privacy, and zero installation required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <Link
              href="/register"
              className="btn-orange px-8 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-xl shadow-orange-500/30 transition-all hover:scale-[1.02]"
            >
              Get Started Free Today
            </Link>
            <a
              href="#tools"
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-7 py-3.5 rounded-full text-sm sm:text-base font-bold transition-all"
            >
              Browse All Tools
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
