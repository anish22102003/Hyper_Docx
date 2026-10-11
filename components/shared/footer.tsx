import Link from "next/link"
import { Github, Twitter, Linkedin, Heart, Mail } from "lucide-react"
import { Logo } from "@/components/shared/logo"

export function Footer() {
  return (
    <footer className="border-t border-slate-200/40 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Pitch */}
          <div className="space-y-4">
            <Logo size="md" href="/" />
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Your premium, all-in-one SaaS platform for lightning-fast PDF and image manipulation. Convert, compress, edit and encrypt files directly in your web browser.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-sky-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* PDF Tools columns */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              PDF Tools
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tools/pdf-to-image" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  PDF to Image
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/compress-pdf" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/protect-pdf" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Protect PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Image Tools columns */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Image Tools
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tools/jpg-to-png" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  JPG to PNG
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/crop-image" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Crop Image
                </Link>
              </li>
              <li>
                <Link href="/tools/background-remover" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Remove Background
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/blog" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Blog Feed
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200/40 dark:border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-col space-y-1.5">
            <p>© {new Date().getFullYear()} HyperDocX SaaS. All rights reserved.</p>
            <p className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mt-1">
              Admin: <span className="font-medium text-slate-700 dark:text-slate-300">Anish Biswas</span>
              <span className="text-slate-300 dark:text-slate-800">|</span>
              <a 
                href="https://www.linkedin.com/in/anish-biswas-892878332?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-cyan-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span className="hover:underline">LinkedIn</span>
              </a>
              <span className="text-slate-300 dark:text-slate-800">|</span>
              <a 
                href="mailto:anishkumarbiswas2003@gmail.com" 
                className="text-slate-400 hover:text-cyan-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                title="Send Email"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hover:underline">Email</span>
              </a>
            </p>
          </div>
          <p className="flex items-center mt-4 md:mt-0">
            Handcrafted with <Heart className="w-3.5 h-3.5 mx-1 text-rose-500 fill-rose-500 animate-pulse" /> for digital workflows
          </p>
        </div>
      </div>
    </footer>
  )
}
