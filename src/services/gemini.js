import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const SYSTEM_PROMPT = `Você é o PsyMind.AI, um assistente educacional de apoio emocional para estudantes do ensino médio.

DIRETRIZES:
- Use linguagem empática, acolhedora e adequada para adolescentes
- Explique comportamentos e emoções com base em psicologia científica
- Ofereça estratégias práticas de enfrentamento
- Incentive busca por ajuda profissional quando necessário
- Seja breve e objetivo, mas caloroso
- Use emojis ocasionalmente para criar conexão
- Nunca substitua atendimento psicológico profissional

ÁREAS DE FOCO:
- Ansiedade e estresse acadêmico
- Procrastinação e autossabotagem
- Motivação e foco nos estudos
- Autoconhecimento e regulação emocional
- Bem-estar mental e autocuidado`;

export const sendMessageToGemini = async (message, history = [], retries = 2) => {
  if (!ai) {
    return {
      success: false,
      error: 'API_KEY_MISSING',
      userMessage: '🔑 Configure sua API Key do Gemini no arquivo .env para ativar a IA.'
    };
  }

  try {
    const contents = [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Entendido! Estou pronto para ajudar.' }] },
      ...history.slice(-8).flatMap(msg => [
        { role: 'user', parts: [{ text: msg.type === 'user' ? msg.content : '' }] },
        { role: 'model', parts: [{ text: msg.type === 'ai' ? msg.content : '' }] }
      ]).filter(c => c.parts[0].text),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents
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
    
    const errorData = typeof error === 'string' ? JSON.parse(error) : error;
    const errorCode = errorData?.error?.code || error.code;
    const errorStatus = errorData?.error?.status || error.status;

    // Rate limit - retry após delay
    if (errorCode === 429 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      return sendMessageToGemini(message, history, retries - 1);
    }

    // Mapeamento de erros
    const errorMap = {
      429: { type: 'RATE_LIMIT', message: '⏱️ Muitas requisições. Aguarde alguns segundos e tente novamente.' },
      403: { type: 'FORBIDDEN', message: '🚫 API Key inválida ou sem permissões. Verifique sua configuração.' },
      404: { type: 'NOT_FOUND', message: '❌ Modelo não encontrado. Verifique a configuração da API.' },
      500: { type: 'SERVER_ERROR', message: '⚠️ Erro no servidor do Gemini. Tente novamente em instantes.' },
      503: { type: 'UNAVAILABLE', message: '🔧 Serviço temporariamente indisponível. Tente novamente.' }
    };

    const mappedError = errorMap[errorCode] || {
      type: 'UNKNOWN',
      message: '❌ Erro inesperado ao conectar com a IA. Tente novamente.'
    };

    return {
      success: false,
      error: mappedError.type,
      userMessage: mappedError.message,
      details: error.message
    };
  }
};

export const isGeminiConfigured = () => !!ai;
