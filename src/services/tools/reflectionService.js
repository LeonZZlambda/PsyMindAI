import { sendMessage } from '../chat/chatService';

export async function generateReflection(category = null) {
  const categoryPrompt = category ? `sobre ${category}` : 'motivacional para estudantes';
  const prompt = `Gere uma frase inspiradora ${categoryPrompt} (máximo 2 linhas) e indique o autor (pode ser um pensador, cientista ou frase original sua como "PsyMind.AI"). Formato: "Frase" - Autor`;
  
  const result = await sendMessage(prompt, []);
  
  if (result.success) {
    const text = result.text.replace(/["\"\"]/g, '').trim();
    const parts = text.split(' - ');
    return {
      text: parts[0] || text,
      author: parts[1] || 'PsyMind.AI',
      category: category || 'geral'
    };
  }
  
  return null;
}

export async function generateReflectionAnalysis(reflection) {
  const prompt = `Sobre a frase "${reflection.text}" de ${reflection.author}, escreva uma breve reflexão (2-3 frases) de como um estudante pode aplicar isso no dia a dia.`;
  
  const result = await sendMessage(prompt, []);
  return result.success ? result.text : result.userMessage || '⚠️ Não foi possível gerar reflexão no momento.';
}
