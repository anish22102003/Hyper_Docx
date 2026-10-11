"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, Calendar, Clock, ArrowRight, Star } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  tags: string[]
  image?: string
}

// Local mock posts to ensure the blog works out-of-the-box
const MOCK_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "How to merge and optimize PDF pages client-side using WebAssembly",
    slug: "merge-pdf-webassembly",
    excerpt: "Explore the internal rendering pipelines that let browsers parse and combine complex PDF streams locally without saturating backend network pipelines.",
    content: "",
    date: "Aug 02, 2026",
    readTime: "5 min read",
    category: "PDF Tools",
    tags: ["PDF", "WebAssembly", "JavaScript"],
  },
  {
    id: "post-2",
    title: "Understanding background removal algorithms in Javascript canvas buffers",
    slug: "background-removal-canvas",
    excerpt: "A deep dive into euclidean pixel distance scanners and chroma key tolerance sweeps for automated backdrop clearing without complex GPU architectures.",
    content: "",
    date: "Jul 28, 2026",
    readTime: "7 min read",
    category: "Image Editing",
    tags: ["Image", "Canvas", "Algorithms"],
  },
  {
    id: "post-3",
    title: "SaaS document encryption benchmarks: Protect vs Unlock algorithms",
    slug: "pdf-security-benchmarks",
    excerpt: "Analyzing the performance overhead of 128-bit RC4 vs 256-bit AES encryption layers when protecting documents inside client environments.",
    content: "",
    date: "Jul 15, 2026",
    readTime: "4 min read",
    category: "Security",
    tags: ["Security", "PDF", "Encryption"],
  },
]

const CATEGORIES = ["All", "PDF Tools", "Image Editing", "Security"]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (activeCategory === "All") return true
      return post.category === activeCategory
    })
  }, [searchQuery, activeCategory])

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 space-y-12">
      {/* Blog header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight dark:text-white flex justify-center items-center gap-2">
          <BookOpen className="w-8 h-8 text-cyan-500" /> Engineering Blog
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Technical insights, security benchmarks, and updates from the HyperDocX development team.
        </p>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div className="flex overflow-x-auto gap-2 w-full md:w-auto scrollbar-none pb-2 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition border ${
                activeCategory === cat
                  ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 shadow"
                  : "bg-white border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-white/5 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-xs rounded-full"
          />
        </div>
      </div>

      {/* Articles Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-950 shadow-sm glass-card flex flex-col justify-between">
                <CardContent className="p-6 space-y-4">
                  {/* Category tag */}
                  <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-slate-400">
                    <span>{post.category}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-cyan-500 fill-cyan-500" /> Dev Note</span>
                  </div>

                  {/* Title and Excerpt */}
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 hover:text-cyan-500 dark:hover:text-cyan-400 transition cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Tags list */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {post.tags.map((t) => (
                      <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </CardContent>

                {/* Footer Metrics */}
                <div className="px-6 pb-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <div className="flex gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {post.readTime}</span>
                  </div>
                  <div className="text-cyan-500 dark:text-cyan-400 font-bold flex items-center gap-0.5 hover:underline cursor-pointer">
                    Read <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <p className="text-slate-500 dark:text-slate-400 font-semibold">No engineering notes match your criteria.</p>
          <Button variant="link" onClick={() => { setSearchQuery(""); setActiveCategory("All") }} className="text-cyan-500 font-bold">
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}
