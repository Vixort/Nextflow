import { z } from 'zod'

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  avatarUrl: z.string().url('Avatar must be a valid URL').optional().or(z.literal('')),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
