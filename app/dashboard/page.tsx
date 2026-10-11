import { auth } from "@/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session || !session.user) {
    redirect("/login")
  }

  // Fetch conversion logs from the database
  const conversions = (await db.conversion.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })) || []

  // Sum up processed bytes
  const storageUsedBytes = conversions.reduce((acc: number, c: any) => acc + (c?.size || 0), 0)

  return (
    <DashboardClient
      user={session.user}
      initialConversions={JSON.parse(JSON.stringify(conversions))}
      storageUsedBytes={storageUsedBytes}
    />
  )
}
