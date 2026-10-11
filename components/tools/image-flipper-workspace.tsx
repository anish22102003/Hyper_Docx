"use client"

import React, { useState } from "react"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { GitCompare, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function ImageFlipperWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  const [flipDir, setFlipDir] = useState("horizontal") // horizontal, vertical

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const handleFlip = async () => {
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
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (ctx) {
        if (flipDir === "horizontal") {
          ctx.translate(canvas.width, 0)
          ctx.scale(-1, 1)
        } else {
          ctx.translate(0, canvas.height)
          ctx.scale(1, -1)
        }
        ctx.drawImage(img, 0, 0)
        setProgress(85)

        const flippedUrl = canvas.toDataURL(file.type)
        const downloadName = `flipped_${file.name}`

        setOutputUrl(flippedUrl)
        setOutputName(downloadName)
        setProgress(100)
        setIsSuccess(true)
        toast.success("Image flipped successfully!")
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

        await logConversion({
          toolUsed: "Flip Image",
          inputFileName: file.name,
          outputFileName: downloadName,
          size: file.size,
          status: "SUCCESS",
        })
      }
      URL.revokeObjectURL(imgUrl)
    } catch (error) {
      console.error(error)
      toast.error("Failed to flip image.")
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
            progressText="Applying mirror reflection..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">Flip Direction</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={flipDir === "horizontal" ? "default" : "outline"}
                    onClick={() => setFlipDir("horizontal")}
                    className="font-semibold text-xs border-slate-200 dark:border-white/5"
                  >
                    <GitCompare className="w-3.5 h-3.5 mr-1" />
                    Horizontally (Left-Right)
                  </Button>
                  <Button
                    variant={flipDir === "vertical" ? "default" : "outline"}
                    onClick={() => setFlipDir("vertical")}
                    className="font-semibold text-xs border-slate-200 dark:border-white/5 rotate-90"
                  >
                    <GitCompare className="w-3.5 h-3.5 mr-1" />
                    Vertically (Up-Down)
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleFlip}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Flip Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Flip Completed!</h3>
            <p className="text-sm text-slate-500">Your image has been mirrored {flipDir}ly.</p>
          </div>

          <div className="w-40 h-40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow bg-white dark:bg-slate-900 flex items-center justify-center p-2">
            <img src={outputUrl || ""} alt="Flipped preview" className="max-w-full max-h-full object-contain rounded-lg" />
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
              Flip Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
