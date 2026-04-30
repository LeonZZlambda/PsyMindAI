import { GoogleGenAI } from '@google/genai';

export interface GenerateContentParams {
  model: string;
  contents: any[];
}

export class GeminiClient {
  private client: GoogleGenAI | null;

  constructor(apiKey: string | null) {
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async generateContent({ model, contents }: GenerateContentParams): Promise<any> {
    if (!this.client) {
      throw new Error('API_KEY_MISSING');
    }
    return await this.client.models.generateContent({ model, contents });
  }
}
