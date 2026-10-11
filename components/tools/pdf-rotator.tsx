"use client"

import React, { useState } from "react"
import { PDFDocument, degrees } from "pdf-lib"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { RotateCw, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function PDFRotator() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  const [rotationAngle, setRotationAngle] = useState("90")

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const handleRotate = async () => {
    if (files.length === 0) return
    const file = files[0]
    setIsProcessing(true)
    setProgress(20)

    try {
      const fileBytes = await file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(fileBytes)
      const pages = pdfDoc.getPages()
      setProgress(50)

      const angle = parseInt(rotationAngle, 10)
      for (const page of pages) {
        const currentRotation = page.getRotation().angle
        page.setRotation(degrees((currentRotation + angle) % 360))
      }
      setProgress(80)

      const rotatedBytes = await pdfDoc.save()
      const blob = new Blob([rotatedBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const downloadName = `rotated_${file.name}`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("PDF pages rotated successfully!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: "Rotate PDF",
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to rotate PDF. Ensure file is not encrypted.")
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
            progressText="Applying page rotations..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="angle" className="text-xs font-bold text-slate-500">
                  Select Rotation Angle
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "90° Right", value: "90" },
                    { label: "180° Flip", value: "180" },
                    { label: "90° Left (270°)", value: "270" }
                  ].map((ang) => (
                    <Button
                      key={ang.value}
                      variant={rotationAngle === ang.value ? "default" : "outline"}
                      onClick={() => setRotationAngle(ang.value)}
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
                Apply Rotation
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Rotated Completed!</h3>
            <p className="text-sm text-slate-500">All pages inside your document were rotated.</p>
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
              Rotate Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
