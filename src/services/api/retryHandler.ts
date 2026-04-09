/**
 * Generic async function that can be retried
 */
export type AsyncFunction<T = unknown> = () => Promise<T>;

/**
 * Error response structure (may vary)
 */
interface ErrorResponse {
  error?: {
    code?: number;
  };
  code?: number;
  status?: number;
}

/**
 * Retries an async function with exponential backoff on rate limit errors
 * 
 * @param fn - Async function to execute
 * @param retries - Number of retries remaining (default: 2)
 * @param delay - Initial delay in milliseconds (default: 3000)
 * @returns Result of the async function
 * 
 * @example
 * const response = await withRetry(
 *   () => apiClient.generateContent(...),
 *   3,
 *   2000
 * );
 */
export async function withRetry<T>(
  fn: AsyncFunction<T>,
  retries: number = 2,
  delay: number = 3000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const errorData = typeof error === 'string' ? JSON.parse(error) : error;
    // Google SDK may return HTTP status in "status" property
    const errorCode = (errorData as ErrorResponse)?.error?.code || 
                      (error as any)?.code || 
                      (errorData as ErrorResponse)?.status || 
                      (error as any)?.status;

    if (errorCode === 429 && retries > 0) {
      console.warn(`Erro 429: Rate limit atingido. Retentando em ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }

    throw error;
  }
}
