import { sendMessage } from '../chat/chatService';

export async function generateMoodInsight(moodHistory) {
  if (moodHistory.length === 0) return '';

  const recentMoods = moodHistory.slice(-5).map(e => e.mood.label).join(', ');
  const prompt = `Baseado nos últimos registros emocionais de um estudante (${recentMoods}), dê uma breve reflexão empática (2-3 frases) e uma sugestão prática.`;
  
  const result = await sendMessage(prompt, []);
  return result.success ? result.text : result.userMessage || '⚠️ Não foi possível gerar análise no momento.';
}
