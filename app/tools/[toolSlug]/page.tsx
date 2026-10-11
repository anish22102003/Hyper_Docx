import { notFound } from "next/navigation"
import { Metadata } from "next"
import { TOOLS_DATA } from "@/lib/tools-data"
import { ToolWorkspaceWrapper } from "@/components/tools/tool-workspace-wrapper"

interface PageProps {
  params: Promise<{
    toolSlug: string
  }>
}

export async function generateStaticParams() {
  return TOOLS_DATA.map((tool) => ({
    toolSlug: tool.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { toolSlug } = await params
  const tool = TOOLS_DATA.find((t) => t.slug === toolSlug)

  if (!tool) {
    return {
      title: "Tool Not Found | HyperDocX",
    }
  }

  return {
    title: `${tool.name} - Free Online Document Tools | HyperDocX`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} - Free Online Document Tools | HyperDocX`,
      description: tool.description,
      type: "website",
    },
  }
}

export default async function ToolPage({ params }: PageProps) {
  const { toolSlug } = await params
  const tool = TOOLS_DATA.find((t) => t.slug === toolSlug)

  if (!tool) {
    notFound()
  }

  return <ToolWorkspaceWrapper tool={tool} />
}
