import i18n from '../../i18n/config';
import { sendMessage } from '../chat/chatService';

export interface MoodEntry {
  mood: {
    label: string;
    [key: string]: any;
  };
  intensity: number;
  emotions: string[];
  notes: string;
  timestamp: string;
}

export async function generateMoodInsight(moodHistory: MoodEntry[]): Promise<string> {
  if (moodHistory.length === 0) return '';

  const recentMoods = moodHistory.slice(-5).map(e => e.mood.label).join(', ');
  const prompt = `Baseado nos últimos registros emocionais de um estudante (${recentMoods}), dê uma breve reflexão empática (2-3 frases) e uma sugestão prática.`;
  
  const result = await sendMessage(prompt, []);
  return result.success ? result.text : (result.userMessage || String(i18n.t('api.errors.service_fallback')));
}
