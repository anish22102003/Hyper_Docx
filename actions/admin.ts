"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

// Verify that the logged in user is an administrator
async function checkAdmin() {
  const session = await auth()
  const role = (session?.user as any)?.role
  if (!session || role !== "ADMIN") {
    throw new Error("Unauthorized. Administrator privileges required.")
  }
}

export async function deleteUser(userId: string) {
  try {
    await checkAdmin()

    await db.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin")
    return { success: true, message: "User deleted successfully." }
  } catch (error: any) {
    console.error("Failed to delete user:", error)
    return { error: error.message || "Failed to delete user." }
  }
}

export async function toggleMessageReadStatus(id: string, isRead: boolean) {
  try {
    await checkAdmin()

    await db.contactMessage.update({
      where: { id },
      data: { isRead },
    })

    revalidatePath("/admin")
    return { success: true, message: "Message status updated." }
  } catch (error: any) {
    console.error("Failed to update message:", error)
    return { error: error.message || "Failed to update message." }
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await checkAdmin()

    await db.contactMessage.delete({
      where: { id },
    })

    revalidatePath("/admin")
    return { success: true, message: "Message removed from inbox." }
  } catch (error: any) {
    console.error("Failed to delete message:", error)
    return { error: error.message || "Failed to delete message." }
  }
}
