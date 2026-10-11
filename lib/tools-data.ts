export interface ToolItem {
  name: string
  slug: string
  description: string
  category: "organize" | "convert" | "security" | "image-convert" | "image-edit"
  popular?: boolean
  icon: string
}

export const TOOLS_DATA: ToolItem[] = [
  // PDF Organizers
  {
    name: "Merge PDF",
    slug: "merge-pdf",
    description: "Combine multiple PDF files into one single document in seconds.",
    category: "organize",
    popular: true,
    icon: "Merge",
  },
  {
    name: "Split PDF",
    slug: "split-pdf",
    description: "Extract specific page ranges or split every page into separate files.",
    category: "organize",
    popular: true,
    icon: "Split",
  },
  {
    name: "Delete PDF Pages",
    slug: "delete-pdf-pages",
    description: "Remove unnecessary pages from your PDF documents instantly.",
    category: "organize",
    icon: "Trash2",
  },
  {
    name: "Reorder PDF Pages",
    slug: "reorder-pdf-pages",
    description: "Rearrange the sequence of pages in your PDF document visually.",
    category: "organize",
    icon: "Move",
  },
  {
    name: "Rotate PDF",
    slug: "rotate-pdf",
    description: "Rotate individual pages or all pages in your PDF by 90, 180 or 270 degrees.",
    category: "organize",
    icon: "RotateCw",
  },

  // PDF Converters
  {
    name: "PDF to Image",
    slug: "pdf-to-image",
    description: "Convert pages of a PDF document into high-quality PNG or JPG files.",
    category: "convert",
    popular: true,
    icon: "FileImage",
  },
  {
    name: "Image to PDF",
    slug: "image-to-pdf",
    description: "Convert JPG, PNG, or WEBP images into an organized PDF document.",
    category: "convert",
    popular: true,
    icon: "Image",
  },
  {
    name: "Word to PDF",
    slug: "word-to-pdf",
    description: "Convert Microsoft Word .docx files into standard PDF layout.",
    category: "convert",
    icon: "FileCode",
  },
  {
    name: "PDF to Word",
    slug: "pdf-to-word",
    description: "Extract text and tables from PDF and convert them to editable .docx files.",
    category: "convert",
    icon: "FileSpreadsheet",
  },
  {
    name: "Excel to PDF",
    slug: "excel-to-pdf",
    description: "Convert Microsoft Excel spreadsheet sheets to standard PDF pages.",
    category: "convert",
    icon: "Sheet",
  },
  {
    name: "PDF to Excel",
    slug: "pdf-to-excel",
    description: "Extract tables from PDF files into Microsoft Excel spreadsheets.",
    category: "convert",
    icon: "Table2",
  },
  {
    name: "PowerPoint to PDF",
    slug: "powerpoint-to-pdf",
    description: "Convert PowerPoint slides into structured PDF presentations.",
    category: "convert",
    icon: "Presentation",
  },
  {
    name: "PDF to PowerPoint",
    slug: "pdf-to-powerpoint",
    description: "Convert PDF documents to editable Microsoft PowerPoint slides.",
    category: "convert",
    icon: "Tv",
  },

  // PDF Security & Compress
  {
    name: "Compress PDF",
    slug: "compress-pdf",
    description: "Reduce the file size of your PDF while optimizing image and text structure.",
    category: "security",
    popular: true,
    icon: "FileDown",
  },
  {
    name: "Protect PDF",
    slug: "protect-pdf",
    description: "Encrypt and secure your PDF documents with a strong custom password.",
    category: "security",
    icon: "Lock",
  },
  {
    name: "Unlock PDF",
    slug: "unlock-pdf",
    description: "Remove security passwords and encryption limits from your PDF files.",
    category: "security",
    icon: "Unlock",
  },
  {
    name: "Watermark PDF",
    slug: "watermark-pdf",
    description: "Stamp styled text or image overlays onto your PDF pages for copyright security.",
    category: "security",
    icon: "Stamp",
  },

  // Image Converters
  {
    name: "JPG to PNG",
    slug: "jpg-to-png",
    description: "Convert JPEG image assets into transparent PNG format easily.",
    category: "image-convert",
    icon: "Camera",
  },
  {
    name: "PNG to JPG",
    slug: "png-to-jpg",
    description: "Convert PNG images into compressed JPG format with white backgrounds.",
    category: "image-convert",
    icon: "FileText",
  },
  {
    name: "WEBP to JPG",
    slug: "webp-to-jpg",
    description: "Convert modern WebP images into standard JPG format.",
    category: "image-convert",
    icon: "RefreshCw",
  },
  {
    name: "JPG to WEBP",
    slug: "jpg-to-webp",
    description: "Convert standard JPG files into highly-compressed modern WebP format.",
    category: "image-convert",
    icon: "Sparkles",
  },
  {
    name: "Convert to ICO",
    slug: "convert-to-ico",
    description: "Generate standard web favicon (.ico) files from standard image formats.",
    category: "image-convert",
    icon: "Bookmark",
  },
  {
    name: "Image to SVG",
    slug: "image-to-svg",
    description: "Vector trace outlines of images to generate scalable SVG vectors.",
    category: "image-convert",
    icon: "Scissors",
  },

  // Image Editors
  {
    name: "Image Compressor",
    slug: "image-compressor",
    description: "Optimize image file sizes by applying custom compression ratios.",
    category: "image-edit",
    popular: true,
    icon: "Minimize2",
  },
  {
    name: "Image Resizer",
    slug: "image-resizer",
    description: "Resize images to custom width and height, or maintaining aspect ratios.",
    category: "image-edit",
    icon: "Maximize2",
  },
  {
    name: "Crop Image",
    slug: "crop-image",
    description: "Cut out specific rectangular sections of your image assets.",
    category: "image-edit",
    icon: "Crop",
  },
  {
    name: "Rotate Image",
    slug: "rotate-image",
    description: "Rotate images clockwise or counter-clockwise by custom angles.",
    category: "image-edit",
    icon: "Undo",
  },
  {
    name: "Flip Image",
    slug: "flip-image",
    description: "Mirror images horizontally or vertically in one click.",
    category: "image-edit",
    icon: "GitCompare",
  },
  {
    name: "Background Remover",
    slug: "background-remover",
    description: "Isolate subjects and automatically strip background colors from images.",
    category: "image-edit",
    popular: true,
    icon: "Eraser",
  },
]

export const CATEGORIES = [
  { id: "popular", name: "Popular Tools" },
  { id: "organize", name: "Organize PDF" },
  { id: "convert", name: "Convert PDF" },
  { id: "security", name: "PDF Security" },
  { id: "image-convert", name: "Image Converter" },
  { id: "image-edit", name: "Image Editor" },
]
