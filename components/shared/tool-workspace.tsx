import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, ChevronRight } from "lucide-react"

interface ToolWorkspaceProps {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
  steps?: string[]
}

export function ToolWorkspace({
  title,
  description,
  icon,
  children,
  steps = [
    "Upload your document or image files into the upload area.",
    "Configure custom parameters (reordering, password protect, quality, resize) if needed.",
    "Click the action button to process your files securely.",
    "Download the generated results instantly once completed."
  ]
}: ToolWorkspaceProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 dark:from-cyan-500/20 dark:to-indigo-500/20 text-cyan-500 rounded-2xl shadow-sm border border-cyan-500/10">
          {icon}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Main Workspace Card */}
      <Card className="border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-6 md:p-10">{children}</CardContent>
      </Card>

      {/* Interactive Sibling Block: Instructions / Features */}
      {steps && steps.length > 0 && (
        <div className="border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 md:p-8 space-y-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            <HelpCircle className="w-5 h-5 text-cyan-500" /> How to use this tool
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 bg-white/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl">
                <div className="flex items-center justify-center w-6 h-6 bg-cyan-500/10 text-cyan-500 rounded-lg text-xs font-black shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
