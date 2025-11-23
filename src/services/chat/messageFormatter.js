export function formatHistoryForGemini(history, systemPrompt) {
  return [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Entendido! Estou pronto para ajudar.' }] },
    ...history.slice(-8).flatMap(msg => [
      { role: 'user', parts: [{ text: msg.type === 'user' ? msg.content : '' }] },
      { role: 'model', parts: [{ text: msg.type === 'ai' ? msg.content : '' }] }
    ]).filter(c => c.parts[0].text)
  ];
}

export function createUserMessage(text, files = []) {
  return { type: 'user', content: text, files };
}

export function createAIMessage(content, isStreaming = false) {
  return { type: 'ai', content, isStreaming };
}
