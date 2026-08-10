import { logger } from '@/lib/logger'
import { ZodError, ZodSchema } from 'zod'

export type ActionResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: string; validationErrors?: Record<string, string[]> }

export async function safeAction<TInput, TOutput>(
  actionName: string,
  schema: ZodSchema<TInput> | null,
  input: TInput,
  handler: (validatedInput: TInput) => Promise<TOutput>
): Promise<ActionResult<TOutput>> {
  try {
    let validatedInput = input
    if (schema) {
      const parseResult = schema.safeParse(input)
      if (!parseResult.success) {
        const flattened = parseResult.error.flatten().fieldErrors
        logger.warn(`Action validation failed: ${actionName}`, { errors: flattened })
        return {
          success: false,
          data: null,
          error: 'Validation failed. Please check your inputs.',
          validationErrors: flattened as Record<string, string[]>,
        }
      }
      validatedInput = parseResult.data
    }

    const data = await handler(validatedInput)
    return { success: true, data, error: null }
  } catch (error: any) {
    logger.error(`Error in action: ${actionName}`, error)
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected server error occurred. Please try again.',
    }
  }
}
