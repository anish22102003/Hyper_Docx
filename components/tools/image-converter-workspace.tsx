"use client"

import React, { useState } from "react"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { CheckCircle2, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"

interface ImageConverterWorkspaceProps {
  toolSlug: string
}

export function ImageConverterWorkspace({ toolSlug }: ImageConverterWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")

  // Determine source accept and target format details
  const config = React.useMemo(() => {
    switch (toolSlug) {
      case "jpg-to-png":
        return { accept: "image/jpeg,image/jpg", targetExt: "png", mime: "image/png" }
      case "png-to-jpg":
        return { accept: "image/png", targetExt: "jpg", mime: "image/jpeg" }
      case "webp-to-jpg":
        return { accept: "image/webp", targetExt: "jpg", mime: "image/jpeg" }
      case "jpg-to-webp":
        return { accept: "image/jpeg,image/jpg", targetExt: "webp", mime: "image/webp" }
      case "convert-to-ico":
        return { accept: "image/png,image/jpeg,image/jpg", targetExt: "ico", mime: "image/x-icon" }
      default:
        return { accept: "image/*", targetExt: "png", mime: "image/png" }
    }
  }, [toolSlug])

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    const file = files[0]
    setIsProcessing(true)
    setProgress(30)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: file.type })
      const imgUrl = URL.createObjectURL(blob)
      setProgress(60)

      // Load image in browser
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const tempImg = new Image()
        tempImg.onload = () => resolve(tempImg)
        tempImg.onerror = reject
        tempImg.src = imgUrl
      })

      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      if (context) {
        if (toolSlug === "convert-to-ico") {
          // Standard web favicon size
          canvas.width = 32
          canvas.height = 32
        } else {
          canvas.width = img.width
          canvas.height = img.height
        }

        // Fill background white for JPG conversion if source is PNG transparent
        if (config.mime === "image/jpeg") {
          context.fillStyle = "#ffffff"
          context.fillRect(0, 0, canvas.width, canvas.height)
        }

        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        setProgress(85)

        const dataUrl = canvas.toDataURL(config.mime, 0.95)
        const downloadName = `${file.name.substring(0, file.name.lastIndexOf("."))}.${config.targetExt}`

        setOutputUrl(dataUrl)
        setOutputName(downloadName)
        setProgress(100)
        setIsSuccess(true)
        toast.success(`Image converted to ${config.targetExt.toUpperCase()}!`)
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

        await logConversion({
          toolUsed: toolSlug.replace(/-/g, " ").toUpperCase(),
          inputFileName: file.name,
          outputFileName: downloadName,
          size: file.size,
          status: "SUCCESS",
        })
      }
      URL.revokeObjectURL(imgUrl)
    } catch (error) {
      console.error(error)
      toast.error("Failed to convert image.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {!isSuccess ? (
        <div className="space-y-6">
          <FileUploader
            accept={config.accept}
            multiple={false}
            maxSizeMB={5}
            onFilesSelected={handleFilesSelected}
            isLoading={isProcessing}
            progress={progress}
            progressText={`Re-drawing buffer as ${config.targetExt.toUpperCase()}...`}
          />
          {files.length > 0 && !isProcessing && (
            <Button
              onClick={handleConvert}
              className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
            >
              Convert to {config.targetExt.toUpperCase()}
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Conversion Complete!</h3>
            <p className="text-sm text-slate-500">Your image format was successfully converted.</p>
          </div>
          
          {/* Output Preview */}
          <div className="w-40 h-40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow bg-white dark:bg-slate-900 flex items-center justify-center p-2">
            <img src={outputUrl || ""} alt="Converted preview" className="max-w-full max-h-full object-contain rounded-lg" />
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
              Convert Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
