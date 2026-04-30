import i18n from '../../i18n/config';
import { sendMessage } from '../chat/chatService';

export interface Reflection {
  text: string;
  author: string;
  category: string;
  id?: number;
}

export async function generateReflection(category: string | null = null): Promise<Reflection | null> {
  const categoryPrompt = category ? `sobre ${category}` : 'motivacional para estudantes';
  const prompt = `Gere apenas UMA ÚNICA frase curta e inspiradora ${categoryPrompt} (uma linha apenas) e indique o autor (pode ser um pensador, cientista ou frase original sua como "PsyMind.AI"). Formato: "Frase" - Autor`;
  
  const result = await sendMessage(prompt, []);
  
  if (result.success) {
    const text = result.text.replace(/["\"\"]/g, '').replace(/\n/g, ' ').trim();
    const parts = text.split(' - ');
    return {
      text: parts[0] || text,
      author: parts[1] || 'PsyMind.AI',
      category: category || 'geral'
    };
  }
  
  return null;
}

export async function generateReflectionAnalysis(reflection: Reflection): Promise<string> {
  const prompt = `Sobre a frase "${reflection.text}" de ${reflection.author}, escreva uma breve reflexão (2-3 frases) de como um estudante pode aplicar isso no dia a dia.`;
  
  const result = await sendMessage(prompt, []);
  return result.success ? result.text : (result.userMessage || String(i18n.t('api.errors.service_fallback')));
}
