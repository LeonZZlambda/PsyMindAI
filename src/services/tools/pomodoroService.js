import { sendMessage } from '../chat/chatService';

export async function generatePomodoroTip(mode) {
  const prompts = {
    focus: 'Dê uma dica rápida e prática (1 frase) para um estudante manter o foco durante uma sessão Pomodoro de estudo.',
    short: 'Dê uma sugestão rápida (1 frase) de atividade relaxante para um estudante fazer durante uma pausa curta de 5 minutos.',
    long: 'Dê uma sugestão rápida (1 frase) de atividade relaxante para um estudante fazer durante uma pausa longa de 15 minutos.'
  };

  const result = await sendMessage(prompts[mode] || prompts.focus, []);
  return result.success ? result.text : result.userMessage || '⚠️ Não foi possível gerar dica no momento.';
}
