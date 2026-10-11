"use client"

import React, { useState } from "react"
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { Stamp, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function PDFWatermark() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  const [watermarkText, setWatermarkText] = useState("HYPERDOCX WATERMARK")

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const handleWatermark = async () => {
    if (files.length === 0) return
    if (!watermarkText) {
      toast.error("Please enter the watermark text.")
      return
    }

    const file = files[0]
    setIsProcessing(true)
    setProgress(20)

    try {
      const fileBytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(fileBytes)
      const pages = pdfDoc.getPages()
      setProgress(50)

      // Embed standard font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      
      for (const page of pages) {
        const { width, height } = page.getSize()
        
        // Overlay transparent text in the center
        page.drawText(watermarkText, {
          x: width / 6,
          y: height / 3,
          size: 40,
          font: helveticaFont,
          color: rgb(0.6, 0.6, 0.6),
          opacity: 0.3,
          rotate: degrees(45),
        })
      }
      setProgress(85)

      const watermarkedBytes = await pdfDoc.save()
      const blob = new Blob([watermarkedBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const downloadName = `watermarked_${file.name}`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("PDF watermark applied!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: "Watermark PDF",
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to watermark PDF. Ensure file is not encrypted.")
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
            progressText="Embedding watermark layer..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="watermark-input" className="text-xs font-bold text-slate-500">
                  Watermark Overlay Text
                </Label>
                <Input
                  id="watermark-input"
                  type="text"
                  placeholder="e.g. DRAFT / CONFIDENTIAL"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-sm"
                />
              </div>
              <Button
                onClick={handleWatermark}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Apply Watermark
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Watermarking Complete!</h3>
            <p className="text-sm text-slate-500">Your watermark overlay was successfully embedded across all pages.</p>
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
                setOutputUrl(null);
              }}
              className="border-slate-200 dark:border-white/10 dark:text-white"
            >
              Watermark Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
