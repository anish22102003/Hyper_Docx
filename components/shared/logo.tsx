import Link from "next/link"
import { SendHorizontal } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
  href?: string
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
  href = "/",
}: LogoProps) {
  const sizeConfig = {
    sm: {
      badge: "w-7 h-7 rounded-lg",
      icon: "w-3.5 h-3.5",
      text: "text-base",
      badgeShadow: "shadow-sm shadow-sky-500/20",
    },
    md: {
      badge: "w-8 h-8 rounded-xl",
      icon: "w-4 h-4",
      text: "text-lg",
      badgeShadow: "shadow-md shadow-sky-500/25",
    },
    lg: {
      badge: "w-12 h-12 rounded-2xl",
      icon: "w-6 h-6",
      text: "text-2xl",
      badgeShadow: "shadow-lg shadow-sky-500/30",
    },
  }[size]

  const content = (
    <div className={`inline-flex items-center space-x-2.5 group ${className}`}>
      {/* Brand badge: Vibrant gradient with horizontal paper plane pointing straight to the right */}
      <div
        className={`flex items-center justify-center shrink-0 ${sizeConfig.badge} ${sizeConfig.badgeShadow} bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 text-white ring-1 ring-white/20 group-hover:scale-105 transition-all duration-200`}
      >
        <SendHorizontal
          className={`${sizeConfig.icon} text-white stroke-[2.2] translate-x-[0.5px] group-hover:translate-x-1 transition-transform duration-200`}
        />
      </div>

      {showText && (
        <span
          className={`font-extrabold ${sizeConfig.text} tracking-tight text-slate-900 dark:text-white select-none`}
        >
          HyperDoc<span className="text-sky-500 dark:text-sky-400">X</span>
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    )
  }

  return content
}

/**
 * Standalone icon badge component for auth headers and hero highlights
 */
export function LogoIcon({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizeConfig = {
    sm: {
      badge: "w-7 h-7 rounded-lg",
      icon: "w-3.5 h-3.5",
      badgeShadow: "shadow-sm shadow-sky-500/20",
    },
    md: {
      badge: "w-8 h-8 rounded-xl",
      icon: "w-4 h-4",
      badgeShadow: "shadow-md shadow-sky-500/25",
    },
    lg: {
      badge: "w-12 h-12 rounded-2xl",
      icon: "w-6 h-6",
      badgeShadow: "shadow-lg shadow-sky-500/30",
    },
  }[size]

  return (
    <div
      className={`flex items-center justify-center shrink-0 ${sizeConfig.badge} ${sizeConfig.badgeShadow} bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 text-white ring-1 ring-white/20 ${className}`}
    >
      <SendHorizontal className={`${sizeConfig.icon} text-white stroke-[2.2] translate-x-[0.5px]`} />
    </div>
  )
}
