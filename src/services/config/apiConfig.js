export class ApiConfig {
  constructor(apiKey = null) {
    this.apiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  isConfigured() {
    return !!this.apiKey;
  }
}

export const defaultConfig = new ApiConfig();
