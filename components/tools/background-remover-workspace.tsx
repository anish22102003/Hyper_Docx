"use client"

import React, { useState } from "react"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { Eraser, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function BackgroundRemoverWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  const [threshold, setThreshold] = useState(40) // Tolerance margin (10 to 100)

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const handleRemoveBackground = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setProgress(25)

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
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imgData.data
        
        // Target color (top-left pixel is assumed to be background color)
        const targetR = data[0]
        const targetG = data[1]
        const targetB = data[2]

        // Loop through all pixels in chunks of 4 (r, g, b, a)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Euclidean distance between pixel color and boundary color
          const distance = Math.sqrt(
            Math.pow(r - targetR, 2) +
            Math.pow(g - targetG, 2) +
            Math.pow(b - targetB, 2)
          )

          if (distance < threshold) {
            data[i + 3] = 0 // Convert matching color to transparent
          }
        }

        ctx.putImageData(imgData, 0, 0)
        setProgress(90)

        // Always export as transparent PNG
        const transparentUrl = canvas.toDataURL("image/png")
        const downloadName = `no_bg_${file.name.substring(0, file.name.lastIndexOf("."))}.png`

        setOutputUrl(transparentUrl)
        setOutputName(downloadName)
        setProgress(100)
        setIsSuccess(true)
        toast.success("Background color cleared successfully!")
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

        await logConversion({
          toolUsed: "Background Remover",
          inputFileName: file.name,
          outputFileName: downloadName,
          size: file.size,
          status: "SUCCESS",
        })
      }
      URL.revokeObjectURL(imgUrl)
    } catch (error) {
      console.error(error)
      toast.error("Failed to remove background.")
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
            progressText="Sweeping boundary pixels..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <Label htmlFor="threshold">Key Sensitivity Threshold</Label>
                  <span className="text-cyan-500">{threshold}</span>
                </div>
                <input
                  id="threshold"
                  type="range"
                  min="10"
                  max="120"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Tight Tolerance</span>
                  <span>Wide Color Range</span>
                </div>
              </div>
              <Button
                onClick={handleRemoveBackground}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Isolate Subject & Clear BG
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Subject Isolated!</h3>
            <p className="text-sm text-slate-500">Background pixels were successfully converted to alpha transparency.</p>
          </div>

          {/* Translucent checkerboard preview wrapper to show transparency */}
          <div className="w-40 h-40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow flex items-center justify-center p-2 bg-[radial-gradient(#e2e8f0_20%,transparent_20%),radial-gradient(#e2e8f0_20%,transparent_20%)] dark:bg-[radial-gradient(#1e293b_20%,transparent_20%),radial-gradient(#1e293b_20%,transparent_20%)] bg-[length:12px_12px] bg-[0_0,6px_6px]">
            <img src={outputUrl || ""} alt="Isolated preview" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>

          <div className="flex gap-4">
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold px-8">
              <a href={outputUrl || "#"} download={outputName}>
                Download PNG
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccess(false);
                setFiles([]);
                setOutputUrl(null);
                setThreshold(40);
              }}
              className="border-slate-200 dark:border-white/10 dark:text-white"
            >
              Process Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
