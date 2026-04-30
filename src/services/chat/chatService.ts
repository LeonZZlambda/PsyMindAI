import { GeminiClient } from '../api/providers/geminiClient';
import logger from '../../utils/logger';
import { z } from 'zod';
import { parseError, createErrorResponse, ErrorType, type ErrorResponse, type ApiError } from '../api/errorHandler';
import { withRetry } from '../api/retryHandler';
import { getSystemPrompt, getMemoryUpdatePrompt, getMetaInsightPrompt, getTitleGeneratorPrompt } from '../prompts/systemPrompts';
import { formatHistoryForGemini } from './messageFormatter';
import { defaultConfig } from '../config/apiConfig';
import type { ChatMessage } from '@/types/storage';

let geminiClient = new GeminiClient(defaultConfig.getApiKey());

/**
 * Message sending options
 */
export interface SendMessageOptions {
  systemPrompt?: string;
  skipMemoryUpdate?: boolean;
}

/**
 * Successful message response
 */
export interface SendMessageSuccess {
  success: true;
  text: string;
}

/**
 * Message response - either success or error
 */
export type SendMessageResponse = SendMessageSuccess | ErrorResponse;

/**
 * Meta insight about user patterns
 */
export interface MetaInsight {
  pattern: string;
  suggestion: string;
}

/**
 * Long-term memory structure
 */
export interface LongTermMemory {
  padroesDeAprendizagem: string[];
  estadoEmocionalComum: string[];
  desafiosRecorrentes: string[];
  interessesETracos: string[];
}

// Runtime schemas for validating LLM JSON outputs
const LongTermMemorySchema = z.object({
  padroesDeAprendizagem: z.array(z.string()),
  estadoEmocionalComum: z.array(z.string()),
  desafiosRecorrentes: z.array(z.string()),
  interessesETracos: z.array(z.string())
});

const MetaInsightSchema = z.object({
  pattern: z.string(),
  suggestion: z.string()
});

/**
 * Sets the API key for Gemini client
 */
export function setApiKey(apiKey: string): void {
  defaultConfig.setApiKey(apiKey);
  geminiClient = new GeminiClient(apiKey);
}

/**
 * Sends a message to Gemini and returns the response
 * Handles memory updates asynchronously every 5 messages
 */
export async function sendMessage(
  message: string,
  history: ChatMessage[] = [],
  options: SendMessageOptions = {}
): Promise<SendMessageResponse> {
  if (!geminiClient.isConfigured()) {
    return createErrorResponse(ErrorType.API_KEY_MISSING);
  }

  const lang = (typeof window !== 'undefined' && localStorage.getItem('i18nextLng')) || 'pt';
  const systemPrompt = options.systemPrompt ?? getSystemPrompt(lang);
  const skipMemoryUpdate = options.skipMemoryUpdate === true;

  try {
    const contents = [
      ...formatHistoryForGemini(history, systemPrompt),
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

    // Async trigger: updates long-term memory in background every 5 messages
    // This captures "user patterns" and "interpreted history"
    if (
      !skipMemoryUpdate &&
      history.length > 2 &&
      (history.length + 1) % 5 === 0
    ) {
      updateLongTermMemory([...history, { type: 'user', content: message }, { type: 'ai', content: response.text }]).catch(logger.error);
    }

    return {
      success: true,
      text: response.text
    };
  } catch (error) {
    logger.error('Erro Gemini:', error);
    const parsedError = parseError(error);
    return createErrorResponse(parsedError.type, parsedError.details);
  }
}

/**
 * Generates a chat title from the first message
 * Truncates to 40 characters to avoid excessive API calls
 */
export async function generateTitle(text: string): Promise<string> {
  if (!geminiClient.isConfigured()) return text.slice(0, 40);

  try {
    const lang = (typeof window !== 'undefined' && localStorage.getItem('i18nextLng')) || 'pt';
    const prompt = getTitleGeneratorPrompt(text, lang);
    const contents = [{ role: 'user', parts: [{ text: prompt }] }];
    
    const response = await geminiClient.generateContent({
      model: 'gemini-2.5-flash',
      contents
    });

    return response?.text?.trim().replace(/["']/g, '') || text.slice(0, 40);
  } catch (error) {
    logger.error('Error generating title:', error);
    return text.slice(0, 40);
  }
}

/**
 * Updates long-term memory based on conversation history
 * Analyzes patterns and enriches stored memory object
 */
export async function updateLongTermMemory(history: ChatMessage[]): Promise<LongTermMemory | null> {
  if (!geminiClient.isConfigured() || history.length < 5) return null;

  try {
    const oldMemory = localStorage.getItem('psymind_longterm_memory') || '{}';
    const lang = (typeof window !== 'undefined' && localStorage.getItem('i18nextLng')) || 'pt';
    const memoryPrompt = await getMemoryUpdatePrompt(history, oldMemory, lang);
    
    const contents = [
      ...formatHistoryForGemini(history, memoryPrompt)
    ];

    const response = await geminiClient.generateContent({
      model: 'gemini-2.5-flash',
      contents
    });

    if (response?.text) {
      const jsonStr = response.text.replace(/```json|```/gi, '').trim();
      try {
        const parsedObj = JSON.parse(jsonStr);
        const validated = LongTermMemorySchema.safeParse(parsedObj);
        if (!validated.success) {
          logger.error('Invalid LongTermMemory schema from LLM', validated.error);
          return null;
        }
        const parsed = validated.data;
        localStorage.setItem('psymind_longterm_memory', JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        logger.error('Failed to parse LLM JSON for long-term memory:', e);
        return null;
      }
    }
  } catch (error) {
    logger.error('Erro na consolidação de memória:', error);
  }
  return null;
}

/**
 * Generates a meta insight about user patterns from accumulated data
 * Correlates mood, study habits, and usage patterns
 */
export async function generateMetaInsight(): Promise<MetaInsight | null> {
  if (!geminiClient.isConfigured()) return null;

  try {
    const longtermMemory = localStorage.getItem('psymind_longterm_memory') || 'Nenhuma';
    const moodHistoryStr = localStorage.getItem('psymind_mood_history') || '[]';
    const pomodoroStatsStr = localStorage.getItem('psymind_pomodoro_stats') || '{}';
    const telemetryStatsStr = localStorage.getItem('psymind_telemetry_stats') || '{}';

    const lang = (typeof window !== 'undefined' && localStorage.getItem('i18nextLng')) || 'pt';
    const insightPrompt = getMetaInsightPrompt({
      longtermMemory,
      moodHistory: moodHistoryStr,
      pomodoroStats: pomodoroStatsStr,
      telemetryStats: telemetryStatsStr
    }, lang);

    const contents = [{ role: 'user', parts: [{ text: insightPrompt }] }];
    const response = await geminiClient.generateContent({
      model: 'gemini-2.5-flash',
      contents
    });

    if (response?.text) {
      const jsonStr = response.text.replace(/```json|```/gi, '').trim();
      try {
        const parsedObj = JSON.parse(jsonStr);
        const validated = MetaInsightSchema.safeParse(parsedObj);
        if (!validated.success) {
          logger.error('Invalid MetaInsight schema from LLM', validated.error);
          return null;
        }
        return validated.data;
      } catch (e) {
        logger.error('Failed to parse LLM JSON for meta insight:', e);
        return null;
      }
    }
  } catch (error) {
    logger.error('Erro na criação do Meta Insight:', error);
  }
  return null;
}

/**
 * Checks if Gemini API is configured
 */
export function isConfigured(): boolean {
  return defaultConfig.isConfigured();
}
