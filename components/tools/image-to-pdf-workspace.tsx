"use client"

import React, { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { ImageIcon, CheckCircle2, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"

export function ImageToPDF() {
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

  const handleConvertToPDF = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setProgress(20)

    try {
      const pdfDoc = await PDFDocument.create()
      setProgress(40)

      let idx = 0
      for (const file of files) {
        const fileBytes = await file.arrayBuffer()
        const lowerName = file.name.toLowerCase()
        
        let embeddedImage
        if (lowerName.endsWith(".png")) {
          embeddedImage = await pdfDoc.embedPng(fileBytes)
        } else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
          embeddedImage = await pdfDoc.embedJpg(fileBytes)
        } else {
          // Fallback for WebP / other types using a canvas converter helper
          // To support webp, we load it into an image, draw to canvas, get jpeg dataURL, and embed
          const blob = new Blob([fileBytes], { type: file.type })
          const imgUrl = URL.createObjectURL(blob)
          
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const tempImg = new Image()
            tempImg.onload = () => resolve(tempImg)
            tempImg.onerror = reject
            tempImg.src = imgUrl
          })
          
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.drawImage(img, 0, 0)
          }
          
          const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.9)
          const jpegBytes = await fetch(jpegDataUrl).then(res => res.arrayBuffer())
          embeddedImage = await pdfDoc.embedJpg(jpegBytes)
          URL.revokeObjectURL(imgUrl)
        }

        // Add page matching image dimensions
        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height])
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        })

        idx++
        setProgress(40 + Math.floor((idx / files.length) * 45))
      }

      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const downloadName = "images_converted.pdf"

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("Images converted to PDF successfully!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      const totalSize = files.reduce((acc, f) => acc + f.size, 0)
      await logConversion({
        toolUsed: "Image to PDF",
        inputFileName: `${files.length} images`,
        outputFileName: downloadName,
        size: totalSize,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to compile PDF from images.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {!isSuccess ? (
        <div className="space-y-6">
          <FileUploader
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple={true}
            maxSizeMB={10}
            onFilesSelected={handleFilesSelected}
            isLoading={isProcessing}
            progress={progress}
            progressText="Embedding images into document layers..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="flex justify-end">
              <Button
                onClick={handleConvertToPDF}
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Compile PDF <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Compilation Successful!</h3>
            <p className="text-sm text-slate-500">Your images were successfully ordered into pages.</p>
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
              Convert More Images
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
