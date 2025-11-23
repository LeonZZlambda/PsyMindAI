import { GoogleGenAI } from '@google/genai';

export class GeminiClient {
  constructor(apiKey) {
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
  }

  isConfigured() {
    return !!this.client;
  }

  async generateContent({ model, contents }) {
    if (!this.client) {
      throw new Error('API_KEY_MISSING');
    }
    return await this.client.models.generateContent({ model, contents });
  }
}
