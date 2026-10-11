import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { AdminClient } from "./admin-client"

export default async function AdminPage() {
  const session = await auth()
  const userRole = (session?.user as any)?.role

  // Enforce ADMIN role redirect guards
  if (!session || userRole !== "ADMIN") {
    redirect("/dashboard")
  }

  // Fetch analytical logs
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  const conversions = await db.conversion.findMany({
    orderBy: { createdAt: "desc" },
  })

  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <AdminClient
      initialUsers={JSON.parse(JSON.stringify(users))}
      initialConversions={JSON.parse(JSON.stringify(conversions))}
      initialMessages={JSON.parse(JSON.stringify(messages))}
    />
  )
}
