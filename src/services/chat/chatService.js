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

export async function generateMetaInsight() {
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
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error('Erro na criação do Meta Insight:', error);
  }
  return null;
}

export function isConfigured() {
  return defaultConfig.isConfigured();
}
