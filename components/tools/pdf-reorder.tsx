"use client"

import React, { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { Move, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import confetti from "canvas-confetti"

export function PDFReorder() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")

  const [pageCount, setPageCount] = useState(0)
  const [pageOrder, setPageOrder] = useState<number[]>([]) // array of page indices (0-indexed)

  const handleFilesSelected = async (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)

    if (selected.length > 0) {
      try {
        const fileBytes = await selected[0].arrayBuffer()
        const pdfDoc = await PDFDocument.load(fileBytes)
        const count = pdfDoc.getPageCount()
        setPageCount(count)
        setPageOrder(Array.from({ length: count }, (_, i) => i))
      } catch (err) {
        toast.error("Failed to parse PDF pages.")
      }
    }
  }

  const movePage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= pageCount) return

    const newOrder = [...pageOrder]
    // Swap items
    const temp = newOrder[index]
    newOrder[index] = newOrder[targetIndex]
    newOrder[targetIndex] = temp

    setPageOrder(newOrder)
  }

  const handleReorder = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setProgress(30)

    const file = files[0]
    try {
      const fileBytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(fileBytes)
      setProgress(60)

      const orderedDoc = await PDFDocument.create()
      const copiedPages = await orderedDoc.copyPages(pdfDoc, pageOrder)
      copiedPages.forEach((page) => orderedDoc.addPage(page))
      setProgress(85)

      const orderedBytes = await orderedDoc.save()
      const blob = new Blob([orderedBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const downloadName = `reordered_${file.name}`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("PDF pages reordered successfully!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: "Reorder PDF Pages",
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to reorder PDF pages. Check file constraints.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {!isSuccess ? (
        <div className="space-y-6">
          <FileUploader
            accept="application/pdf"
            multiple={false}
            maxSizeMB={20}
            onFilesSelected={handleFilesSelected}
            isLoading={isProcessing}
            progress={progress}
            progressText="Copying pages in new order..."
          />
          {files.length > 0 && pageCount > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500">
                  Arrange pages by clicking the directional arrows on each card
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-2">
                  {pageOrder.map((pageIdx, displayIdx) => (
                    <div
                      key={pageIdx}
                      className="aspect-[3/4] flex flex-col items-center justify-between p-3 border-2 border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 rounded-xl relative group shadow-sm hover:border-cyan-500 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-slate-400">Position {displayIdx + 1}</span>
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Page {pageIdx + 1}</span>
                      
                      {/* Nav Controls */}
                      <div className="flex gap-1.5 w-full pt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={displayIdx === 0}
                          onClick={() => movePage(displayIdx, "left")}
                          className="h-7 w-full border-slate-200 dark:border-white/5"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={displayIdx === pageCount - 1}
                          onClick={() => movePage(displayIdx, "right")}
                          className="h-7 w-full border-slate-200 dark:border-white/5"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleReorder}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Apply Reordering
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Reorder Completed!</h3>
            <p className="text-sm text-slate-500">Your page layout was rearranged successfully.</p>
          </div>
          <div className="flex gap-4">
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold px-8">
              <a href={outputUrl || "#"} download={outputName}>
                Download Result
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccess(false);
                setFiles([]);
                setPageOrder([]);
                setPageCount(0);
                setOutputUrl(null);
              }}
              className="border-slate-200 dark:border-white/10 dark:text-white"
            >
              Reorder Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
