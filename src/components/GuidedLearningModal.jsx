import React, { useState, useEffect, useMemo } from "react";
import { useTranslation, Trans } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { generateLearningTrail, explainQuizError, evaluateOpenEnded } from "../services/tools/learningService";
import "../styles/learning.css";
import "../styles/ai-learning.css";



export default function GuidedLearningModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const DEFAULT_TRAILS = t("guided_learning.default_trails", { returnObjects: true }) || [];
  const [customTrails, setCustomTrails] = useState(() => {
    try {
      const saved = localStorage.getItem('psy_mind_custom_trails');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const trails = useMemo(() => [...customTrails, ...DEFAULT_TRAILS], [customTrails]);

  useEffect(() => {
    localStorage.setItem('psy_mind_custom_trails', JSON.stringify(customTrails));
  }, [customTrails]);

  const handleDeleteTrail = (e, trailId) => {
    e.stopPropagation();
    if (window.confirm(t("guided_learning.alerts.delete_confirm"))) {
      setCustomTrails(prev => prev.filter(t => t.id !== trailId));
      if (selectedTrail && selectedTrail.id === trailId) {
        closeTrail();
      }
    }
  };

  const [activeTab, setActiveTab] = useState("trails");
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [activeTrailContent, setActiveTrailContent] = useState(null);
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
  const [isTrailFinished, setIsTrailFinished] = useState(false);

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
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  // Flashcards that are due or haven't been reviewed
  const baseFlashcards = trails.filter(t => completedTrails[t.id]).flatMap(t => t.content.filter(c => c.type === "flashcard"));
  
  const [sessionFailedFlashcards, setSessionFailedFlashcards] = useState([]);
  
  // ALL_FLASHCARDS merges due flashcards and any that failed in this session but haven't been re-answered correctly
  const ALL_FLASHCARDS = [...new Set([...baseFlashcards.filter(f => !srsData[f.front] || srsData[f.front].nextReview <= now), ...sessionFailedFlashcards])];

  const [sessionFailedQuizzes, setSessionFailedQuizzes] = useState([]);
  
  const baseQuizzes = useMemo(() => {
    const pool = trails.filter(t => completedTrails[t.id]).flatMap(t => t.content.filter(c => c.type === "quiz"));
    if (pool.length === 0) return [];

    // Fisher-Yates pra ordem real das questões sem alterar os originais do 'trails'
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      // eslint-disable-next-line react-hooks/purity
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Adiciona algumas questões duplicadas aleatoriamente
    if (shuffled.length >= 3) {
      // eslint-disable-next-line react-hooks/purity
      const dupCount = Math.floor(Math.random() * 3) + 1;
      for (let k = 0; k < dupCount; k++) {
         // eslint-disable-next-line react-hooks/purity
         const randomPoolItem = pool[Math.floor(Math.random() * pool.length)];
         // eslint-disable-next-line react-hooks/purity
         shuffled.splice(Math.floor(Math.random() * shuffled.length), 0, randomPoolItem);
      }
    }

    return shuffled.map((q, idx) => {
        const correctText = q.options.find(o => o.id === q.correctOption)?.text;
        
        // Deep copy das opções para não mutar o objeto de trails original
        const opts = q.options.map(o => ({ ...o }));
        for (let i = opts.length - 1; i > 0; i--) {
            // eslint-disable-next-line react-hooks/purity
            const j = Math.floor(Math.random() * (i + 1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
         }
         
         const ids = ["A", "B", "C", "D", "E", "F"];
         let newCorrectID = "A";
         opts.forEach((o, i) => {
            if (o.text === correctText) newCorrectID = ids[i];
            o.id = ids[i];
         });

         return {
            ...q,
            // eslint-disable-next-line react-hooks/purity
            _uid: `quiz_${idx}_${crypto.randomUUID()}`, // UID para React renderizar
           options: opts,
           correctOption: newCorrectID
        };
    });
  }, [completedTrails, trails]);

  const ALL_QUIZZES = [...baseQuizzes, ...sessionFailedQuizzes];
  
  const currentGenericQuiz = ALL_QUIZZES[genericQuizIndex] || ALL_QUIZZES[0];

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleSrsAction = (flashcard, difficulty, isTrailMode) => {
    // difficulty: 0 (Errei), 1 (Difícil), 2 (Bom), 3 (Fácil)
    const intervals = [1000 * 30, 1000 * 60 * 5, 1000 * 60 * 30, 1000 * 60 * 60 * 2]; // Reduced intervals: 30s, 5m, 30m, 2h
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const nextReview = now + intervals[difficulty];
    const newSrs = { ...srsData, [flashcard.front]: { nextReview, difficulty } };
    setSrsData(newSrs);
    localStorage.setItem("psy_mind_srs_data", JSON.stringify(newSrs));

    if (difficulty === 0) {
      if (!sessionFailedFlashcards.find(f => f.front === flashcard.front)) {
         setSessionFailedFlashcards(prev => [...prev, flashcard]);
      }
    } else {
      setSessionFailedFlashcards(prev => prev.filter(f => f.front !== flashcard.front));
    }

    setIsFlipped(false);
    if (isTrailMode) nextTrailStep();
    else setCurrentFlashcard((prev) => (prev + 1) % Math.max(1, ALL_FLASHCARDS.length - 1 || 1));
  };
  // const handleNextFlashcard = () => { setIsFlipped(false); setCurrentFlashcard((prev) => (prev + 1) % Math.max(1, ALL_FLASHCARDS.length)); };
  
  const currentStep = activeTrailContent ? activeTrailContent[trailStepIndex] : null;

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (activeTrailContent && currentStep && currentStep.type === "quiz") {
       if (selectedOption === currentStep.correctOption) {
          if (!currentStep.isRetry) {
             setCurrentTrailStats(prev => ({ ...prev, correct: prev.correct + 1 }));
          }
       } else {
          // Send failed trail question to the end of the trail content
          setActiveTrailContent(prev => {
             const updated = [...prev];
             // Clonando para ter novo _uid assim não conflita chave no React se repetir
             const rep = { ...currentStep, _uid: `trail_rep_${crypto.randomUUID()}`, isRetry: true };
             updated.push(rep);
             return updated;
          });
       }
    } else if (!isTrailActive) {
       if (selectedOption === currentGenericQuiz.correctOption) {
          if (genericQuizIndex < baseQuizzes.length) {
             setGenericQuizStats(prev => ({ ...prev, correct: prev.correct + 1 }));
          }
       } else {
          // ALWAYS add failed questions to the end of the line, even if they are already there!
          setSessionFailedQuizzes(prev => [...prev, currentGenericQuiz]);
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
    setSessionFailedQuizzes([]);
  };
  
  const isTrailActive = !!selectedTrail;

  const startTrail = (trail) => {
    setSelectedTrail(trail);
    
    // Preparar as questões do Trail (embaralhar opções de quizzes) antes de iniciar
    const preparedContent = trail.content.map((step, idx) => {
       if (step.type === "quiz") {
          const correctText = step.options.find(o => o.id === step.correctOption)?.text;
          const opts = step.options.map(o => ({ ...o }));
          for (let i = opts.length - 1; i > 0; i--) {
             const j = Math.floor(Math.random() * (i + 1));
             [opts[i], opts[j]] = [opts[j], opts[i]];
          }
          const ids = ["A", "B", "C", "D", "E", "F"];
          let newCorrectID = "A";
          opts.forEach((o, i) => {
             if (o.text === correctText) newCorrectID = ids[i];
             o.id = ids[i];
          });
          return {
             ...step,
             _uid: `trail_${idx}_${crypto.randomUUID()}`,
             options: opts,
             correctOption: newCorrectID
          };
       }
       return { ...step, _uid: `trail_${idx}_${crypto.randomUUID()}` };
    });

    setActiveTrailContent(preparedContent);
    setTrailStepIndex(0);
    setIsFlipped(false);
    setSelectedOption(null);
    setQuizSubmitted(false);
    setIsTrailFinished(false);
    setCurrentTrailStats({ correct: 0, total: trail.content.filter(c => c.type === "quiz").length });
  };

  const closeTrail = () => {
    setSelectedTrail(null);
    setActiveTrailContent(null);
    setIsTrailFinished(false);
  };

  const handleExplainError = async (question, userResp, correctResp) => {
    setIsExplaining(true);
    const explanation = await explainQuizError(question, userResp, correctResp);
    setAiExplanation(explanation);
    setIsExplaining(false);
  };

  const nextTrailStep = () => {
    setAiExplanation(null);
    if (activeTrailContent && trailStepIndex < activeTrailContent.length - 1) {
       setTrailStepIndex(prev => prev + 1);
       setIsFlipped(false);
       setSelectedOption(null);
       setQuizSubmitted(false);
    } else {
       setCompletedTrails(prev => ({
          ...prev,
          [selectedTrail.id]: { correct: currentTrailStats.correct, total: currentTrailStats.total }
       }));
       setIsTrailFinished(true);
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
         alert(t("guided_learning.alerts.import_success"));
      }
    } catch {
      alert(t("guided_learning.alerts.import_error"));
    }
  };

  const handleExportTrail = async (trail) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(trail));
      alert(t("guided_learning.alerts.export_success"));
    } catch {
      alert(t("guided_learning.alerts.export_error"));
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
          alert(t("guided_learning.alerts.generate_error"));
          setIsGenerating(false);
       }
    } catch (e) {
       console.error("Erro gerando trilha:", e);
       alert(t("guided_learning.alerts.generate_catch"));
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
      <div className="discursive-wrapper">
         <div className="discursive-card">
               <span className="material-symbols-outlined watermark discursive-watermark">edit_note</span>
               <h4 className="discursive-question">{openEndedItem.question}</h4>
               {openEndedItem.hint && <p className="discursive-hint">{openEndedItem.hint}</p>}
               
               {!discursiveFeedback ? (
                 <>
                   <textarea
                     className="ai-textarea"
                     rows="5"
                     placeholder={t("guided_learning.open_ended.placeholder")}
                     value={discursiveResp}
                     onChange={(e) => setDiscursiveResp(e.target.value)}
                     disabled={isEvaluating}
                   />
                   <div className="action-buttons-row">
                      <button className="primary-btn cta evaluate-btn"
                         onClick={() => handleEvaluateDiscursive(openEndedItem.question, discursiveResp)} disabled={isEvaluating || !discursiveResp.trim()}>
                         <span className="material-symbols-outlined">rate_review</span>
                         {isEvaluating ? t("guided_learning.open_ended.evaluating") : t("guided_learning.open_ended.evaluate_btn")}
                      </button>
               <button type="button" className="secondary-btn skip-btn" onClick={isTrail ? nextTrailStep : null}>
                  {t("guided_learning.open_ended.skip_btn")}
               </button>
                   </div>
                 </>
               ) : (
                 <div style={{textAlign: 'left', width: '100%'}}>
                   <p style={{marginBottom: '15px', color: 'var(--text-color)'}}><strong style={{color: 'var(--primary-color)'}}>{t("guided_learning.open_ended.your_answer")}</strong> <br/><span style={{color: 'var(--text-light)', marginTop: '4px', display: 'inline-block'}}>{discursiveResp}</span></p>
                   <div className="discursive-feedback-box">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-color)' }}>
                         <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-color)' }}>school</span>
                         {t("guided_learning.open_ended.ai_feedback")}
                      </div>
                      <div className="markdown-body">
                         <ReactMarkdown components={{ p: ({node: _node, ...props}) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.5' }} {...props} /> }}>
                            {discursiveFeedback}
                         </ReactMarkdown>
                      </div>
                   </div>
                   <button className="primary-btn cta" onClick={isTrail ? nextTrailStep : null} style={{width: '100%'}}>
                      {t("guided_learning.open_ended.continue_trail")} <span className="material-symbols-outlined">arrow_forward</span>
                   </button>
                 </div>
               )}
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
                    {isExplaining ? t("guided_learning.quiz.explaining") : t("guided_learning.quiz.explain_btn")}
                 </button>
               ) : (
                 <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: '1.5', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 'bold' }}>
                       <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary-color)' }}>school</span>
                       {t("guided_learning.quiz.tutor")}
                    </div>
                    <div className="markdown-body">
                        <ReactMarkdown components={{ p: ({node: _node, ...props}) => <p style={{ margin: '0 0 8px 0' }} {...props} /> }}>
                          {aiExplanation}
                       </ReactMarkdown>
                    </div>
                 </div>
               )}
            </div>
         )}
         
         <div className="quiz-footer" style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            {!quizSubmitted ? (
               <button type="button" className="primary-btn cta" disabled={!selectedOption} onClick={handleQuizSubmit}>
                  {t("guided_learning.quiz.verify")}
               </button>
            ) : (
               <button className="primary-btn cta" onClick={isTrail ? nextTrailStep : handleNextQuiz}>
                  {isTrail ? (
                     (activeTrailContent && trailStepIndex >= activeTrailContent.length - 1) ? 
                        <><span className="material-symbols-outlined">done_all</span> {t("guided_learning.quiz.finish_trail")}</> : 
                        <><span className="material-symbols-outlined">arrow_forward</span> {t("guided_learning.quiz.next_question")}</>
                  ) : (
                     (genericQuizIndex >= ALL_QUIZZES.length - 1) ? 
                        <><span className="material-symbols-outlined">done_all</span> {t("guided_learning.quiz.see_results")}</> : 
                        <><span className="material-symbols-outlined">arrow_forward</span> {t("guided_learning.quiz.next_question")}</>
                  )}
               </button>
            )}
         </div>
      </div>
    );
  };

  const renderCompletionSplash = (title, correct, total, actionText, actionIcon, onAction) => {
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 100;
    
    let message = t("guided_learning.completion.you_are_awesome");
    let icon = "workspace_premium";
    let color = "var(--primary-color)";
    
    if (percentage === 100) {
      message = t("guided_learning.completion.perfection_title");
      icon = "trophy";
      color = "#f59e0b"; // Dourado
    } else if (percentage >= 70) {
      message = t("guided_learning.completion.excellent_title");
      icon = "verified";
      color = "#10b981"; // Verde
    } else {
      message = t("guided_learning.completion.continue_title");
      icon = "extension";
      color = "var(--primary-color)";
    }

    return (
      <motion.div 
         initial={{ scale: 0.8, opacity: 0, y: 30 }} 
         animate={{ scale: 1, opacity: 1, y: 0 }} 
         transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
         className="quiz-card completion-splash" 
         style={{ textAlign: "center", padding: "50px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
         <motion.div 
            animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }} 
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
         >
            <span className="material-symbols-outlined" style={{ fontSize: "80px", color: color, marginBottom: "16px", filter: `drop-shadow(0 4px 12px ${color}66)` }}>{icon}</span>
         </motion.div>
         <h4 style={{ fontSize: "1.8rem", marginBottom: "12px", color: "var(--text-color)", fontWeight: "800" }}>{title}</h4>
         <p style={{ fontSize: "1.1rem", color: "var(--text-light)", marginBottom: "24px", maxWidth: "400px" }}>
            <Trans i18nKey="guided_learning.completion.stats" values={{ correct, total, percentage }}>Você acertou <strong>{{correct}}</strong> de <strong>{{total}}</strong> questões de primeira ({{percentage}}%).</Trans><br/><br/>
            {message}
         </p>
         <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="primary-btn cta" 
            onClick={onAction} 
            style={{ margin: "0 auto", gap: "8px" }}
         >
            <span className="material-symbols-outlined">{actionIcon}</span> {actionText}
         </motion.button>
      </motion.div>
    );
  };

  const renderFlashcardWrapper = (flashcardItem, isTrail = false) => {
    return (
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`} onClick={handleFlip}>
         <div className="flashcard-inner">
            <div className="flashcard-front">
               <span className="material-symbols-outlined watermark">help_outline</span>
               <p>{flashcardItem.front}</p>
               <span className="flip-hint">{t("guided_learning.flashcard.flip_hint")}</span>
            </div>
            <div className="flashcard-back">
               <span className="material-symbols-outlined watermark">lightbulb</span>
               <p>{flashcardItem.back}</p>
               <div className="flashcard-actions" onClick={(e) => e.stopPropagation()}>
                  <button className="difficulty-btn" style={{backgroundColor: '#FFE5E5', color: '#D32F2F', borderColor: '#D32F2F'}} onClick={() => handleSrsAction(flashcardItem, 0, isTrail)}>{t("guided_learning.flashcard.difficulty.fail")} <br/><span style={{fontSize:'0.65rem'}}>{t("guided_learning.flashcard.times.30s")}</span></button>
                  <button className="difficulty-btn" style={{backgroundColor: '#FFF4E5', color: '#F57C00', borderColor: '#F57C00'}} onClick={() => handleSrsAction(flashcardItem, 1, isTrail)}>{t("guided_learning.flashcard.difficulty.hard")} <br/><span style={{fontSize:'0.65rem'}}>{t("guided_learning.flashcard.times.5m")}</span></button>
                  <button className="difficulty-btn medium" style={{backgroundColor: '#E8F5E9', color: '#388E3C', borderColor: '#388E3C'}} onClick={() => handleSrsAction(flashcardItem, 2, isTrail)}>{t("guided_learning.flashcard.difficulty.good")} <br/><span style={{fontSize:'0.65rem'}}>{t("guided_learning.flashcard.times.30m")}</span></button>
                  <button className="difficulty-btn easy" style={{backgroundColor: '#E3F2FD', color: '#1B5E20', borderColor: '#1B5E20'}} onClick={() => handleSrsAction(flashcardItem, 3, isTrail)}>{t("guided_learning.flashcard.difficulty.easy")} <br/><span style={{fontSize:'0.65rem'}}>{t("guided_learning.flashcard.times.2h")}</span></button>
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
                <h2><span className="material-symbols-outlined learning-header-icon">school</span> {t("guided_learning.title")}</h2>
                <button type="button" className="close-btn" onClick={onClose} aria-label={t('guided_learning.aria.close')}><span className="material-symbols-outlined">close</span></button>
             </div>

             {selectedTrail ? (
                <div className="learning-content">
                   <div className="trail-active-header">
                      <div className="trail-active-header-left">
                     <button className="trail-active-back-btn" onClick={closeTrail}>
                        <span className="material-symbols-outlined" style={{marginRight: '8px'}}>arrow_back</span> {t("guided_learning.trails.active_back")}
                     </button>
                     <h3 className="trail-active-title">
                        {selectedTrail.icon && <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)'}}>{selectedTrail.icon}</span>} 
                        {selectedTrail.title}
                     </h3>
                     <p className="trail-active-desc">{selectedTrail.description}</p>
                  </div>
                  <div className="trail-active-header-right">
                     <span style={{ color: "var(--text-light)", fontSize: '0.9rem', marginBottom: '8px' }}>
                        {isTrailFinished ? t('guided_learning.trails.active_finished') : t('guided_learning.trails.active_step', { step: trailStepIndex + 1, total: selectedTrail.content.length })}
                     </span>
                     <div className="trail-progress-bar" style={{ width: '100px', margin: 0 }}>
                        <div className="trail-progress-fill" style={{ width: isTrailFinished ? '100%' : `${((trailStepIndex) / selectedTrail.content.length) * 100}%` }}></div>
                     </div>
                  </div>
               </div>

               <div className="trail-content-area">
                  <AnimatePresence mode="wait">
                     {isTrailFinished ? (
                        <motion.div key="trail-splash" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: "40px" }}>
                           {renderCompletionSplash(
                              t("guided_learning.completion.title"),
                              currentTrailStats.correct,
                              currentTrailStats.total,
                              t("guided_learning.completion.action"),
                              "route",
                              closeTrail
                           )}
                        </motion.div>
                     ) : (
                        <motion.div key={trailStepIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                           {currentStep?.type === "open_ended" ? renderOpenEnded(currentStep, true) : currentStep?.type === "flashcard" ? renderFlashcardWrapper(currentStep, true) : renderQuiz(currentStep, true)}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>
         ) : (
            <>
               <div className="learning-tabs">
                  <button className={`learning-tab ${activeTab === "trails" ? "active" : ""}`} onClick={() => setActiveTab("trails")}>
                     <span className="material-symbols-outlined">route</span> {t("guided_learning.tabs.trails")}
                  </button>
                  <button className={`learning-tab ${activeTab === "flashcards" ? "active" : ""}`} onClick={() => setActiveTab("flashcards")}>
                     <span className="material-symbols-outlined">style</span> {t("guided_learning.tabs.flashcards")}
                  </button>
                  <button className={`learning-tab ${activeTab === "quizzes" ? "active" : ""}`} onClick={() => setActiveTab("quizzes")}>
                     <span className="material-symbols-outlined">quiz</span> {t("guided_learning.tabs.quizzes")}
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
                                       <h3 style={{margin: 0, color: 'var(--text-color)'}}>{t("guided_learning.create.title")}</h3>
                                       <button className="icon-btn" onClick={() => setIsCreatingTrail(false)}><span className="material-symbols-outlined">close</span></button>
                                    </div>
                                    <p style={{color: 'var(--text-light)', marginTop: 0}}>{t("guided_learning.create.desc")}</p>
                                    <textarea 
                                       className="ai-input" 
                                       rows="4" 
                                       placeholder={t("guided_learning.create.placeholder")}
                                       value={newTrailTopic}
                                       onChange={(e) => setNewTrailTopic(e.target.value)}
                                    />
                                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                       <button className="ai-magic-btn" disabled={!newTrailTopic.trim() || isGenerating} onClick={handleGenerateTrail}>
                                          {isGenerating ? <span className="material-symbols-outlined spin-anim">sync</span> : <span className="material-symbols-outlined">auto_awesome</span>} 
                                          {isGenerating ? t("guided_learning.create.btn_generating") : t("guided_learning.create.btn_create")}
                                       </button>
                                    </div>
                                 </motion.div>
                              ) : (
                                 <motion.div key="trails-grid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                                    <div className="trails-header" style={{ paddingBottom: '16px' }}>
                                       <h3>{t("guided_learning.explore.title")}</h3>
                                       <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto', justifyContent: 'center', paddingBlock: '8px', marginBlock: '-8px' }}>
                                          <button className="secondary-btn" onClick={handleImportTrail}>
                                             <span className="material-symbols-outlined">download</span> {t("guided_learning.explore.import")}
                                          </button>
                                          <button className="ai-magic-btn" onClick={() => setIsCreatingTrail(true)}>
                                             <span className="material-symbols-outlined">auto_awesome</span> {t("guided_learning.explore.generate")}
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
                                                      <p style={{ fontWeight: 600, color: 'var(--primary-color)', margin: 0, fontSize: '0.85rem' }}>{t('guided_learning.explore.activities', { count: trail.content.length })}</p>
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
                                                      <button type="button" className="icon-btn" aria-label={t('guided_learning.aria.start_trail')}><span className="material-symbols-outlined">play_arrow</span></button>
                                                      <button type="button" className="icon-btn" onClick={(e) => { e.stopPropagation(); handleExportTrail(trail); }} aria-label={t('guided_learning.aria.export_trail')} style={{ color: 'var(--primary-color)' }}><span className="material-symbols-outlined">ios_share</span></button>
                                                      <button type="button" className="icon-btn" onClick={(e) => handleDeleteTrail(e, trail.id)} aria-label={t('guided_learning.aria.delete_trail')} style={{ color: 'var(--error-color, #ef4444)' }}><span className="material-symbols-outlined">delete</span></button>
                                                   </div>
                                                ) : (
                                                   <button type="button" className="icon-btn" aria-label={t('guided_learning.aria.start_trail')}><span className="material-symbols-outlined">play_arrow</span></button>
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
                              <h3>{t("guided_learning.status.practice")}</h3>
                           </div>
                           {ALL_FLASHCARDS.length > 0 ? (
                              <>
                                 <div className="learning-progress-status">
                                    <span>{t("guided_learning.status.base_unlocked", { count: baseFlashcards.length })}</span>
                                    <span>{t("guided_learning.status.flashcard_status", { current: currentFlashcard + 1, total: ALL_FLASHCARDS.length })}</span>
                                 </div>
                                 {renderFlashcardWrapper(
                                    ALL_FLASHCARDS[currentFlashcard % ALL_FLASHCARDS.length], false
                                 )}
                              </>
                           ) : (
                              <div className="quiz-card" style={{ textAlign: "center", padding: "40px 20px" }}>
                                 <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--text-light)", marginBottom: "16px" }}>lock</span>
                                 <h4 style={{ fontSize: "1.2rem", color: "var(--text-color)", marginBottom: "8px" }}>{t("guided_learning.empty_flashcards.title")}</h4>
                                 <p style={{ color: "var(--text-light)" }}>{t("guided_learning.empty_flashcards.desc")}</p>
                              </div>
                           )}
                        </motion.div>
                     )}

                     {activeTab === "quizzes" && (
                        <motion.div key="quizzes" className="learning-tab-content quizzes-container" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                           <div className="quizzes-header">
                              <h3>{t("guided_learning.status.quick_quiz")}</h3>
                           </div>
                           {ALL_QUIZZES.length > 0 ? (
                              <>
                                 <div className="learning-progress-status">
                                    <span>{t("guided_learning.status.base_unlocked", { count: baseQuizzes.length })}</span>
                                    <span>{t("guided_learning.status.quiz_status", { current: isGenericQuizFinished ? ALL_QUIZZES.length : genericQuizIndex + 1, total: ALL_QUIZZES.length })}</span>
                                 </div>
                                 {isGenericQuizFinished ? (
                                    renderCompletionSplash(
                                       t("guided_learning.completion.quizzes_title"), 
                                       genericQuizStats.correct, 
                                       baseQuizzes.length, 
                                       t("guided_learning.completion.retry"), 
                                       "refresh", 
                                       resetGenericQuiz
                                    )
                                 ) : (
                                    renderQuiz(currentGenericQuiz, false)
                                 )}
                              </>
                           ) : (
                              <div className="quiz-card" style={{ textAlign: "center", padding: "40px 20px" }}>
                                 <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--text-light)", marginBottom: "16px" }}>lock</span>
                                 <h4 style={{ fontSize: "1.2rem", color: "var(--text-color)", marginBottom: "8px" }}>{t("guided_learning.empty_quizzes.title")}</h4>
                                 <p style={{ color: "var(--text-light)" }}>{t("guided_learning.empty_quizzes.desc")}</p>
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