/**
 * API Configuration service
 * Handles secure storage of API keys with obfuscation
 */

const SALT = "psymind_local_salt_123";
const SECURE_STORAGE_KEY = 'psy_mind_api_key_secure';
const LEGACY_STORAGE_KEY = 'psy_mind_api_key';

/**
 * Simple obfuscation to prevent casual XSS discovery
 * WARNING: Not suitable for high-security scenarios. For production, use a proper backend.
 */
function obfuscate(str: string | null): string | null {
  if (!str) return str;
  const chars = str.split('');
  return btoa(
    chars
      .map((char, i) =>
        String.fromCharCode(char.charCodeAt(0) ^ SALT.charCodeAt(i % SALT.length))
      )
      .join('')
  );
}

/**
 * Deobfuscates a stored API key
 * Includes fallback for plain-text keys stored before obfuscation was added
 */
function deobfuscate(str: string | null): string | null {
  if (!str) return str;
  try {
    const decoded = atob(str);
    const chars = decoded.split('');
    return chars
      .map((char, i) =>
        String.fromCharCode(char.charCodeAt(0) ^ SALT.charCodeAt(i % SALT.length))
      )
      .join('');
  } catch (e) {
    // Fallback for keys stored as plain text before obfuscation
    return str;
  }
}

/**
 * API Configuration manager
 * Handles API key storage, retrieval, and environment variable fallback
 */
export class ApiConfig {
  private apiKey: string | null;

  constructor(apiKey: string | null = null) {
    const storedObject = localStorage.getItem(SECURE_STORAGE_KEY);
    const legacyObject = localStorage.getItem(LEGACY_STORAGE_KEY);

    // Auto-migrate from old plain text to obfuscated format
    let recoveredKey: string | null = null;
    if (storedObject) {
      recoveredKey = deobfuscate(storedObject);
    } else if (legacyObject) {
      recoveredKey = legacyObject;
      this.setApiKey(legacyObject); // Resave obfuscated
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    this.apiKey = apiKey || recoveredKey || import.meta.env.VITE_GEMINI_API_KEY || null;
  }

  /**
   * Get the current API key
   */
  getApiKey(): string | null {
    return this.apiKey;
  }

  /**
   * Set a new API key and persist it
   */
  setApiKey(key: string | null): void {
    if (key) {
      this.apiKey = key;
      localStorage.setItem(SECURE_STORAGE_KEY, obfuscate(key) || '');
    } else {
      localStorage.removeItem(SECURE_STORAGE_KEY);
      this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
    }
  }

  /**
   * Check if API is configured with a valid key
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

/**
 * Global API configuration instance
 */
export const defaultConfig = new ApiConfig();
