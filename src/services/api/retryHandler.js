export async function withRetry(fn, retries = 2, delay = 3000) {
  try {
    return await fn();
  } catch (error) {
    const errorData = typeof error === 'string' ? JSON.parse(error) : error;
    // O SDK novo do Google pode retornar o status HTTP na propriedade "status"
    const errorCode = errorData?.error?.code || error.code || errorData?.status || error.status;

    if (errorCode === 429 && retries > 0) {
      console.warn(`Erro 429: Rate limit atingido. Retentando em ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }

    throw error;
  }
}
