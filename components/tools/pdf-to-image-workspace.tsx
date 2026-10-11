"use client"

import React, { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import JSZip from "jszip"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { FileImage, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

// Set cdn worker path for browser execution
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

export function PDFToImage() {
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

  const handleConvertToImages = async () => {
    if (files.length === 0) return
    const file = files[0]
    setIsProcessing(true)
    setProgress(10)

    try {
      const arrayBuffer = await file.arrayBuffer()
      // Load document using pdfjs
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      const totalPages = pdf.numPages
      setProgress(30)

      const zip = new JSZip()
      
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        
        // Render page to standard canvas
        const viewport = page.getViewport({ scale: 2 }) // scale up for high quality
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        
        if (context) {
          canvas.height = viewport.height
          canvas.width = viewport.width
          
          await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas
          }).promise

          const dataUrl = canvas.toDataURL("image/png")
          const base64Data = dataUrl.split(",")[1]
          zip.file(`page_${pageNum}.png`, base64Data, { base64: true })
        }
        
        setProgress(30 + Math.floor((pageNum / totalPages) * 60))
      }

      const zipBlob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(zipBlob)
      const downloadName = `${file.name.replace(".pdf", "")}_images.zip`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("PDF pages converted to PNG pack!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: "PDF to Image",
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to convert PDF. Ensure file is not protected.")
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
            progressText="Converting pages to high-res canvas buffers..."
          />
          {files.length > 0 && !isProcessing && (
            <Button
              onClick={handleConvertToImages}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
            >
              Convert PDF to Images (Zip Pack)
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Conversion Succeeded!</h3>
            <p className="text-sm text-slate-500">Your PDF pages were successfully exported into standard PNGs.</p>
          </div>
          <div className="flex gap-4">
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold px-8">
              <a href={outputUrl || "#"} download={outputName}>
                Download Images Zip
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
              Convert Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
