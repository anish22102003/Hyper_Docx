"use server"

import { db } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function logConversion(values: {
  toolUsed: string
  inputFileName: string
  outputFileName: string
  size: number
  status: "SUCCESS" | "FAILED" | "PROCESSING"
}) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    // Only log to DB if user is logged in
    if (!userId) {
      return { success: false, message: "Guest conversions are not recorded." }
    }

    const conversion = await db.conversion.create({
      data: {
        userId,
        toolUsed: values.toolUsed,
        inputFileName: values.inputFileName,
        outputFileName: values.outputFileName,
        status: values.status,
        size: values.size,
      },
    })

    revalidatePath("/dashboard")
    return { success: true, conversion }
  } catch (error) {
    console.error("Failed to log conversion:", error)
    return { success: false, error: "Database error occurred." }
  }
}

export async function deleteConversionHistory() {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return { error: "Unauthorized" }
    }

    await db.conversion.deleteMany({
      where: { userId },
    })

    revalidatePath("/dashboard")
    return { success: true, message: "History cleared successfully." }
  } catch (error) {
    console.error("Failed to delete history:", error)
    return { error: "Failed to clear database logs." }
  }
}

export async function deleteConversionItem(id: string) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return { error: "Unauthorized" }
    }

    await db.conversion.delete({
      where: { id, userId },
    })

    revalidatePath("/dashboard")
    return { success: true, message: "Item removed." }
  } catch (error) {
    console.error("Failed to delete conversion item:", error)
    return { error: "Failed to delete item." }
  }
}
