import { createAdminClient } from '@/lib/supabase/admin'
import { Database } from '@/types/supabase'
import { logger } from '@/lib/logger'
import { withRetry } from '@/lib/utils/retry'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type UpdateProfileInput = Database['public']['Tables']['profiles']['Update']

export async function getProfileById(userId: string): Promise<Profile | null> {
  if (!userId) throw new Error('User ID is required')

  return withRetry(async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      logger.error(`Database error fetching profile for user ${userId}`, error)
      throw new Error(`Failed to retrieve user profile: ${error.message}`)
    }

    return data
  })
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<Profile> {
  if (!userId) throw new Error('User ID is required')

  return withRetry(async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      logger.error(`Database error updating profile for user ${userId}`, error)
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    return data
  })
}
