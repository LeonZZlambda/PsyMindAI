import { GeminiClient } from '../api/geminiClient';
import { parseError, createErrorResponse, ERROR_TYPES } from '../api/errorHandler';
import { withRetry } from '../api/retryHandler';
import { SYSTEM_PROMPTS } from '../prompts/systemPrompts';
import { formatHistoryForGemini } from './messageFormatter';
import { defaultConfig } from '../config/apiConfig';

let geminiClient = new GeminiClient(defaultConfig.getApiKey());

export function setApiKey(apiKey) {
  defaultConfig.setApiKey(apiKey);
  geminiClient = new GeminiClient(apiKey);
}

export async function sendMessage(message, history = []) {
  if (!geminiClient.isConfigured()) {
    return createErrorResponse(ERROR_TYPES.API_KEY_MISSING);
  }

  try {
    const contents = [
      ...formatHistoryForGemini(history, SYSTEM_PROMPTS.PSYMIND),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await withRetry(async () => {
      return await geminiClient.generateContent({
        model: 'gemini-2.5-flash',
        contents
      });
    });

    if (!response?.text) {
      throw new Error('EMPTY_RESPONSE');
    }

    return {
      success: true,
      text: response.text
    };
  } catch (error) {
    console.error('Erro Gemini:', error);
    const parsedError = parseError(error);
    return createErrorResponse(parsedError.type, parsedError.details);
  }
}

export async function generateTitle(text) {
  try {
    const result = await sendMessage(SYSTEM_PROMPTS.TITLE_GENERATOR(text), []);
    if (result.success) {
      return result.text.trim().replace(/[\"']/g, '');
    }
  } catch (error) {
    console.error('Error generating title:', error);
  }
  return text.slice(0, 40) + (text.length > 40 ? '...' : '');
}

export function isConfigured() {
  return defaultConfig.isConfigured();
}
