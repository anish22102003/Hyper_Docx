"use client"

import React, { useState, useRef, DragEvent, ChangeEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UploadCloud, File, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploaderProps {
  accept: string
  multiple?: boolean
  maxSizeMB?: number
  onFilesSelected: (files: File[]) => void
  isLoading?: boolean
  progress?: number
  progressText?: string
}

export function FileUploader({
  accept,
  multiple = false,
  maxSizeMB = 10,
  onFilesSelected,
  isLoading = false,
  progress = 0,
  progressText = "Uploading file...",
}: FileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const validateFiles = (files: File[]): File[] => {
    setErrorMsg(null)
    const validFiles: File[] = []
    const maxByteSize = maxSizeMB * 1024 * 1024

    // Parse accepted extension arrays
    const acceptedTypes = accept.split(",").map((t) => t.trim().toLowerCase())

    for (const file of files) {
      if (file.size > maxByteSize) {
        setErrorMsg(`File "${file.name}" exceeds the maximum limit of ${maxSizeMB}MB.`)
        continue
      }

      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
      const fileMimeType = file.type.toLowerCase()

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return type === fileExtension
        }
        if (type.endsWith("/*")) {
          const prefix = type.split("/")[0]
          return fileMimeType.startsWith(prefix + "/")
        }
        return type === fileMimeType
      })

      if (!isAccepted) {
        setErrorMsg(`File format "${fileExtension}" is not supported for this tool.`)
        continue
      }

      validFiles.push(file)
    }

    return validFiles
  }

  const processFiles = (filesList: FileList | null) => {
    if (!filesList) return
    const files = Array.from(filesList)
    const valid = validateFiles(files)

    if (valid.length > 0) {
      const updated = multiple ? [...selectedFiles, ...valid] : valid
      setSelectedFiles(updated)
      onFilesSelected(updated)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (!isLoading) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!isLoading) {
      processFiles(e.target.files)
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  const removeFile = (index: number) => {
    if (isLoading) return
    const updated = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updated)
    onFilesSelected(updated)
    if (updated.length === 0) {
      setErrorMsg(null)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Zone */}
      {!isLoading && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-cyan-500 bg-cyan-500/5 scale-[0.99] shadow-inner"
              : "border-slate-300 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-500 bg-slate-50/50 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900/20"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            className="hidden"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={isDragActive ? { scale: 1.1, opacity: 1 } : { scale: 1, opacity: 0.8 }}
            className="p-4 bg-slate-100 dark:bg-white/5 rounded-full mb-4 text-slate-500 dark:text-slate-400 group-hover:text-cyan-500"
          >
            <UploadCloud className="w-8 h-8 text-cyan-500" />
          </motion.div>

          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">
            Drag & drop files here, or <span className="text-cyan-500 hover:underline font-bold">browse</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
            Supports {accept.replace(/\./g, "").toUpperCase()} files (Max {maxSizeMB}MB)
          </p>
        </div>
      )}

      {/* Uploading Progress */}
      {isLoading && (
        <div className="border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center space-y-4">
          <UploadCloud className="w-10 h-10 text-cyan-400 animate-bounce" />
          <div className="w-full text-center space-y-1.5">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{progressText}</h4>
            <p className="text-xs text-slate-500">{progress}% completed</p>
          </div>
          <Progress value={progress} className="h-2 w-full bg-slate-800" />
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl font-medium"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Selected Files List */}
      <AnimatePresence>
        {selectedFiles.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-2.5"
          >
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {selectedFiles.map((file, idx) => (
                <motion.div
                  key={`${file.name}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-xl"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/10 rounded-lg text-cyan-500">
                      <File className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(idx)
                    }}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
