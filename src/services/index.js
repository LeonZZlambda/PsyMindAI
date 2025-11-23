// API
export { GeminiClient } from './api/geminiClient';
export { parseError, createErrorResponse, ERROR_TYPES } from './api/errorHandler';
export { withRetry } from './api/retryHandler';

// Chat
export { sendMessage, generateTitle, isConfigured, setApiKey } from './chat/chatService';
export { formatHistoryForGemini, createUserMessage, createAIMessage } from './chat/messageFormatter';

// Storage
export { loadChats, saveChats, createChat, updateChat } from './storage/chatStorage';
export { loadSetting, saveSetting, loadBooleanSetting } from './storage/settingsStorage';

// Tools
export { generatePomodoroTip } from './tools/pomodoroService';
export { generateMoodInsight } from './tools/moodService';
export { generateReflection, generateReflectionAnalysis } from './tools/reflectionService';

// Config
export { ApiConfig, defaultConfig } from './config/apiConfig';

// Adapters
export { StorageAdapter, defaultStorage } from './adapters/storageAdapter';

// Prompts
export { SYSTEM_PROMPTS } from './prompts/systemPrompts';
