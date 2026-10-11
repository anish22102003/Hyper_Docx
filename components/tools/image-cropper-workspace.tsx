"use client"

import React, { useState } from "react"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function ImageCropperWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")

  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)
  
  // Crop margins in percentages
  const [cropLeft, setCropLeft] = useState(10)
  const [cropRight, setCropRight] = useState(10)
  const [cropTop, setCropTop] = useState(10)
  const [cropBottom, setCropBottom] = useState(10)

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
        URL.revokeObjectURL(imgUrl)
      } catch (err) {
        toast.error("Failed to load image metadata.")
      }
    }
  }

  const handleCrop = async () => {
    if (files.length === 0) return
    setIsProcessing(true)
    setProgress(30)

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
      
      // Calculate crop dimensions
      const startX = Math.floor(img.width * (cropLeft / 100))
      const startY = Math.floor(img.height * (cropTop / 100))
      const endX = Math.floor(img.width * (1 - cropRight / 100))
      const endY = Math.floor(img.height * (1 - cropBottom / 100))
      
      const targetWidth = Math.max(1, endX - startX)
      const targetHeight = Math.max(1, endY - startY)

      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Draw cropped section of original image to canvas
        ctx.drawImage(img, startX, startY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight)
        setProgress(85)

        const croppedUrl = canvas.toDataURL(file.type)
        const downloadName = `cropped_${file.name}`

        setOutputUrl(croppedUrl)
        setOutputName(downloadName)
        setProgress(100)
        setIsSuccess(true)
        toast.success("Image cropped successfully!")
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

        await logConversion({
          toolUsed: "Crop Image",
          inputFileName: file.name,
          outputFileName: downloadName,
          size: file.size,
          status: "SUCCESS",
        })
      }
      URL.revokeObjectURL(imgUrl)
    } catch (error) {
      console.error(error)
      toast.error("Failed to crop image.")
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
            progressText="Slicing canvas pixels..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crop Adjustments (Percent)</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Label htmlFor="left">Crop Left</Label>
                    <span>{cropLeft}%</span>
                  </div>
                  <input
                    id="left"
                    type="range"
                    min="0"
                    max="40"
                    value={cropLeft}
                    onChange={(e) => setCropLeft(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Label htmlFor="right">Crop Right</Label>
                    <span>{cropRight}%</span>
                  </div>
                  <input
                    id="right"
                    type="range"
                    min="0"
                    max="40"
                    value={cropRight}
                    onChange={(e) => setCropRight(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Label htmlFor="top">Crop Top</Label>
                    <span>{cropTop}%</span>
                  </div>
                  <input
                    id="top"
                    type="range"
                    min="0"
                    max="40"
                    value={cropTop}
                    onChange={(e) => setCropTop(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <Label htmlFor="bottom">Crop Bottom</Label>
                    <span>{cropBottom}%</span>
                  </div>
                  <input
                    id="bottom"
                    type="range"
                    min="0"
                    max="40"
                    value={cropBottom}
                    onChange={(e) => setCropBottom(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleCrop}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Crop Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Cropping Complete!</h3>
            <p className="text-sm text-slate-500">Your image margins were successfully sliced.</p>
          </div>

          <div className="w-40 h-40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow bg-white dark:bg-slate-900 flex items-center justify-center p-2">
            <img src={outputUrl || ""} alt="Cropped preview" className="max-w-full max-h-full object-contain rounded-lg" />
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
                setCropLeft(10);
                setCropRight(10);
                setCropTop(10);
                setCropBottom(10);
              }}
              className="border-slate-200 dark:border-white/10 dark:text-white"
            >
              Crop Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
