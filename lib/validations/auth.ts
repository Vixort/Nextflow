import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('Invalid email address format'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['user', 'admin']).default('user'),
})

export const loginSchema = z.object({
  account: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
