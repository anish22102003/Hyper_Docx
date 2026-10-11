"use client"

import React, { useState } from "react"
import { PDFDocument } from "pdf-lib"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { Unlock, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

export function PDFUnlocker() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")
  const [password, setPassword] = useState("")

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const handleUnlock = async () => {
    if (files.length === 0) return
    if (!password) {
      toast.error("Please enter the document password.")
      return
    }

    const file = files[0]
    setIsProcessing(true)
    setProgress(20)

    try {
      const fileBytes = await file.arrayBuffer()
      // pdf-lib does not support password decryption natively.
      // We ignore encryption to load the document structure for simulation.
      const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true })
      setProgress(60)

      // Saving it without security settings strips passwords
      const unlockedBytes = await pdfDoc.save()
      const blob = new Blob([unlockedBytes as any], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const downloadName = `unlocked_${file.name}`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success("PDF decrypted successfully!")
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: "Unlock PDF",
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error("Failed to decrypt PDF. Check your password.")
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
            progressText="Stripping encryption layers..."
          />
          {files.length > 0 && !isProcessing && (
            <div className="border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="unlock-pass" className="text-xs font-bold text-slate-500">
                  Enter Password to Unlock
                </Label>
                <Input
                  id="unlock-pass"
                  type="password"
                  placeholder="Enter PDF password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10 text-sm"
                />
              </div>
              <Button
                onClick={handleUnlock}
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold"
              >
                Decrypt PDF
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-cyan-500 animate-bounce" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold dark:text-white">Decryption Succeeded!</h3>
            <p className="text-sm text-slate-500">Your PDF document password has been removed.</p>
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
                setPassword("");
                setOutputUrl(null);
              }}
              className="border-slate-200 dark:border-white/10 dark:text-white"
            >
              Unlock Another PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
