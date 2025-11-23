const STORAGE_KEY = 'chatHistory';

export function loadChats() {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading chats:', error);
    return [];
  }
}

export function saveChats(chats) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

export function createChat(id, title, messages) {
  return {
    id,
    title,
    messages,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function updateChat(chat, updates) {
  return {
    ...chat,
    ...updates,
    updatedAt: new Date().toISOString()
  };
}
