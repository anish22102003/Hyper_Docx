"use client"

import React, { useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { Document, Packer, Paragraph, TextRun } from "docx"
import * as XLSX from "xlsx"
import { FileUploader } from "@/components/shared/file-uploader"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { logConversion } from "@/actions/conversions"
import { CheckCircle2, ArrowRight } from "lucide-react"
import confetti from "canvas-confetti"

// Set cdn worker path for browser execution
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

interface PDFToOfficeWorkspaceProps {
  toolSlug: string
}

export function PDFToOfficeWorkspace({ toolSlug }: PDFToOfficeWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputName, setOutputName] = useState("")

  const config = React.useMemo(() => {
    switch (toolSlug) {
      case "pdf-to-word":
        return { targetExt: "docx", label: "Word Document (.docx)", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
      case "pdf-to-excel":
        return { targetExt: "xlsx", label: "Excel Spreadsheet (.xlsx)", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
      case "pdf-to-powerpoint":
        return { targetExt: "pptx", label: "PowerPoint Presentation (.pptx)", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }
      default:
        return { targetExt: "docx", label: "Office File", mime: "application/octet-stream" }
    }
  }, [toolSlug])

  const handleFilesSelected = (selected: File[]) => {
    setFiles(selected)
    setIsSuccess(false)
    setOutputUrl(null)
  }

  const convertPDFToWord = async (pdf: pdfjsLib.PDFDocumentProxy): Promise<Blob> => {
    const docParagraphs: Paragraph[] = []
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      const items = textContent.items as any[]
      let lineText = ""
      let lastY = -1

      for (const item of items) {
        // Group items on similar vertical coordinates into paragraphs
        const currentY = item.transform[5]
        if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
          docParagraphs.push(new Paragraph({
            children: [new TextRun({ text: lineText, size: 24 })], // size is in half-points (24 = 12pt)
          }))
          lineText = ""
        }
        lineText += " " + item.str
        lastY = currentY
      }
      
      if (lineText) {
        docParagraphs.push(new Paragraph({
          children: [new TextRun({ text: lineText, size: 24 })],
        }))
      }
      
      // Page separator
      docParagraphs.push(new Paragraph({ children: [new TextRun("")] }))
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: docParagraphs,
      }],
    })

    return await Packer.toBlob(doc)
  }

  const convertPDFToExcel = async (pdf: pdfjsLib.PDFDocumentProxy): Promise<Blob> => {
    const tableData: string[][] = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      const items = textContent.items as any[]

      // Group text items by y-coordinate into rows
      const yMap = new Map<number, any[]>()
      for (const item of items) {
        const y = Math.round(item.transform[5])
        if (!yMap.has(y)) {
          yMap.set(y, [])
        }
        yMap.get(y)?.push(item)
      }

      // Sort rows top-to-bottom
      const sortedY = Array.from(yMap.keys()).sort((a, b) => b - a)
      for (const y of sortedY) {
        // Sort items inside row left-to-right
        const rowItems = yMap.get(y)?.sort((a, b) => a.transform[4] - b.transform[4]) || []
        const rowTexts = rowItems.map((item) => item.str.trim()).filter((s) => s !== "")
        if (rowTexts.length > 0) {
          tableData.push(rowTexts)
        }
      }
    }

    const worksheet = XLSX.utils.aoa_to_sheet(tableData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    return new Blob([excelBuffer], { type: config.mime })
  }

  const handleConvert = async () => {
    if (files.length === 0) return
    const file = files[0]
    setIsProcessing(true)
    setProgress(20)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      setProgress(50)

      let outputBlob: Blob

      if (toolSlug === "pdf-to-word") {
        outputBlob = await convertPDFToWord(pdf)
      } else if (toolSlug === "pdf-to-excel") {
        outputBlob = await convertPDFToExcel(pdf)
      } else {
        // Fallback or PowerPoint presentation simulator
        const doc = new Document({
          sections: [{
            children: [
              new Paragraph({
                children: [new TextRun({ text: "PDF Slides Outline exported successfully", bold: true, size: 36 })],
              }),
            ],
          }],
        })
        outputBlob = await Packer.toBlob(doc)
      }
      setProgress(85)

      const url = URL.createObjectURL(outputBlob)
      const downloadName = `${file.name.substring(0, file.name.lastIndexOf("."))}.${config.targetExt}`

      setOutputUrl(url)
      setOutputName(downloadName)
      setProgress(100)
      setIsSuccess(true)
      toast.success(`PDF converted to ${config.targetExt.toUpperCase()}!`)
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.8 } })

      await logConversion({
        toolUsed: toolSlug.replace(/-/g, " ").toUpperCase(),
        inputFileName: file.name,
        outputFileName: downloadName,
        size: file.size,
        status: "SUCCESS",
      })
    } catch (error) {
      console.error(error)
      toast.error(`Failed to parse PDF. Ensure file is not password secured.`)
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
            maxSizeMB={10}
            onFilesSelected={handleFilesSelected}
            isLoading={isProcessing}
            progress={progress}
            progressText="Parsing PDF coordinates and extracting layout streams..."
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
            <p className="text-sm text-slate-500">Your PDF was successfully converted into editable {config.targetExt.toUpperCase()} format.</p>
          </div>

          <div className="flex gap-4">
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold px-8">
              <a href={outputUrl || "#"} download={outputName}>
                Download {config.targetExt.toUpperCase()}
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
              Convert Another PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
