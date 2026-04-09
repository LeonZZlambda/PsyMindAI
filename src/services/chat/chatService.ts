import { GeminiClient } from '../api/providers/geminiClient';
import { parseError, createErrorResponse, ErrorType, type ErrorResponse, type ApiError } from '../api/errorHandler';
import { withRetry } from '../api/retryHandler';
import { SYSTEM_PROMPTS } from '../prompts/systemPrompts';
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

  const systemPrompt = options.systemPrompt ?? SYSTEM_PROMPTS.PSYMIND;
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
      updateLongTermMemory([...history, { type: 'user', content: message }, { type: 'ai', content: response.text }]).catch(console.error);
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

/**
 * Generates a chat title from the first message
 * Truncates to 40 characters to avoid excessive API calls
 */
export async function generateTitle(text: string): Promise<string> {
  return text.trim().slice(0, 40) + (text.length > 40 ? '...' : '');
}

/**
 * Updates long-term memory based on conversation history
 * Analyzes patterns and enriches stored memory object
 */
export async function updateLongTermMemory(history: ChatMessage[]): Promise<LongTermMemory | null> {
  if (!geminiClient.isConfigured() || history.length < 5) return null;

  try {
    const oldMemory = localStorage.getItem('psymind_longterm_memory') || '{}';
    const memoryPrompt = `Você é um psicólogo e educador. Analise este recente trecho de conversa do usuário e atualize a memória de longo prazo existente.
Memória atual: ${oldMemory}

Retorne **APENAS** o novíssimo objeto JSON atualizado detalhando a Memória de Longo Prazo. Enriqueça com novos padrões observados, mas mantenha as informações importantes que já existiam na memória:
{
  "padroesDeAprendizagem": ["...", "..."],
  "estadoEmocionalComum": ["...", "..."],
  "desafiosRecorrentes": ["...", "..."],
  "interessesETracos": ["...", "..."]
}
Sem markdown de conversação, apenas o JSON válido.`;
    
    const contents = [
      ...formatHistoryForGemini(history, memoryPrompt)
    ];

    const response = await geminiClient.generateContent({
      model: 'gemini-2.5-flash',
      contents
    });

    if (response?.text) {
      const jsonStr = response.text.replace(/```json|```/gi, '').trim();
      const parsed = JSON.parse(jsonStr) as LongTermMemory;
      localStorage.setItem('psymind_longterm_memory', JSON.stringify(parsed));
      return parsed;
    }
  } catch (error) {
    console.error('Erro na consolidação de memória:', error);
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

    const insightPrompt = `Atuando como um orientador analítico, relacione os seguintes dados reais do uso do estudante neste app educacional/emocional:
Memória de Longo Prazo: ${longtermMemory}
Histórico de Humor (Mood): ${moodHistoryStr}
Estudos (Pomodoro): ${pomodoroStatsStr}
Estatísticas de Uso Geral: ${telemetryStatsStr}

Analise os pontos fortes e de melhoria, identificando padrões implícitos (correlacionando horários, humor e foco, se possível) e devolva APENAS UM JSON válido na exata seguinte estrutura:
{
  "pattern": "A descrição breve e analítica de um padrão real observado no cenário do estudante. Ex: '🧠 Padrão observado: Você estuda à noite com foco baixo.'",
  "suggestion": "Uma recomendação encorajadora, empírica e acionável para melhorar. Ex: '⚡ Sugestão: Tente sessões mais curtas cedo.'"
}
Não use crases, markdown, nem explique o raciocínio fora do JSON. Apenas as chaves "pattern" e "suggestion".`;

    const contents = [{ role: 'user', parts: [{ text: insightPrompt }] }];
    const response = await geminiClient.generateContent({
      model: 'gemini-2.5-flash',
      contents
    });

    if (response?.text) {
      const jsonStr = response.text.replace(/```json|```/gi, '').trim();
      return JSON.parse(jsonStr) as MetaInsight;
    }
  } catch (error) {
    console.error('Erro na criação do Meta Insight:', error);
  }
  return null;
}

/**
 * Checks if Gemini API is configured
 */
export function isConfigured(): boolean {
  return defaultConfig.isConfigured();
}
