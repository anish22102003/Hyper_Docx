"use client"

import React, { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function PDFMerger() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("Please upload at least 2 PDF files to merge.")
      return
    }

    setIsProcessing(true)
    setProgress(10)

    try {
      // 1. Initialize merged document
      const mergedPdf = await PDFDocument.create()
      setProgress(30)

      // 2. Load and copy pages from each document
      let idx = 0
      for (const file of files) {
        const fileBytes = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(fileBytes)
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
        idx++
        setProgress(Math.min(30 + Math.floor((idx / files.length) * 50), 80))
      }

      // 3. Save the document bytes
      const mergedPdfBytes = await mergedPdf.save()
      setProgress(90)

      // 4. Create local download URL
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const downloadName = "merged_document.pdf"

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("PDFs merged successfully!")
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } })

      // 5. Save history to Database
      const totalSize = files.reduce((acc, f) => acc + f.size, 0)
      await logConversion({
        toolUsed: "Merge PDF",
        inputFileName: `${files.length} PDF files`,
        outputFileName: downloadName,
        size: totalSize,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("An error occurred during PDF merging. Ensure files are unencrypted.")
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
            multiple={true}
            maxSizeMB={20}
            onFilesSelected={handleFilesSelected}
            isLoading={isProcessing}
            progress={progress}
            progressText="Parsing and combining pages..."
          />
          {files.length >= 2 && !isProcessing && (
            <div className="flex justify-end">
              <Button
                onClick={handleMerge}
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Merge PDFs <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Processing Complete!</h3>
            <p className="text-sm text-slate-500">Your documents were combined successfully.</p>
          </div>
          <div className="flex gap-4">
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold px-8">
              <a href={outputUrl || "#"} download={outputName}>
                Download PDF
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccess(false);
                setFiles([]);
                setOutputUrl(null);
              }}
              className="border-slate-200 dark:border-white/10 dark:text-white"
            >
              Merge More Files
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
