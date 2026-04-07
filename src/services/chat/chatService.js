import { GeminiClient } from '../api/providers/geminiClient';
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

    // Async trigger: atualiza memória de longo prazo em background a cada 5 mensagens
    // Isso cumpre os "padrões do usuário" e "histórico interpretado"
    if (history.length > 2 && (history.length + 1) % 5 === 0) {
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

export async function generateTitle(text) {
  // Para evitar esgotar a cota da API (erro 429), o título agora é retornado localmente 
  // usando o conteúdo da primeira mensagem sem fazer requisições secundárias pesadas ao Gemini.
  return text.trim().slice(0, 40) + (text.length > 40 ? '...' : '');
}

export async function updateLongTermMemory(history) {
  if (!geminiClient.isConfigured() || history.length < 5) return null; // Evitar custo excessivo e precisar de volume

  try {
    // Extrai memória de longo prazo analisando o histórico
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
      const parsed = JSON.parse(jsonStr);
      localStorage.setItem('psymind_longterm_memory', JSON.stringify(parsed));
      return parsed;
    }
  } catch (error) {
    console.error('Erro na consolidação de memória:', error);
  }
  return null;
}

export function isConfigured() {
  return defaultConfig.isConfigured();
}
