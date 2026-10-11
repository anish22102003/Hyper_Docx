"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function toggleSubscriptionPlan() {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return { error: "You must be logged in to manage subscription plans." }
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    })

    if (!user) {
      return { error: "User profile not found." }
    }

    const targetPlan = user.plan === "FREE" ? "PRO" : "FREE"

    await db.user.update({
      where: { id: userId },
      data: {
        plan: targetPlan,
      },
    })

    // Also seed/update a mockup Subscription record
    const status = targetPlan === "PRO" ? "active" : "canceled"
    await db.subscription.upsert({
      where: { userId },
      create: {
        userId,
        status,
        plan: targetPlan,
      },
      update: {
        status,
        plan: targetPlan,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, plan: targetPlan, message: `Successfully changed plan to ${targetPlan}!` }
  } catch (error) {
    console.error("Failed to change subscription plan:", error)
    return { error: "Database error occurred. Please try again." }
  }
}
