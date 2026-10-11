"use client"

import React, { useState } from "react"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { CheckCircle2, FileDown } from "lucide-react"
import confetti from "canvas-confetti"

export function ImageCompressorWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  
  const [quality, setQuality] = useState(75) // 10% to 100%
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
    if (selected.length > 0) {
      setOriginalSize(selected[0].size)
    }
  }

  const handleCompress = async () => {
    if (files.length === 0) return
    const file = files[0]
    setIsProcessing(true)
    setProgress(30)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: file.type })
      const imgUrl = URL.createObjectURL(blob)
      setProgress(60)

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const tempImg = new Image()
        tempImg.onload = () => resolve(tempImg)
        tempImg.onerror = reject
        tempImg.src = imgUrl
      })

      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const context = canvas.getContext("2d")

      if (context) {
        context.drawImage(img, 0, 0)
        setProgress(85)

        // Compress image using quality parameter
        // If type is not jpeg/webp, use jpeg as fallback for compression support
        const mimeType = file.type === "image/png" ? "image/jpeg" : file.type
        const dataUrl = canvas.toDataURL(mimeType, quality / 100)

        // Calculate size based on base64 string
        const base64Str = dataUrl.split(",")[1]
        const sizeBytes = Math.floor(base64Str.length * 0.75)
        setCompressedSize(sizeBytes)

        const downloadName = `compressed_${file.name.substring(0, file.name.lastIndexOf("."))}.${file.name.split(".").pop()}`

        setOutputUrl(dataUrl)
        setOutputName(downloadName)
        setProgress(100)
        setIsSuccess(true)
        toast.success("Image compressed successfully!")
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

        await logConversion({
          toolUsed: "Image Compressor",
          inputFileName: file.name,
          outputFileName: downloadName,
          size: sizeBytes,
          status: "SUCCESS",
        })
      }
      URL.revokeObjectURL(imgUrl)
    } catch (error) {
      console.error(error)
      toast.error("Failed to compress image.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
            progressText="Applying compression encoding..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <Label htmlFor="quality">Compression Quality</Label>
                  <span className="text-cyan-500">{quality}%</span>
                </div>
                <input
                  id="quality"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Small File (Lower Quality)</span>
                  <span>Large File (Best Quality)</span>
                </div>
              </div>
              <Button
                onClick={handleCompress}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Compress Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Optimization Finished!</h3>
            <p className="text-sm text-slate-500">Your image has been optimized.</p>
            <div className="flex flex-col gap-1 items-center pt-2">
              <div className="text-xs text-slate-500">
                Original Size: <span className="font-bold">{formatFileSize(originalSize)}</span>
              </div>
              <div className="text-xs text-slate-500">
                Optimized Size: <span className="font-bold text-cyan-500">{formatFileSize(compressedSize)}</span>
              </div>
              {originalSize > compressedSize && (
                <span className="text-xs text-cyan-500 font-bold bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full inline-block mt-2">
                  Saved {Math.floor(((originalSize - compressedSize) / originalSize) * 100)}% of file size!
                </span>
              )}
            </div>
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
              Compress Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
