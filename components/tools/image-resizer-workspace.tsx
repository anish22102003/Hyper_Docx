"use client"

import React, { useState } from "react"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { CheckCircle2, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"

export function ImageResizerWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")

  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)
  const [lockRatio, setLockRatio] = useState(true)

  const handleFilesSelected = async (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)

    if (selected.length > 0) {
      try {
        const file = selected[0]
        const blob = new Blob([await file.arrayBuffer()], { type: file.type })
        const imgUrl = URL.createObjectURL(blob)

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const tempImg = new Image()
          tempImg.onload = () => resolve(tempImg)
          tempImg.onerror = reject
          tempImg.src = imgUrl
        })

        setOriginalWidth(img.width)
        setOriginalHeight(img.height)
        setWidth(img.width)
        setHeight(img.height)
        URL.revokeObjectURL(imgUrl)
      } catch (err) {
        toast.error("Failed to load image details.")
      }
    }
  }

  const handleWidthChange = (val: number) => {
    setWidth(val)
    if (lockRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth
      setHeight(Math.round(val * ratio))
    }
  }

  const handleHeightChange = (val: number) => {
    setHeight(val)
    if (lockRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight
      setWidth(Math.round(val * ratio))
    }
  }

  const handleResize = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setProgress(35)

    const file = files[0]
    try {
      const fileBytes = await file.arrayBuffer()
      const blob = new Blob([fileBytes], { type: file.type })
      const imgUrl = URL.createObjectURL(blob)

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const tempImg = new Image()
        tempImg.onload = () => resolve(tempImg)
        tempImg.onerror = reject
        tempImg.src = imgUrl
      })
      setProgress(60)

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        setProgress(85)

        const resizedUrl = canvas.toDataURL(file.type)
        const downloadName = `resized_${file.name}`

        setOutputUrl(resizedUrl)
        setOutputName(downloadName)
        setProgress(100)
        setIsSuccess(true)
        toast.success("Image resized successfully!")
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

        await logConversion({
          toolUsed: "Image Resizer",
          inputFileName: file.name,
          outputFileName: downloadName,
          size: file.size,
          status: "SUCCESS",
        })
      }
      URL.revokeObjectURL(imgUrl)
    } catch (error) {
      console.error(error)
      toast.error("Failed to resize image.")
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
            progressText="Rescaling canvas pixels..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="w" className="text-xs font-bold text-slate-500">Width (pixels)</Label>
                  <Input
                    id="w"
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="h" className="text-xs font-bold text-slate-500">Height (pixels)</Label>
                  <Input
                    id="h"
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="lock"
                  type="checkbox"
                  checked={lockRatio}
                  onChange={(e) => setLockRatio(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500 dark:bg-slate-900 dark:border-white/10"
                />
                <Label htmlFor="lock" className="text-xs text-slate-500 font-bold select-none cursor-pointer">
                  Lock Aspect Ratio ({originalWidth} x {originalHeight})
                </Label>
              </div>

              <Button
                onClick={handleResize}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Resize Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Resized Completed!</h3>
            <p className="text-sm text-slate-500">Dimensions modified to {width} x {height} px.</p>
          </div>

          <div className="w-40 h-40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow bg-white dark:bg-slate-900 flex items-center justify-center p-2">
            <img src={outputUrl || ""} alt="Resized preview" className="max-w-full max-h-full object-contain rounded-lg" />
          </div>

          <div className="flex gap-4">
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold px-8">
              <a href={outputUrl || "#"} download={outputName}>
                Download Image
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
              Resize Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
