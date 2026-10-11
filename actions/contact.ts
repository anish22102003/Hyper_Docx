"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function submitContactForm(values: z.infer<typeof ContactSchema>) {
  const validatedFields = ContactSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message }
  }

  const { name, email, subject, message } = validatedFields.data

  try {
    const contactMessage = await db.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    })

    revalidatePath("/admin")
    return { success: "Message sent! Our support team will get in touch shortly." }
  } catch (error) {
    console.error("Contact form error:", error)
    return { error: "Failed to submit message. Please try again later." }
  }
}
