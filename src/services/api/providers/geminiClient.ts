export interface GenerateContentParams {
  model: string;
  contents: any[];
}

export class GeminiClient {
  private apiKey: string | null;
  private client: any | null = null;

  constructor(apiKey: string | null) {
    this.apiKey = apiKey;
  }

  private async getClient(): Promise<any> {
    if (this.client) return this.client;
    if (!this.apiKey) return null;
    
    try {
      const { GoogleGenAI } = await import('@google/genai');
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
      return this.client;
    } catch (e) {
      console.error('Failed to load GoogleGenAI:', e);
      return null;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async generateContent({ model, contents }: GenerateContentParams): Promise<any> {
    const client = await this.getClient();
    if (!client) {
      throw new Error('API_KEY_MISSING');
    }
    return await client.models.generateContent({ model, contents });
  }
}
