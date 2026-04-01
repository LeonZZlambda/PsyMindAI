import { sendMessage, generateTitle, isConfigured } from './chat/chatService';
import { defaultConfig } from './config/apiConfig';

export const sendMessageToGemini = sendMessage;
export const generateChatTitle = generateTitle;
export const isGeminiConfigured = isConfigured;

export const generateImage = async (prompt) => {
  const API_KEY = defaultConfig.getApiKey();
  
  if (!API_KEY) {
    return {
      success: false,
      error: 'API_KEY_MISSING',
      userMessage: '🔑 Configure sua API Key.'
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            safetyFilterLevel: 'block_some',
            personGeneration: 'allow_adult'
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    const imageBase64 = data.predictions?.[0]?.bytesBase64Encoded;

    if (!imageBase64) {
      throw new Error('EMPTY_RESPONSE');
    }

    return {
      success: true,
      imageUrl: `data:image/png;base64,${imageBase64}`
    };
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    
    return {
      success: false,
      error: 'IMAGE_GENERATION_ERROR',
      userMessage: '🎨 Não foi possível gerar a imagem. Tente novamente.'
    };
  }
};
