"use client"

import React from "react"
import dynamic from "next/dynamic"
import { ToolItem } from "@/lib/tools-data"
import { ToolWorkspace } from "@/components/shared/tool-workspace"
import {
  FileText,
  Merge,
  Scissors,
  Trash2,
  Move,
  RotateCw,
  FileImage,
  Image as ImageIcon,
  FileCode,
  FileSpreadsheet,
  Table,
  Presentation,
  Tv,
  FileDown,
  Lock,
  Unlock,
  Stamp,
  Camera,
  RefreshCw,
  Sparkles,
  Minimize2,
  Maximize2,
  Crop,
  Undo,
  GitCompare,
  Eraser,
} from "lucide-react"

// Import Workspace Components
import { PDFMerger } from "./pdf-merger"
import { PDFSplitter } from "./pdf-splitter"
import { PDFCompressor } from "./pdf-compressor"
import { PDFRotator } from "./pdf-rotator"
import { PDFDeleter } from "./pdf-deleter"
import { PDFReorder } from "./pdf-reorder"
import { PDFProtector } from "./pdf-protector"
import { PDFUnlocker } from "./pdf-unlocker"
import { PDFWatermark } from "./pdf-watermark"
const PDFToImage = dynamic(
  () => import("./pdf-to-image-workspace").then((mod) => mod.PDFToImage),
  { ssr: false }
)
import { ImageToPDF } from "./image-to-pdf-workspace"
import { ImageConverterWorkspace } from "./image-converter-workspace"
import { ImageToSVGWorkspace } from "./image-to-svg-workspace"
import { ImageCompressorWorkspace } from "./image-compressor-workspace"
import { ImageResizerWorkspace } from "./image-resizer-workspace"
import { ImageCropperWorkspace } from "./image-cropper-workspace"
import { ImageRotatorWorkspace } from "./image-rotator-workspace"
import { ImageFlipperWorkspace } from "./image-flipper-workspace"
import { BackgroundRemoverWorkspace } from "./background-remover-workspace"
import { OfficeToPDFWorkspace } from "./office-to-pdf-workspace"
const PDFToOfficeWorkspace = dynamic(
  () => import("./pdf-to-office-workspace").then((mod) => mod.PDFToOfficeWorkspace),
  { ssr: false }
)

const IconMapper: Record<string, React.ComponentType<{ className?: string }>> = {
  Merge,
  Split: Scissors,
  Trash2,
  Move,
  RotateCw,
  FileImage,
  Image: ImageIcon,
  FileCode,
  FileSpreadsheet,
  Sheet: FileSpreadsheet,
  Table2: Table,
  Presentation,
  Tv,
  FileDown,
  Lock,
  Unlock,
  Stamp,
  Camera,
  RefreshCw,
  Sparkles,
  Bookmark: FileImage,
  Scissors,
  Minimize2,
  Maximize2,
  Crop,
  Undo,
  GitCompare,
  Eraser,
}

interface ToolWorkspaceWrapperProps {
  tool: ToolItem
}

export function ToolWorkspaceWrapper({ tool }: ToolWorkspaceWrapperProps) {
  const Icon = IconMapper[tool.icon] || FileText

  const renderToolComponent = () => {
    switch (tool.slug) {
      case "merge-pdf":
        return <PDFMerger />
      case "split-pdf":
        return <PDFSplitter />
      case "compress-pdf":
        return <PDFCompressor />
      case "rotate-pdf":
        return <PDFRotator />
      case "delete-pdf-pages":
        return <PDFDeleter />
      case "reorder-pdf-pages":
        return <PDFReorder />
      case "protect-pdf":
        return <PDFProtector />
      case "unlock-pdf":
        return <PDFUnlocker />
      case "watermark-pdf":
        return <PDFWatermark />
      case "pdf-to-image":
        return <PDFToImage />
      case "image-to-pdf":
        return <ImageToPDF />
      case "jpg-to-png":
      case "png-to-jpg":
      case "webp-to-jpg":
      case "jpg-to-webp":
      case "convert-to-ico":
        return <ImageConverterWorkspace toolSlug={tool.slug} />
      case "image-to-svg":
        return <ImageToSVGWorkspace />
      case "image-compressor":
        return <ImageCompressorWorkspace />
      case "image-resizer":
        return <ImageResizerWorkspace />
      case "crop-image":
        return <ImageCropperWorkspace />
      case "rotate-image":
        return <ImageRotatorWorkspace />
      case "flip-image":
        return <ImageFlipperWorkspace />
      case "background-remover":
        return <BackgroundRemoverWorkspace />
      case "word-to-pdf":
      case "excel-to-pdf":
      case "powerpoint-to-pdf":
        return <OfficeToPDFWorkspace toolSlug={tool.slug} />
      case "pdf-to-word":
      case "pdf-to-excel":
      case "pdf-to-powerpoint":
        return <PDFToOfficeWorkspace toolSlug={tool.slug} />
      default:
        return <div className="text-center p-8">Tool component is currently loading...</div>
    }
  }

  return (
    <ToolWorkspace title={tool.name} description={tool.description} icon={<Icon className="w-6 h-6" />}>
      {renderToolComponent()}
    </ToolWorkspace>
  )
}
