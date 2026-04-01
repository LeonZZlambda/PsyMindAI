export class ApiConfig {
  constructor(apiKey = null) {
    this.apiKey = apiKey || localStorage.getItem('psy_mind_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(key) {
    if (key) {
      this.apiKey = key;
      localStorage.setItem('psy_mind_api_key', key);
    } else {
      localStorage.removeItem('psy_mind_api_key');
      this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
  }

  isConfigured() {
    return !!this.apiKey;
  }
}

export const defaultConfig = new ApiConfig();
