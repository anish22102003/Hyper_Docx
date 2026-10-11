"use client"

import React, { useState } from "react"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function ImageToSVGWorkspace() {
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

  const handleTraceToSVG = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setProgress(20)

    const file = files[0]
    try {
      const fileBytes = await file.arrayBuffer()
      const blob = new Blob([fileBytes], { type: file.type })
      const imgUrl = URL.createObjectURL(blob)
      setProgress(50)

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const tempImg = new Image()
        tempImg.onload = () => resolve(tempImg)
        tempImg.onerror = reject
        tempImg.src = imgUrl
      })
      setProgress(70)

      const canvas = document.createElement("canvas")
      // Downsample large images to keep SVG XML weight reasonable
      const maxDim = 250
      let w = img.width
      let h = img.height
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w)
          w = maxDim
        } else {
          w = Math.round((w * maxDim) / h)
          h = maxDim
        }
      }

      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h)
        const imgData = ctx.getImageData(0, 0, w, h)
        const data = imgData.data
        setProgress(85)

        // Generate vector shapes representing pixels
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">`
        const step = 2 // block sizing
        
        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            const idx = (y * w + x) * 4
            const r = data[idx]
            const g = data[idx + 1]
            const b = data[idx + 2]
            const a = data[idx + 3]

            if (a > 30) {
              const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
              svgContent += `<rect x="${x}" y="${y}" width="${step}" height="${step}" fill="${hex}" opacity="${(a / 255).toFixed(2)}" />`
            }
          }
        }
        svgContent += "</svg>"

        const svgBlob = new Blob([svgContent], { type: "image/svg+xml" })
        const url = URL.createObjectURL(svgBlob)
        const downloadName = `${file.name.substring(0, file.name.lastIndexOf("."))}.svg`

        setOutputUrl(url)
        setOutputName(downloadName)
        setProgress(100)
        setIsSuccess(true)
        toast.success("Image traced to SVG vector successfully!")
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

        await logConversion({
          toolUsed: "Image to SVG",
          inputFileName: file.name,
          outputFileName: downloadName,
          size: file.size,
          status: "SUCCESS",
        })
      }
      URL.revokeObjectURL(imgUrl)
    } catch (error) {
      console.error(error)
      toast.error("Failed to vectorize image.")
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
            multiple={false}
            maxSizeMB={5}
            onFilesSelected={handleFilesSelected}
            isLoading={isProcessing}
            progress={progress}
            progressText="Tracing vector contours..."
          />
          {files.length > 0 && !isProcessing && (
            <Button
              onClick={handleTraceToSVG}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
            >
              Trace Vector Outlines (SVG)
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Tracing Succeeded!</h3>
            <p className="text-sm text-slate-500">Your image has been vectorized.</p>
          </div>

          <div className="w-40 h-40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow bg-white dark:bg-slate-900 flex items-center justify-center p-2">
            <img src={outputUrl || ""} alt="SVG Vector preview" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>

          <div className="flex gap-4">
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold px-8">
              <a href={outputUrl || "#"} download={outputName}>
                Download SVG
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
              Trace Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
