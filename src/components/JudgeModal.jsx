import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from '../services/chat/chatService';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import '../styles/judge.css';

const JudgeModal = ({ isOpen, onClose, config }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [challengeText, setChallengeText] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('C++');
  const [result, setResult] = useState('');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setChallengeText('');
      setCode('');
      setResult('');
    }, 300);
  };

  useEffect(() => {
    if (isOpen && config && !challengeText) {
      generateChallenge();
    }
  }, [isOpen, config, challengeText]);

  const generateChallenge = async () => {
    setLoading(true);
    const { subject, examName, topics } = config;
    
    const prompt = `Atue EXCLUSIVAMENTE como um Juiz Automático da OBI (Olimpíada Brasileira de Informática). Não dê conselhos de saúde mental. Aja apenas como um gerador de problemas de programação competitiva.
    
Desafio: Crie um problema INÉDITO de programação competitiva aplicável para a seletiva de ${subject || 'Programação'} do ${examName || 'OBI'}, focando em: ${(topics || []).join(', ')}.

Estrutura obrigatória em Markdown:
## 🏆 Nome do Problema Inédito
**Descrição:** (Uma historinha)
**A Tarefa:** O que o competidor tem que fazer.
**Entrada:** (Formato da entrada real)
**Saída:** (Formato da saída esperada com quebra de linha)
**Exemplos:** (Pelo menos dois casos reais de stdin/stdout)
**Restrições e Pontuação:** (Limites de variáveis e complexidade computacional para atingir 100 pontos).
`;

    try {
      const res = await sendMessage(prompt, []);
      if (res.success) {
        setChallengeText(res.text);
      } else {
        setChallengeText("Falha ao gerar o desafio. Tente novamente.");
      }
    } catch {
      setChallengeText("Erro interno.");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async () => {
    if (!code.trim()) return;
    setEvaluating(true);
    
    const prompt = `Atue EXCLUSIVAMENTE como Corretor Automático de Maratona. Avalie rigorosamente a seguinte submissão em ${language}.
    
[DESAFIO]
${challengeText}

[CÓDIGO DO ALUNO]
\`\`\`${language.toLowerCase()}
${code}
\`\`\`

Instruções para a Avaliação (Responda em Markdown claro):
1. **Compilação**: Avalie mentalmente se o código compila corretamente (sintaxe).
2. **Bateria de Testes Secrtos**: Simule testes mentais, com casos borda.
3. **Complexidade**: Analise estruturalmente a notação Big-O do Tempo e Espaço.
4. **Veredito Oficial**: Dê um Veredito final em caixa alta bem visível: ACCEPTED ✅, WRONG ANSWER ❌, TIME LIMIT EXCEEDED ⏳, RUNTIME ERROR 💥 ou COMPILATION ERROR 🚨.
5. **Score**: Atribua nota de 0 a 100.
6. Dê feedback do porquê, aponte a linha onde pode estar errado, ou recomende otimizações. Seja justo e crítico como um juiz.
`;

    try {
      const res = await sendMessage(prompt, []);
      if (res.success) {
        setResult(res.text);
      } else {
        setResult("Falha na avaliação.");
      }
    } catch {
      setResult("Erro ao submeter ao juiz.");
    } finally {
      setEvaluating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="judge-modal">
        <div className="modal-header" style={{borderBottom: '1px solid var(--border-color)', marginBottom: 0}}>
          <h2>
            <span className="material-symbols-outlined" style={{verticalAlign: 'middle', marginRight: '8px'}}>terminal</span>
            Modo Juiz - Preparatório
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="judge-body">
          <div className="col-left">
            {loading ? (
              <div className="eval-loading">
                <span className="material-symbols-outlined rotating">autorenew</span>
                <p>Formulando desafio inédito para você...</p>
              </div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown>{challengeText}</ReactMarkdown>
              </div>
            )}
          </div>
          
          <div className="col-right">
            <div className="code-header">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
              </select>
              <button 
                className="run-btn" 
                onClick={submitCode}
                disabled={evaluating || loading || !code.trim()}
              >
                <span className="material-symbols-outlined" style={{fontSize: '18px'}}>play_arrow</span>
                Submeter
              </button>
            </div>
            
            <div className="code-editor-container">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => {
                  let grammar = Prism.languages.javascript;
                  let langKey = 'javascript';
                  
                  if (language === 'C') { grammar = Prism.languages.c; langKey = 'c'; }
                  else if (language === 'C++') { grammar = Prism.languages.cpp; langKey = 'cpp'; }
                  else if (language === 'Python') { grammar = Prism.languages.python; langKey = 'python'; }
                  else if (language === 'Java') { grammar = Prism.languages.java; langKey = 'java'; }

                  return Prism.highlight(code, grammar, langKey);
                }}
                padding={16}
                className="code-editor"
                placeholder={`Escreva seu código fonte em ${language} aqui...\n\n// Lembre-se de ler todos os inputs (scanf/cin/input) e imprimir as respostas formatadas (printf/cout/print).`}
                style={{
                  fontFamily: '"Fira Code", monospace, "SFMono-Regular", Consolas, "Liberation Mono", Menlo',
                  fontSize: 14,
                  minHeight: '100%',
                  outline: 'none'
                }}
              />
            </div>

            {(result || evaluating) && (
              <div className="evaluation-panel">
                {evaluating ? (
                  <div className="eval-loading">
                    <span className="material-symbols-outlined rotating">hourglass_empty</span>
                    <p>O Juiz está executando os casos de teste secreto na nuvem...</p>
                  </div>
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeModal;
