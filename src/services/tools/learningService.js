import { sendMessage } from '../chat/chatService';

export async function explainQuizError(question, userResponse, correctAnswer) {
  const prompt = `Atue como um tutor objetivo. O aluno errou a seguinte questão de múltipla escolha:
Pergunta: "${question}"
Resposta correta: "${correctAnswer}"
Resposta do aluno (errada): "${userResponse}"

Explique de forma direta e extremamente enxuta apenas a diferença central: por que a certa é a certa e a do aluno é errada. Em no máximo 3 ou 4 frases. Formate usando Markdown básico (negritos para destacar). Sem textões, vá direto ao ponto.`;

  const response = await sendMessage(prompt, []);
  if (response && response.success) {
    return response.text.trim();
  }
  return "Desculpe, não consegui carregar a explicação agora. Continue estudando!";
}

export async function evaluateOpenEnded(question, userResponse) {
  const prompt = `Atue como um professor objetivo. Avalie a resposta do aluno para a seguinte questão:
Pergunta: "${question}"
Resposta do aluno: "${userResponse}"

Dê um feedback claro e extremamente direto usando Markdown básico (ex: **Pontos Fortes:** e **Para melhorar:**). Mantenha em no máximo 2 a 3 frases. Seja encorajador, mas sem rodeios.`;

  const response = await sendMessage(prompt, []);
  if (response && response.success) {
    return response.text.trim();
  }
  return "Feedback: Resposta gravada! Infelizmente, o tutor IA não está disponível agora para avaliar.";
}

export async function generateLearningTrail(topic) {
  const prompt = `Gere uma trilha de aprendizado guiado e interativo sobre o tema "${topic}".
Sua resposta deve ser estritamente um código JSON válido. Não inclua texto extra, markdown, etc.
O objeto raiz deve ter este formato:
{
  "id": "ai_trail_${Date.now()}",
  "title": "Um título curto para a trilha",
  "description": "Breve descrição focada no aprendizado",
  "theme": "purple",
  "icon": "🧠",
  "content": [
    {
      "type": "flashcard",
      "front": "Pergunta ou conceito (frente)",
      "back": "Explicação (verso)"
    },
    {
      "type": "quiz",
      "question": "Pergunta Múltipla Escolha",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correctOption": "Opção A"
    },
    {
      "type": "open_ended",
      "question": "Pergunta Dissertativa (Ex: Como você aplicaria X na sua vida?)",
      "hint": "Cenário curto para orientar a resposta"
    }
  ]
}

Requisitos adicionais:
1. Inclua 5 a 7 itens em "content" misturando flashcards, quizzes e pelo menos 1 open_ended.
2. Certifique-se que valid JSON é retornado sem usar blocos de código tipo \`\`\`json.
3. O theme pode ser um dentre: purple, green, yellow, pink, blue.
`;

  const response = await sendMessage(prompt, []);
  
  if (response && response.success) {
    let jsonContent = response.text.trim();
    // Limpeza de possíveis formatações (caso a IA ainda envie markdown)
    if (jsonContent.startsWith('```json')) jsonContent = jsonContent.slice(7).trim();
    if (jsonContent.startsWith('```')) jsonContent = jsonContent.slice(3).trim();
    if (jsonContent.endsWith('```')) jsonContent = jsonContent.slice(0, -3).trim();

    try {
      const trailData = JSON.parse(jsonContent);
      // Validar estrutura principal
      if (!trailData.id) trailData.id = `ai_trail_${Date.now()}`;
      if (!trailData.content || !Array.isArray(trailData.content)) {
        throw new Error('Conteúdo inválido recebido da IA.');
      }
      return trailData;
    } catch (e) {
      console.error('Falha ao parsear JSON retornado pela IA:', e, jsonContent);
      return null;
    }
  }

  return null;
}
