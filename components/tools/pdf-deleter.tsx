"use client"

import React, { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { Trash2, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function PDFDeleter() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  
  const [pageCount, setPageCount] = useState(0)
  const [selectedPages, setSelectedPages] = useState<number[]>([]) // 0-indexed indices to delete

  const handleFilesSelected = async (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
    setSelectedPages([])

    if (selected.length > 0) {
      try {
        const fileBytes = await selected[0].arrayBuffer()
        const pdfDoc = await PDFDocument.load(fileBytes)
        setPageCount(pdfDoc.getPageCount())
      } catch (err) {
        toast.error("Failed to parse PDF pages. Ensure file is valid.")
      }
    }
  }

  const togglePageSelection = (index: number) => {
    setSelectedPages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleDeletePages = async () => {
    if (files.length === 0) return
    if (selectedPages.length === 0) {
      toast.error("Please select at least one page to delete.")
      return
    }
    if (selectedPages.length >= pageCount) {
      toast.error("You cannot delete all pages. Leave at least one page.")
      return
    }

    const file = files[0]
    setIsProcessing(true)
    setProgress(30)

    try {
      const fileBytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(fileBytes)
      setProgress(60)

      // Create new document containing only unselected pages
      const cleanDoc = await PDFDocument.create()
      const allIndices = Array.from({ length: pageCount }, (_, i) => i)
      const remainingIndices = allIndices.filter((idx) => !selectedPages.includes(idx))

      const copiedPages = await cleanDoc.copyPages(pdfDoc, remainingIndices)
      copiedPages.forEach((page) => cleanDoc.addPage(page))
      setProgress(85)

      const cleanBytes = await cleanDoc.save()
      const blob = new Blob([cleanBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const downloadName = `pages_deleted_${file.name}`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("Specified pages deleted successfully!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: `Delete PDF Pages (${selectedPages.length} removed)`,
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to modify PDF. Ensure the file is not secured.")
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
            progressText="Regenerating document page indexes..."
          />
          {files.length > 0 && pageCount > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500">
                  Select the pages you wish to discard
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3 pt-2">
                  {Array.from({ length: pageCount }, (_, idx) => {
                    const isSelected = selectedPages.includes(idx)
                    return (
                      <button
                        key={idx}
                        onClick={() => togglePageSelection(idx)}
                        className={`aspect-[3/4] flex flex-col items-center justify-center border-2 rounded-xl transition font-bold text-sm relative overflow-hidden ${
                          isSelected
                            ? "border-rose-500 bg-rose-500/10 text-rose-500"
                            : "border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-cyan-500"
                        }`}
                      >
                        <span>Page {idx + 1}</span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
              <Button
                onClick={handleDeletePages}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold"
              >
                Delete Selected Pages ({selectedPages.length})
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Deletion Applied!</h3>
            <p className="text-sm text-slate-500">Your PDF pages were successfully updated.</p>
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
                setSelectedPages([]);
                setPageCount(0);
                setOutputUrl(null);
              }}
              className="border-slate-200 dark:border-white/10 dark:text-white"
            >
              Modify Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
