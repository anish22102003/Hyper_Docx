"use client"

import React, { useState } from "react"
import { PDFDocument } from "pdf-lib"
import JSZip from "jszip"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { Scissors, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function PDFSplitter() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  const [rangeInput, setRangeInput] = useState("1-2")

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const parseRanges = (rangeStr: string, totalPages: number): number[] => {
    const indices = new Set<number>()
    const parts = rangeStr.split(",")
    for (const part of parts) {
      const cleanPart = part.trim()
      if (cleanPart.includes("-")) {
        const [startStr, endStr] = cleanPart.split("-")
        const start = Math.max(1, parseInt(startStr, 10))
        const end = Math.min(totalPages, parseInt(endStr, 10))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            indices.add(i - 1)
          }
        }
      } else {
        const val = parseInt(cleanPart, 10)
        if (!isNaN(val) && val >= 1 && val <= totalPages) {
          indices.add(val - 1)
        }
      }
    }
    return Array.from(indices).sort((a, b) => a - b)
  }

  const handleSplitRange = async () => {
    if (files.length === 0) return
    const file = files[0]
    setIsProcessing(true)
    setProgress(15)

    try {
      const fileBytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(fileBytes)
      const totalPages = pdfDoc.getPageCount()
      setProgress(40)

      const targetIndices = parseRanges(rangeInput, totalPages)
      if (targetIndices.length === 0) {
        toast.error(`Please provide a valid range (e.g. 1-${totalPages}).`)
        setIsProcessing(false)
        return
      }

      const splitDoc = await PDFDocument.create()
      const copiedPages = await splitDoc.copyPages(pdfDoc, targetIndices)
      copiedPages.forEach((page) => splitDoc.addPage(page))
      setProgress(75)

      const splitBytes = await splitDoc.save()
      const blob = new Blob([splitBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const downloadName = `split_${file.name}`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("PDF split range extracted!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: "Split PDF",
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to split PDF. Ensure the file is not secured.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSplitAll = async () => {
    if (files.length === 0) return
    const file = files[0]
    setIsProcessing(true)
    setProgress(10)

    try {
      const fileBytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(fileBytes)
      const totalPages = pdfDoc.getPageCount()
      setProgress(25)

      const zip = new JSZip()
      for (let i = 0; i < totalPages; i++) {
        const pageDoc = await PDFDocument.create()
        const [copiedPage] = await pageDoc.copyPages(pdfDoc, [i])
        pageDoc.addPage(copiedPage)
        const pageBytes = await pageDoc.save()
        zip.file(`page_${i + 1}.pdf`, pageBytes)

        setProgress(25 + Math.floor((i / totalPages) * 50))
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(zipBlob)
      const downloadName = `${file.name.replace(".pdf", "")}_split_pages.zip`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("All PDF pages split and zipped!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: "Split PDF (All Pages)",
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to split PDF. Ensure file is valid.")
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
            progressText="Parsing pages and exporting range..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <Tabs defaultValue="range" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-200/50 dark:bg-white/5 rounded-xl">
                  <TabsTrigger value="range" className="font-semibold">Extract Pages Range</TabsTrigger>
                  <TabsTrigger value="all" className="font-semibold">Split All Pages</TabsTrigger>
                </TabsList>
                <TabsContent value="range" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="range" className="text-xs font-bold text-slate-500">
                      Enter page numbers or ranges (e.g. 1-3, 5)
                    </Label>
                    <Input
                      id="range"
                      value={rangeInput}
                      onChange={(e) => setRangeInput(e.target.value)}
                      placeholder="e.g. 1-3, 5"
                      className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10"
                    />
                  </div>
                  <Button
                    onClick={handleSplitRange}
                    className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
                  >
                    Extract Range
                  </Button>
                </TabsContent>
                <TabsContent value="all" className="space-y-4 pt-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    This will split every single page of the document into separate PDF files and bundle them into a single downloadable .zip archive.
                  </p>
                  <Button
                    onClick={handleSplitAll}
                    className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
                  >
                    Split Every Page (Zip)
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Splitting Completed!</h3>
            <p className="text-sm text-slate-500">Your PDF pages were successfully parsed and separated.</p>
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
              Split Another Document
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
