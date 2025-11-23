export async function withRetry(fn, retries = 2, delay = 3000) {
  try {
    return await fn();
  } catch (error) {
    const errorData = typeof error === 'string' ? JSON.parse(error) : error;
    const errorCode = errorData?.error?.code || error.code;
    
    if (errorCode === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay);
    }
    
    throw error;
  }
}
