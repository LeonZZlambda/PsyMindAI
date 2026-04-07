const fs = require('fs');

let content = fs.readFileSync('src/services/prompts/systemPrompts.js', 'utf-8');

const injection = `
      // Modos de Resposta
      if (userProfile.responseMode) {
        basePrompt += \`\n\n=== PERFIL DE RESPOSTA ATIVO ===\n\`;
        switch(userProfile.responseMode) {
          case 'reflective':
            basePrompt += \`- MODO REFLEXIVO: Foque em análise emocional profunda e explique os fundamentos psicológicos por trás do que o estudante está sentindo. Faça perguntas que o levem à autorreflexão profunda ao invés de apenas dar a solução.\n\`;
            break;
          case 'action':
            basePrompt += \`- MODO DE AÇÃO: Seja direto ao ponto. Foque em soluções imediatas e práticas. Ofereça passos claros, acionáveis e estruturados. Menos teoria, mais execução.\n\`;
            break;
          case 'learning':
            basePrompt += \`- MODO DIDÁTICO (LEARNING): Seja como um tutor paciente. Exija esforço cognitivo do usuário. Dê explicações didáticas usando analogias fáceis do dia a dia, foque na progressão do aprendizado e no crescimento gradual.\n\`;
            break;
          case 'support':
            basePrompt += \`- MODO DE ACOLHIMENTO: Foque na validação emocional do estudante. Use linguagem ainda mais leve, afetuosa e empática. Sua prioridade é fazer a pessoa se sentir compreendida, segura e não julgada antes de propor qualquer solução.\n\`;
            break;
          default:
            basePrompt += \`- MODO PADRÃO: Postura equilibrada, oferecendo um misto de apoio emocional leve e soluções graduais, mantendo-se adaptável ao que o estudante precisar.\n\`;
            break;
        }
      }
`;

content = content.replace(
  'basePrompt += `\\n\\n=== INSTRUÇÕES AVANÇADAS DO USUÁRIO ===\\n`;',
  injection + '\n      basePrompt += `\\n\\n=== AJUSTES FINOS MANUAIS ===\\n`;'
);

fs.writeFileSync('src/services/prompts/systemPrompts.js', content);
