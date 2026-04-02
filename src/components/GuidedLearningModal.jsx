import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { generateLearningTrail, explainQuizError, evaluateOpenEnded } from "../services/tools/learningService";
import "../styles/learning.css";
import "../styles/ai-learning.css";

const DEFAULT_TRAILS = [
  {
    id: 1,
    title: "Gestão de Ansiedade",
    icon: "psychology",
    description: "Aprenda a identificar e gerenciar sintomas de ansiedade.",
    content: [
      { type: "flashcard", front: "O que é o reflexo de 'Luta ou Fuga'?", back: "É uma reação fisiológica automática do corpo a eventos percebidos como ameaçadores ou estressantes, ativando o sistema nervoso simpático." },
      { type: "quiz", question: "Qual a técnica de respiração mais recomendada para reduzir a ansiedade aguda?", options: [{id:"A", text:"Respiração torácica rápida"}, {id:"B", text:"Prender a respiração por 1 minuto"}, {id:"C", text:"Respiração Diafragmática (4-7-8)"}, {id:"D", text:"Hiperventilação"}], correctOption: "C" },
      { type: "flashcard", front: "Aterramento (Grounding)", back: "Ato de trazer sua atenção para o momento presente, focando nos sentidos físicos (ex: 5 coisas que você vê, 4 que toca)." }
    ]
  },
  {
    id: 2, 
    title: "Comunicação Não-Violenta",
    icon: "forum",
    description: "Melhore seus relacionamentos se comunicando de forma empática.",
    content: [
      { type: "flashcard", front: "Quais são os 4 componentes da CNV?", back: "1. Observação, 2. Sentimento, 3. Necessidade, 4. Pedido." },
      { type: "quiz", question: "Qual destas frases é um exemplo de 'Observação' (sem julgamento) na CNV?", options: [{id:"A", text:"Você é muito irresponsável."}, {id:"B", text:"Você nunca me escuta."}, {id:"C", text:"Percebi que você chegou 10 minutos atrasado nas últimas reuniões."}, {id:"D", text:"Você é sempre preguiçoso."}], correctOption: "C" }
    ]
  },
  {
    id: 3, 
    title: "Inteligência Emocional",
    icon: "favorite",
    description: "Reconheça e controle as suas próprias emoções.",
    content: [
      { type: "flashcard", front: "O que é Autoconsciência?", back: "Habilidade de reconhecer e entender seus próprios humores, emoções e impulsos." },
      { type: "quiz", question: "Um pilar chave da inteligência emocional no ambiente de trabalho é:", options: [{id:"A", text:"Esconder o que você sente."}, {id:"B", text:"Empatia por colegas."}, {id:"C", text:"Trabalhar até a exaustão."}, {id:"D", text:"Falar mais alto que os outros."}], correctOption: "B" }
    ]
  },
  {
    id: 4, 
    title: "Mindfulness e Foco",
    icon: "self_improvement",
    description: "Técnicas de atenção plena para manter o foco no presente.",
    content: [
      { type: "flashcard", front: "O que é Atenção Plena (Mindfulness)?", back: "Estado mental alcançado focando a consciência no momento presente, reconhecendo e aceitando sentimentos." },
      { type: "quiz", question: "Ao se distrair durante uma meditação, você deve:", options: [{id:"A", text:"Ficar frustrado com você mesmo."}, {id:"B", text:"Desistir e tentar outro dia."}, {id:"C", text:"Notar a distração e gentilmente voltar o foco à respiração."}, {id:"D", text:"Deixar sua mente vagar indefinidamente."}], correctOption: "C" }
    ]
  },
  {
    id: 5, 
    title: "Vieses Cognitivos",
    icon: "visibility",
    description: "Entenda os erros de pensamento que afetam nossas decisões.",
    content: [
      { type: "flashcard", front: "Viés de Confirmação", back: "A tendência de procurar e lembrar de informações que confirmem crenças pré-existentes." },
      { type: "quiz", question: "O que é o Efeito Dunning-Kruger?", options: [{id:"A", text:"Superestimar a própria habilidade em tarefas onde se tem pouca experiência."}, {id:"B", text:"Pânico ao falar em público."}, {id:"C", text:"Hábito de comprar coisas em promoção."}, {id:"D", text:"Esquecer informações sob estresse."}], correctOption: "A" }
    ]
  },
  {
    id: 6,
    title: "Organização nos Estudos",
    icon: "menu_book",
    description: "Técnicas de gestão de tempo e planejamento escolar.",
    content: [
      { type: "flashcard", front: "O que é o Método Pomodoro?", back: "Técnica de gestão de tempo que alterna blocos de foco intenso (ex: 25 min) com pausas curtas (ex: 5 min) para manter a produtividade." },
      { type: "quiz", question: "Qual a melhor forma de se preparar para uma semana com várias provas?", options: [{id:"A", text:"Estudar tudo na noite anterior da prova."}, {id:"B", text:"Criar um cronograma distribuindo as matérias ao longo da semana."}, {id:"C", text:"Estudar apenas a matéria mais difícil."}, {id:"D", text:"Não estudar e confiar apenas no que lembra das aulas."}], correctOption: "B" }
    ]
  },
  {
    id: 7,
    title: "Pressão Escolar e Exames",
    icon: "school",
    description: "Estratégias para manejar o nervosismo pré-prova e evitar o 'branco' ao estudar.",
    content: [
      { type: "flashcard", front: "O que causa o famoso 'branco' na hora da prova?", back: "O 'branco' geralmente é causado por um pico de ansiedade. O cérebro entende a prova como uma ameaça imediata, bloqueando o acesso à memória." },
      { type: "quiz", question: "O que fazer se você sentir que vai ter um branco durante a prova?", options: [{id:"A", text:"Entrar em pânico silencioso."}, {id:"B", text:"Fazer uma pausa, fechar os olhos, respirar fundo e beber água se possível."}, {id:"C", text:"Responder qualquer coisa o mais rápido possível."}, {id:"D", text:"Chorar imediatamente."}], correctOption: "B" },
      { type: "flashcard", front: "Expectativas versus Realidade", back: "Muitas vezes a pressão vem da expectativa dos pais ou professores. Lembrar que uma nota ruim não define sua inteligência é fundamental para reduzir e lidar com essa cobrança excessiva." }
    ]
  }
];

export default function GuidedLearningModal({ isOpen, onClose }) {
  const [customTrails, setCustomTrails] = useState(() => {
    try {
      const saved = localStorage.getItem('psy_mind_custom_trails');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const trails = [...customTrails, ...DEFAULT_TRAILS];

  useEffect(() => {
    localStorage.setItem('psy_mind_custom_trails', JSON.stringify(customTrails));
  }, [customTrails]);

  const handleDeleteTrail = (e, trailId) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente remover esta trilha gerada pela IA?")) {
      setCustomTrails(prev => prev.filter(t => t.id !== trailId));
      if (selectedTrail && selectedTrail.id === trailId) {
        closeTrail();
      }
    }
  };

  const [activeTab, setActiveTab] = useState("trails");
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [trailStepIndex, setTrailStepIndex] = useState(0);

  // States for AI Creation
  const [isCreatingTrail, setIsCreatingTrail] = useState(false);
  const [newTrailTopic, setNewTrailTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [completedTrails, setCompletedTrails] = useState(() => {
    try {
      const saved = localStorage.getItem('psy_mind_completed_trails');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentTrailStats, setCurrentTrailStats] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    localStorage.setItem('psy_mind_completed_trails', JSON.stringify(completedTrails));
  }, [completedTrails]);

  // Generic states for tabs
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [genericQuizIndex, setGenericQuizIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  const [genericQuizStats, setGenericQuizStats] = useState({ correct: 0 });
  const [isGenericQuizFinished, setIsGenericQuizFinished] = useState(false);

  const [srsData, setSrsData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("psy_mind_srs_data")) || {}; }
    catch { return {}; }
  });
  const [aiExplanation, setAiExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [discursiveResp, setDiscursiveResp] = useState("");
  const [discursiveFeedback, setDiscursiveFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // SRS Filter for Flashcards Tab
  const now = Date.now();
  const ALL_FLASHCARDS = trails.filter(t => completedTrails[t.id]).flatMap(t => t.content.filter(c => c.type === "flashcard")).filter(f => !srsData[f.front] || srsData[f.front].nextReview <= now);
  const ALL_QUIZZES = trails.filter(t => completedTrails[t.id]).flatMap(t => t.content.filter(c => c.type === "quiz"));
  const currentGenericQuiz = ALL_QUIZZES[genericQuizIndex] || ALL_QUIZZES[0];

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleSrsAction = (flashcard, difficulty, isTrailMode) => {
    // difficulty: 0 (Errei), 1 (Difícil), 2 (Bom), 3 (Fácil)
    const intervals = [1000 * 60 * 1, 1000 * 60 * 60 * 12, 1000 * 60 * 60 * 24 * 3, 1000 * 60 * 60 * 24 * 7];
    const nextReview = Date.now() + intervals[difficulty];
    const newSrs = { ...srsData, [flashcard.front]: { nextReview, difficulty } };
    setSrsData(newSrs);
    localStorage.setItem("psy_mind_srs_data", JSON.stringify(newSrs));

    setIsFlipped(false);
    if (isTrailMode) nextTrailStep();
    else setCurrentFlashcard((prev) => (prev + 1) % Math.max(1, ALL_FLASHCARDS.length - 1 || 1));
  };
  const handleNextFlashcard = () => { setIsFlipped(false); setCurrentFlashcard((prev) => (prev + 1) % Math.max(1, ALL_FLASHCARDS.length)); };
  
  const currentStep = selectedTrail ? selectedTrail.content[trailStepIndex] : null;

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (selectedTrail && currentStep && currentStep.type === "quiz") {
       if (selectedOption === currentStep.correctOption) {
          setCurrentTrailStats(prev => ({ ...prev, correct: prev.correct + 1 }));
       }
    } else if (!isTrailActive) {
       if (selectedOption === currentGenericQuiz.correctOption) {
          setGenericQuizStats(prev => ({ ...prev, correct: prev.correct + 1 }));
       }
    }
  };
  
  const handleNextQuiz = () => { 
    setAiExplanation(null);
    setSelectedOption(null); 
    setQuizSubmitted(false); 
    if (genericQuizIndex < ALL_QUIZZES.length - 1) {
       setGenericQuizIndex(prev => prev + 1);
    } else {
       setIsGenericQuizFinished(true);
    }
  };

  const resetGenericQuiz = () => {
    setGenericQuizIndex(0);
    setGenericQuizStats({ correct: 0 });
    setIsGenericQuizFinished(false);
    setSelectedOption(null);
    setQuizSubmitted(false);
  };
  
  const isTrailActive = !!selectedTrail;

  const startTrail = (trail) => {
    setSelectedTrail(trail);
    setTrailStepIndex(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setCurrentTrailStats({ correct: 0, total: trail.content.filter(c => c.type === "quiz").length });
  };

  const closeTrail = () => {
    setSelectedTrail(null);
  };

  const handleExplainError = async (question, userResp, correctResp) => {
    setIsExplaining(true);
    const explanation = await explainQuizError(question, userResp, correctResp);
    setAiExplanation(explanation);
    setIsExplaining(false);
  };

  const nextTrailStep = () => {
    setAiExplanation(null);
    if (trailStepIndex < selectedTrail.content.length - 1) {
       setTrailStepIndex(prev => prev + 1);
       setIsFlipped(false);
       setSelectedOption(null);
       setQuizSubmitted(false);
    } else {
       setCompletedTrails(prev => ({
          ...prev,
          [selectedTrail.id]: { correct: currentTrailStats.correct, total: currentTrailStats.total }
       }));
       closeTrail();
    }
  };

  const handleImportTrail = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const newTrail = JSON.parse(text);
      if (newTrail && newTrail.id && newTrail.content) {
         setCustomTrails(prev => {
            const updated = [...prev, newTrail];
            localStorage.setItem("psy_mind_custom_trails", JSON.stringify(updated));
            return updated;
         });
         alert("Trilha importada com sucesso!");
      }
    } catch {
      alert("Erro ao importar. Copie um código JSON válido de trilha antes de importar.");
    }
  };

  const handleExportTrail = async (trail) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(trail));
      alert("Trilha copiada para área de transferência! Envie para seus amigos.");
    } catch {
      alert("Erro ao copiar a trilha.");
    }
  };

  const handleGenerateTrail = async () => {
    if (!newTrailTopic.trim()) return;
    setIsGenerating(true);
    try {
       const generatedTrail = await generateLearningTrail(newTrailTopic);
       if (generatedTrail && generatedTrail.content && generatedTrail.content.length > 0) {
          const mappedTrail = {
             ...generatedTrail,
             id: Date.now(),
             icon: generatedTrail.icon || "auto_awesome",
             content: generatedTrail.content.map(step => {
                if (step.type === "quiz" && Array.isArray(step.options)) {
                   if (typeof step.options[0] === 'string') {
                      const mappedOptions = step.options.map((opt, i) => ({ id: String.fromCharCode(65 + i), text: opt }));
                      const correctObj = mappedOptions.find(o => o.text === step.correctOption);
                      return { ...step, options: mappedOptions, correctOption: correctObj ? correctObj.id : "A" };
                   }
                }
                return step;
             }),
             isAiGenerated: true
          };
          setCustomTrails(prev => [mappedTrail, ...prev]);
          setIsGenerating(false);
          setIsCreatingTrail(false);
          setNewTrailTopic("");
          startTrail(mappedTrail);
       } else {
          alert("Não foi possível gerar a trilha. Tente ser mais específico no tema.");
          setIsGenerating(false);
       }
    } catch (e) {
       console.error("Erro gerando trilha:", e);
       alert("Erro ao conectar com a IA.");
       setIsGenerating(false);
    }
  };

  const handleEvaluateDiscursive = async (question, userResp) => {
    if (!userResp.trim()) return;
    setIsEvaluating(true);
    const feedback = await evaluateOpenEnded(question, userResp);
    setDiscursiveFeedback(feedback);
    setIsEvaluating(false);
  };

  const renderOpenEnded = (openEndedItem, isTrail = false) => {
    return (
      <div className="flashcard-container" style={{height: 'auto', minHeight: '300px'}}>
         <div className="flashcard">
            <div className="flashcard-front" style={{display: 'flex', flexDirection: 'column'}}>
               <span className="material-symbols-outlined watermark" style={{top: '10px', right: '10px'}}>edit_note</span>
               <h4 style={{marginBottom: '15px'}}>{openEndedItem.question}</h4>
               {openEndedItem.hint && <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '15px'}}>{openEndedItem.hint}</p>}
               
               {!discursiveFeedback ? (
                 <>
                   <textarea
                     className="ai-input"
                     rows="5"
                     placeholder="Escreva sua reflexão ou resposta aqui..."
                     value={discursiveResp}
                     onChange={(e) => setDiscursiveResp(e.target.value)}
                     disabled={isEvaluating}
                     style={{width: '100%', marginBottom: '15px', resize: 'none'}}
                   />
                   <div style={{display: 'flex', gap: '10px', width: '100%'}}>
                      <button className="primary-btn" style={{flex: 1, display: 'flex', justifyContent: 'center', gap: '8px'}} 
                         onClick={() => handleEvaluateDiscursive(openEndedItem.question, discursiveResp)} disabled={isEvaluating || !discursiveResp.trim()}>
                         <span className="material-symbols-outlined">rate_review</span>
                         {isEvaluating ? 'Avaliando...' : 'Avaliar Resposta com IA'}
                      </button>
               <button className="secondary-btn" onClick={isTrail ? nextTrailStep : null} style={{ height: 'auto', padding: '10px 15px' }}>
                  Pular
               </button>
                   </div>
                 </>
               ) : (
                 <div style={{textAlign: 'left', width: '100%'}}>
                   <p style={{marginBottom: '10px'}}><strong>Sua Resposta:</strong> <br/><span style={{color: 'var(--text-light)'}}>{discursiveResp}</span></p>
                   <div style={{ backgroundColor: 'var(--accent-light, rgba(34, 197, 94, 0.15))', padding: '15px', borderRadius: '12px', marginBottom: '15px', fontSize: '0.95rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                         <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-color)' }}>school</span>
                         Feedback da IA:
                      </div>
                      <div className="markdown-body">
                         <ReactMarkdown components={{ p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.5' }} {...props} /> }}>
                            {discursiveFeedback}
                         </ReactMarkdown>
                      </div>
                   </div>
                   <button className="primary-btn" onClick={isTrail ? nextTrailStep : null} style={{width: '100%'}}>
                      Continuar Trilha <span className="material-symbols-outlined">arrow_forward</span>
                   </button>
                 </div>
               )}
            </div>
         </div>
      </div>
    );
  };

  const renderQuiz = (quizItem, isTrail = false) => {
    return (
      <div className="quiz-card">
         <h4 className="quiz-question">{quizItem.question}</h4>
         <div className="quiz-options">
            {quizItem.options.map(opt => {
               const isSelected = selectedOption === opt.id;
               const isCorrect = opt.id === quizItem.correctOption;
               
               let className = "quiz-option";
               if (quizSubmitted) {
                  if (isCorrect) className += " correct";
                  else if (isSelected && !isCorrect) className += " wrong";
               } else {
                  if (isSelected) className += " selected";
               }

               return (
                  <button 
                     key={opt.id} 
                     className={className}
                     onClick={() => !quizSubmitted && setSelectedOption(opt.id)}
                     disabled={quizSubmitted}
                  >
                     <div className="option-letter">{opt.id}</div>
                     <span>{opt.text}</span>
                     {quizSubmitted && isCorrect && <span className="material-symbols-outlined result-icon">check_circle</span>}
                     {quizSubmitted && isSelected && !isCorrect && <span className="material-symbols-outlined result-icon">cancel</span>}
                  </button>
               );
            })}
         </div>

         {quizSubmitted && selectedOption !== quizItem.correctOption && (
            <div className="ai-explanation-box" style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
               {!aiExplanation ? (
                 <button className="secondary-btn" onClick={() => handleExplainError(quizItem.question, selectedOption, quizItem.correctOption)} disabled={isExplaining} style={{ width: '100%', height: 'auto', padding: '10px' }}>
                    <span className="material-symbols-outlined">auto_awesome</span> 
                    {isExplaining ? 'Gerando explicação...' : 'Me explique com IA ✨'}
                 </button>
               ) : (
                 <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: '1.5', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 'bold' }}>
                       <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-color)' }}>school</span>
                       Tutor IA:
                    </div>
                    <div className="markdown-body">
                       <ReactMarkdown components={{ p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0' }} {...props} /> }}>
                          {aiExplanation}
                       </ReactMarkdown>
                    </div>
                 </div>
               )}
            </div>
         )}
         
         <div className="quiz-footer" style={{ marginTop: '16px' }}>
            {!quizSubmitted ? (
               <button className="primary-btn" disabled={!selectedOption} onClick={handleQuizSubmit}>
                  Verificar Resposta
               </button>
            ) : (
               <button className="primary-btn" onClick={isTrail ? nextTrailStep : handleNextQuiz}>
                  {isTrail ? (
                     (trailStepIndex >= selectedTrail.content.length - 1) ? 
                        <><span className="material-symbols-outlined">done_all</span> Concluir Trilha</> : 
                        <><span className="material-symbols-outlined">arrow_forward</span> Próxima Questão</>
                  ) : (
                     (genericQuizIndex >= ALL_QUIZZES.length - 1) ? 
                        <><span className="material-symbols-outlined">done_all</span> Ver Resultados</> : 
                        <><span className="material-symbols-outlined">arrow_forward</span> Próxima Questão</>
                  )}
               </button>
            )}
         </div>
      </div>
    );
  };

  const renderFlashcardWrapper = (flashcardItem, isTrail = false) => {
    return (
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`} onClick={handleFlip}>
         <div className="flashcard-inner">
            <div className="flashcard-front">
               <span className="material-symbols-outlined watermark">help_outline</span>
               <p>{flashcardItem.front}</p>
               <span className="flip-hint">Clique para revelar</span>
            </div>
            <div className="flashcard-back">
               <span className="material-symbols-outlined watermark">lightbulb</span>
               <p>{flashcardItem.back}</p>
               <div className="flashcard-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="difficulty-btn" style={{backgroundColor: '#FFE5E5', color: '#D32F2F', borderColor: '#D32F2F'}} onClick={() => handleSrsAction(flashcardItem, 0, isTrail)}>Errei <br/><span style={{fontSize:'0.65rem'}}>1 min</span></button>
                  <button className="difficulty-btn" style={{backgroundColor: '#FFF4E5', color: '#F57C00', borderColor: '#F57C00'}} onClick={() => handleSrsAction(flashcardItem, 1, isTrail)}>Difícil <br/><span style={{fontSize:'0.65rem'}}>12h</span></button>
                  <button className="difficulty-btn medium" style={{backgroundColor: '#E8F5E9', color: '#388E3C', borderColor: '#388E3C'}} onClick={() => handleSrsAction(flashcardItem, 2, isTrail)}>Bom <br/><span style={{fontSize:'0.65rem'}}>3 dias</span></button>
                  <button className="difficulty-btn easy" style={{backgroundColor: '#E3F2FD', color: '#1B5E20', borderColor: '#1B5E20'}} onClick={() => handleSrsAction(flashcardItem, 3, isTrail)}>Fácil <br/><span style={{fontSize:'0.65rem'}}>7 dias</span></button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="learning-modal-overlay" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="learning-modal" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
             <div className="learning-header">
                <h2><span className="material-symbols-outlined learning-header-icon">school</span> Aprendizado Guiado</h2>
                <button className="close-btn" onClick={onClose} aria-label="Fechar"><span className="material-symbols-outlined">close</span></button>
             </div>

             {selectedTrail ? (
                <div className="learning-content" style={{ display: 'flex', flexDirection: 'column' }}>
                   <div className="trails-header" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      <div>
                     <button className="icon-btn" onClick={closeTrail} style={{ background: 'transparent', margin: '0 0 10px 0', padding: 0, justifyContent: 'flex-start', width: 'auto'}}>
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>arrow_back</span> Voltar para Trilhas
                     </button>
                     <h3>
                        {selectedTrail.icon && <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary-color)'}}>{selectedTrail.icon}</span>} 
                        {selectedTrail.title}
                     </h3>
                     <p style={{ margin: '8px 0 0 0', color: 'var(--text-light)', fontSize: '0.9rem'}}>{selectedTrail.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                     <span style={{ color: "var(--text-light)", fontSize: '0.9rem', marginBottom: '8px' }}>Passo {trailStepIndex + 1} de {selectedTrail.content.length}</span>
                     <div className="trail-progress-bar" style={{ width: '100px', margin: 0 }}>
                        <div className="trail-progress-fill" style={{ width: `${((trailStepIndex) / selectedTrail.content.length) * 100}%` }}></div>
                     </div>
                  </div>
               </div>

               <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <AnimatePresence mode="wait">
                     <motion.div key={trailStepIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        {currentStep?.type === "open_ended" ? renderOpenEnded(currentStep, true) : currentStep?.type === "flashcard" ? renderFlashcardWrapper(currentStep, true) : renderQuiz(currentStep, true)}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>
         ) : (
            <>
               <div className="learning-tabs">
                  <button className={`learning-tab ${activeTab === "trails" ? "active" : ""}`} onClick={() => setActiveTab("trails")}>
                     <span className="material-symbols-outlined">route</span> Planos de Estudo
                  </button>
                  <button className={`learning-tab ${activeTab === "flashcards" ? "active" : ""}`} onClick={() => setActiveTab("flashcards")}>
                     <span className="material-symbols-outlined">style</span> Praticar Flashcards
                  </button>
                  <button className={`learning-tab ${activeTab === "quizzes" ? "active" : ""}`} onClick={() => setActiveTab("quizzes")}>
                     <span className="material-symbols-outlined">quiz</span> Quiz Aleatório
                  </button>
               </div>

               <div className="learning-content">
                  <AnimatePresence mode="wait">
                     {activeTab === "trails" && (
                        <motion.div key="trails" className="learning-tab-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                           
                           <AnimatePresence mode="wait">
                              {isCreatingTrail ? (
                                 <motion.div key="ai-create" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="ai-create-container">
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                       <h3 style={{margin: 0, color: 'var(--text-color)'}}>O que você deseja aprender hoje?</h3>
                                       <button className="icon-btn" onClick={() => setIsCreatingTrail(false)}><span className="material-symbols-outlined">close</span></button>
                                    </div>
                                    <p style={{color: 'var(--text-light)', marginTop: 0}}>
                                       Descreva um tema, desafio emocional ou habilidade. Nossa inteligência artificial construirá um plano interativo (Flashcards e Quizzes) personalizado.
                                    </p>
                                    <textarea 
                                       className="ai-input" 
                                       rows="4" 
                                       placeholder="Ex: Quero uma trilha com flashcards sobre como praticar mindfulness no trabalho em 5 minutos..."
                                       value={newTrailTopic}
                                       onChange={(e) => setNewTrailTopic(e.target.value)}
                                    />
                                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                       <button className="ai-magic-btn" disabled={!newTrailTopic.trim() || isGenerating} onClick={handleGenerateTrail}>
                                          {isGenerating ? <span className="material-symbols-outlined spin-anim">sync</span> : <span className="material-symbols-outlined">auto_awesome</span>} 
                                          {isGenerating ? "Gerando Material..." : "Criar com IA"}
                                       </button>
                                    </div>
                                 </motion.div>
                              ) : (
                                 <motion.div key="trails-grid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                                    <div className="trails-header" style={{ paddingBottom: '16px' }}>
                                       <h3>Explore Trilhas ou Crie a Sua</h3>
                                       <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto', justifyContent: 'center' }}>
                                          <button className="secondary-btn" onClick={handleImportTrail}>
                                             <span className="material-symbols-outlined">download</span> Importar
                                          </button>
                                          <button className="ai-magic-btn" onClick={() => setIsCreatingTrail(true)}>
                                             <span className="material-symbols-outlined">auto_awesome</span> Gerar com IA
                                          </button>
                                       </div>
                                    </div>
                                    <div className="trails-grid">
                                       {trails.map(trail => {
                                          const score = completedTrails[trail.id];
                                          return (
                                             <div key={trail.id} className="trail-card" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => startTrail(trail)}>
                                                <div className="trail-card-icon"><span className="material-symbols-outlined">{trail.icon}</span></div>
                                                <div className="trail-card-info" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                                   <h4>{trail.title}</h4>
                                                   <p style={{marginBottom: '10px', fontSize: '0.8rem', flex: 1}}>{trail.description}</p>
                                                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                                                      <p style={{ fontWeight: 600, color: 'var(--primary-color)', margin: 0, fontSize: '0.85rem' }}>{trail.content.length} Atividades</p>
                                                      {score && (
                                                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--accent-light, rgba(34, 197, 94, 0.15))', color: 'var(--accent-color, #16a34a)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
                                                            {score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}%` : 'Concluída'}
                                                         </div>
                                                      )}
                                                   </div>
                                                </div>
                                                {trail.isAiGenerated ? (
                                                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                      <button className="icon-btn" aria-label="Iniciar trilha"><span className="material-symbols-outlined">play_arrow</span></button>
                                                      <button className="icon-btn" onClick={(e) => { e.stopPropagation(); handleExportTrail(trail); }} aria-label="Exportar trilha" style={{ color: 'var(--primary-color)' }}><span className="material-symbols-outlined">ios_share</span></button>
                                                      <button className="icon-btn" onClick={(e) => handleDeleteTrail(e, trail.id)} aria-label="Excluir trilha" style={{ color: 'var(--error-color, #ef4444)' }}><span className="material-symbols-outlined">delete</span></button>
                                                   </div>
                                                ) : (
                                                   <button className="icon-btn" aria-label="Iniciar trilha"><span className="material-symbols-outlined">play_arrow</span></button>
                                                )}
                                             </div>
                                          );
                                       })}
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </motion.div>
                     )}

                     {activeTab === "flashcards" && (
                        <motion.div key="flashcards" className="learning-tab-content flashcards-container" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                           <div className="flashcards-header">
                              <h3>Praticar Flashcards</h3>
                           </div>
                           {ALL_FLASHCARDS.length > 0 ? (
                              <>
                                 <span style={{ display: "block", color: "var(--text-light)", marginBottom: "16px" }}>
                                    {currentFlashcard + 1} / {ALL_FLASHCARDS.length} (Flashcards desbloqueados)
                                 </span>
                                 {renderFlashcardWrapper(
                                    ALL_FLASHCARDS[currentFlashcard % ALL_FLASHCARDS.length], false
                                 )}
                              </>
                           ) : (
                              <div className="quiz-card" style={{ textAlign: "center", padding: "40px 20px" }}>
                                 <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--text-light)", marginBottom: "16px" }}>lock</span>
                                 <h4 style={{ fontSize: "1.2rem", color: "var(--text-color)", marginBottom: "8px" }}>Nenhum Flashcard Desbloqueado</h4>
                                 <p style={{ color: "var(--text-light)" }}>Complete uma Trilha de Estudo na aba "Planos de Estudo" para desbloquear os flashcards para revisão.</p>
                              </div>
                           )}
                        </motion.div>
                     )}

                     {activeTab === "quizzes" && (
                        <motion.div key="quizzes" className="learning-tab-content quizzes-container" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                           <div className="quizzes-header">
                              <h3>Quiz Rápido Geral</h3>
                           </div>
                           {ALL_QUIZZES.length > 0 ? (
                              <>
                                 <span style={{ display: "block", color: "var(--text-light)", marginBottom: "16px", textAlign: "right" }}>
                                    {isGenericQuizFinished ? ALL_QUIZZES.length : genericQuizIndex + 1} / {ALL_QUIZZES.length} (Quizzes desbloqueados)
                                 </span>
                                 {isGenericQuizFinished ? (
                                    <div className="quiz-card" style={{ textAlign: "center", padding: "40px 20px" }}>
                                       <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "var(--primary-color)", marginBottom: "16px" }}>emoji_events</span>
                                       <h4 style={{ fontSize: "1.5rem", marginBottom: "8px", color: "var(--text-color)" }}>Quizzes Concluídos!</h4>
                                       <p style={{ fontSize: "1rem", color: "var(--text-light)", marginBottom: "24px" }}>
                                          Você respondeu corretamente a <strong>{genericQuizStats.correct}</strong> de <strong>{ALL_QUIZZES.length}</strong> questões ({Math.round((genericQuizStats.correct / ALL_QUIZZES.length) * 100)}%).
                                       </p>
                                       <button className="primary-btn" onClick={resetGenericQuiz} style={{ margin: "0 auto" }}>
                                          <span className="material-symbols-outlined">refresh</span> Tentar Novamente
                                       </button>
                                    </div>
                                 ) : (
                                    renderQuiz(currentGenericQuiz, false)
                                 )}
                              </>
                           ) : (
                              <div className="quiz-card" style={{ textAlign: "center", padding: "40px 20px" }}>
                                 <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--text-light)", marginBottom: "16px" }}>lock</span>
                                 <h4 style={{ fontSize: "1.2rem", color: "var(--text-color)", marginBottom: "8px" }}>Nenhum Quiz Desbloqueado</h4>
                                 <p style={{ color: "var(--text-light)" }}>Complete uma Trilha de Estudo na aba "Planos de Estudo" para desbloquear quizzes para praticar.</p>
                              </div>
                           )}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </>
         )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}