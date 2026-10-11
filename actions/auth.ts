"use server"

import { db } from "@/lib/db"
import { z } from "zod"
import bcrypt from "bcryptjs"

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors[0].message }
  }

  const { name, password } = validatedFields.data
  const email = validatedFields.data.email.toLowerCase().trim()
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email already registered" }
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        plan: "FREE",
      },
    })

    return { success: "Account created successfully! You can now log in." }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to create account. Please try again." }
  }
}
