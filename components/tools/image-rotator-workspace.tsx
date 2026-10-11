"use client"

import React, { useState } from "react"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { RotateCw, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function ImageRotatorWorkspace() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  const [angle, setAngle] = useState("90") // 90, 180, 270

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const handleRotate = async () => {
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
      const ctx = canvas.getContext("2d")
      const rotationAngle = parseInt(angle, 10)

      if (ctx) {
        // Adjust width and height based on rotation angle
        if (rotationAngle === 90 || rotationAngle === 270) {
          canvas.width = img.height
          canvas.height = img.width
        } else {
          canvas.width = img.width
          canvas.height = img.height
        }

        // Center translate and rotate
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rotationAngle * Math.PI) / 180)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)
        setProgress(85)

        const rotatedUrl = canvas.toDataURL(file.type)
        const downloadName = `rotated_${file.name}`

        setOutputUrl(rotatedUrl)
        setOutputName(downloadName)
        setProgress(100)
        setIsSuccess(true)
        toast.success("Image rotated successfully!")
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

        await logConversion({
          toolUsed: "Rotate Image",
          inputFileName: file.name,
          outputFileName: downloadName,
          size: file.size,
          status: "SUCCESS",
        })
      }
      URL.revokeObjectURL(imgUrl)
    } catch (error) {
      console.error(error)
      toast.error("Failed to rotate image.")
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
            progressText="Translating canvas rotation..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-500">Select Angle</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "90° Right", value: "90" },
                    { label: "180° Flip", value: "180" },
                    { label: "90° Left", value: "270" }
                  ].map((ang) => (
                    <Button
                      key={ang.value}
                      variant={angle === ang.value ? "default" : "outline"}
                      onClick={() => setAngle(ang.value)}
                      className="font-semibold text-xs border-slate-200 dark:border-white/5"
                    >
                      <RotateCw className="w-3.5 h-3.5 mr-1" />
                      {ang.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleRotate}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Rotate Image
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Rotated Completed!</h3>
            <p className="text-sm text-slate-500">Your image has been rotated by {angle} degrees.</p>
          </div>

          <div className="w-40 h-40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow bg-white dark:bg-slate-900 flex items-center justify-center p-2">
            <img src={outputUrl || ""} alt="Rotated preview" className="max-w-full max-h-full object-contain rounded-lg" />
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
              Rotate Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
