import { z } from 'zod'

// App schemas
export const appSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  icon: z.string().optional(),
  version: z.string().optional(),
  developer: z.string().optional(),
  installs: z.number(),
  rating: z.number(),
  screenshots: z.array(z.string()).optional(),
  lastUpdated: z.string().optional(),
})

export const appListSchema = z.object({
  apps: z.array(appSchema),
  total: z.number(),
})

// User schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  notifications: z.boolean(),
})

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    email: z.string().email(),
    name: z.string().optional(),
  }),
})

// API response schemas
export const apiErrorSchema = z.object({
  error: z.string(),
})

export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

// Types
export type App = z.infer<typeof appSchema>
export type AppList = z.infer<typeof appListSchema>
export type User = z.infer<typeof userSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type ApiError = z.infer<typeof apiErrorSchema>
export type SuccessResponse = z.infer<typeof successResponseSchema>