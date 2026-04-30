import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { sendMessage } from '../services/chat/chatService';
import logger from '../utils/logger';
import '../styles/quiz.css';

export interface QuizConfig {
  topic: string;
  exam: string;
  subject: string;
}

export interface Question {
  pergunta: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: QuizConfig | null;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, config }) => {
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      resetState();
    }, 400);
  };

  const resetState = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsEvaluated(false);
    setScore(0);
    setQuizFinished(false);
    setLoading(true);
  };

  const generateQuiz = async () => {
    if (!config || !config.topic) return;
    setLoading(true);
    try {
      const prompt = t('quiz.prompt', {
        exam: config.exam,
        subject: config.subject,
        topic: config.topic
      });

      const res = await sendMessage(prompt, []);
      
      if (res.success) {
        // Safe JSON parsing handling markdown wraps
        let jsonStr = res.text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7);
        }
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.substring(3);
        }
        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.substring(0, jsonStr.length - 3);
        }
        jsonStr = jsonStr.trim();

        const data = JSON.parse(jsonStr);
        if (Array.isArray(data) && data.length > 0) {
            setQuestions(data);
        } else {
            throw new Error("Formato inválido");
        }
      } else {
        throw new Error("Falha ao gerar");
      }
    } catch (e) {
      logger.error('Quiz generation error:', e);
      // Fallback in case the JSON parsing fails
      setQuestions([{
          pergunta: t('quiz.messages.error_comm'),
          alternativas: [t('quiz.messages.try_again')],
          correta: 0,
          explicacao: t('quiz.messages.error_desc')
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && config) {
      resetState();
      generateQuiz();
    }
  }, [isOpen, config]);

  const handleSelect = (idx: number) => {
    if (!isEvaluated) {
        setSelectedAnswer(idx);
    }
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    setIsEvaluated(true);
    if (selectedAnswer === questions[currentIndex].correta) {
        setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setIsEvaluated(false);
    } else {
        setQuizFinished(true);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={(e) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        handleClose();
      }
    }}>
      <div className="quiz-modal modal-content">
        <div className="quiz-header">
          <div className="quiz-title-area">
            <h2>{t('quiz.title', { topic: config?.topic })}</h2>
            <span className="quiz-subtitle">{config?.subject} - {config?.exam}</span>
          </div>
          <button className="close-btn" onClick={handleClose} aria-label={t('quiz.close')}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="quiz-body">
          {loading ? (
             <div className="quiz-loading">
                <span className="material-symbols-outlined rotating" style={{fontSize: '48px', color: 'var(--primary-color)'}}>psychology</span>
                <h3>{t('quiz.loading.title')}</h3>
                <p>{t('quiz.loading.desc', { exam: config?.exam })}</p>
             </div>
          ) : quizFinished ? (
             <div className="quiz-results">
                <span className="material-symbols-outlined" style={{fontSize: '64px', color: 'gold'}}>workspace_premium</span>
                <h2>{t('quiz.results.title')}</h2>
                <div className="score-display">
                    {t('quiz.results.score', { score, total: questions.length })}
                </div>
                <button className="primary-btn" style={{marginTop: '20px'}} onClick={handleClose}>{t('quiz.results.finish')}</button>
             </div>
          ) : (
             <div className="quiz-active">
                <div className="quiz-progress">
                    {t('quiz.active.progress', { current: currentIndex + 1, total: questions.length })}
                </div>
                
                <div className="quiz-question markdown-content">
                    <ReactMarkdown>{questions[currentIndex]?.pergunta}</ReactMarkdown>
                </div>

                <div className="quiz-options">
                    {questions[currentIndex]?.alternativas.map((alt, idx) => {
                        let btnClass = "quiz-option-btn";
                        if (isEvaluated) {
                            if (idx === questions[currentIndex].correta) btnClass += " correct";
                            else if (idx === selectedAnswer) btnClass += " wrong";
                            else if (idx !== selectedAnswer) btnClass += " disabled";
                        } else {
                            if (idx === selectedAnswer) btnClass += " selected";
                        }

                        return (
                            <button 
                                key={idx} 
                                className={btnClass}
                                onClick={() => handleSelect(idx)}
                                disabled={isEvaluated}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                                <span className="option-text">{alt.replace(/^[A-E]\)\s*/i, '')}</span>
                            </button>
                        )
                    })}
                </div>

                {isEvaluated && (
                    <div className={`quiz-explanation ${selectedAnswer === questions[currentIndex].correta ? 'success-box' : 'error-box'}`}>
                        <h4>{selectedAnswer === questions[currentIndex].correta ? t('quiz.active.correct') : t('quiz.active.incorrect')}</h4>
                        <div className="markdown-content">
                             <ReactMarkdown>{questions[currentIndex]?.explicacao}</ReactMarkdown>
                        </div>
                    </div>
                )}

                <div className="quiz-footer">
                    {!isEvaluated ? (
                        <button 
                            className="primary-btn cta" 
                            disabled={selectedAnswer === null}
                            onClick={handleConfirm}
                        >
                            {t('quiz.active.confirm')}
                        </button>
                    ) : (
                        <button 
                            className="primary-btn cta" 
                            onClick={handleNext}
                        >
                            {currentIndex + 1 === questions.length ? t('quiz.active.see_results') : t('quiz.active.next')}
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    )}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizModal;
