import type { ChatMessage, MessageRole, FileAttachment } from '@/types/storage';

/**
 * Gemini API message part (text, image, etc)
 */
export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

/**
 * Gemini API message format
 */
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: MessagePart[];
}

/**
 * Converts chat history to Gemini API format
 * Takes last 8 messages, adds system prompt, filters empty messages
 */
export function formatHistoryForGemini(
  history: ChatMessage[],
  systemPrompt: string
): GeminiMessage[] {
  return [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Entendido! Estou pronto para ajudar.' }] },
    ...history.slice(-8).flatMap((msg): GeminiMessage[] => [
      { role: 'user', parts: [{ text: msg.type === 'user' ? msg.content : '' }] },
      { role: 'model', parts: [{ text: msg.type === 'ai' ? msg.content : '' }] }
    ]).filter((c): c is GeminiMessage => Boolean(c.parts[0].text))
  ];
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Creates a user message object
 */
export function createUserMessage(
  text: string,
  files: FileAttachment[] = []
): ChatMessage {
  return { id: generateId(), type: 'user', content: text, files };
}

/**
 * Creates an AI message object
 */
export function createAIMessage(
  content: string,
  isStreaming: boolean = false,
  explainability?: ChatMessage['explainability']
): ChatMessage {
  return { id: generateId(), type: 'ai', content, isStreaming, explainability };
}
