const salt = "psymind_local_salt_123";

// Simple unsecure obfuscation to prevent plain-text discovery by casual XSS scrapers.
// Do not rely on this for high-value secrets on a real production backend.
const obfuscate = (str) => {
  if (!str) return str;
  const chars = str.split('');
  return btoa(chars.map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ salt.charCodeAt(i % salt.length))).join(''));
};

const deobfuscate = (str) => {
  if (!str) return str;
  try {
    const decoded = atob(str);
    const chars = decoded.split('');
    return chars.map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ salt.charCodeAt(i % salt.length))).join('');
  } catch (e) {
    // Fallback if it was stored as plain text before we added obfuscation
    return str;
  }
};

export class ApiConfig {
  constructor(apiKey = null) {
    const storedObject = localStorage.getItem('psy_mind_api_key_secure');
    const legacyObject = localStorage.getItem('psy_mind_api_key');
    
    // Auto-migrate from old plain text to obfuscated format
    let recoveredKey = null;
    if (storedObject) {
      recoveredKey = deobfuscate(storedObject);
    } else if (legacyObject) {
      recoveredKey = legacyObject;
      this.setApiKey(legacyObject); // Resave obfuscated
      localStorage.removeItem('psy_mind_api_key');
    }

    this.apiKey = apiKey || recoveredKey || import.meta.env.VITE_GEMINI_API_KEY;
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(key) {
    if (key) {
      this.apiKey = key;
      localStorage.setItem('psy_mind_api_key_secure', obfuscate(key));
    } else {
      localStorage.removeItem('psy_mind_api_key_secure');
      this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
  }

  isConfigured() {
    return !!this.apiKey;
  }
}

export const defaultConfig = new ApiConfig();
