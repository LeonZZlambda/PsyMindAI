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

export const sendMessageToGemini = async (message, history = []) => {
  if (!ai) {
    return {
      success: false,
      error: 'API Key não configurada'
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

    return {
      success: true,
      text: response.text
    };
  } catch (error) {
    console.error('Erro ao comunicar com Gemini:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const isGeminiConfigured = () => !!ai;
