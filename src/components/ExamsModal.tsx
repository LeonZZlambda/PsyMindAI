import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';
import BaseModal from './BaseModal';
import { examCategories, getTopicsForSubject } from './exams-modal/data';
import { CategoriesView, ExamsListView, SubjectsView, TopicsView } from './exams-modal/ExamsViews';
import type { ExamCategory, ExamDefinition, JudgeConfig, QuizConfig } from './exams-modal/types';
import '../styles/exams.css';

const JudgeModal = lazy(() => import('./JudgeModal'));
const QuizModal = lazy(() => import('./QuizModal'));

type ExamsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ExamsModal: React.FC<ExamsModalProps> = ({ isOpen, onClose }) => {
  const { sendMessage } = useChat();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamDefinition | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showJudge, setShowJudge] = useState(false);
  const [judgeConfig, setJudgeConfig] = useState<JudgeConfig | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);

  const handleClose = () => {
    onClose();
    setSelectedCategory(null);
    setSelectedExam(null);
    setSelectedSubject(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const currentTopics = selectedSubject ? getTopicsForSubject(selectedSubject, selectedExam?.name) : [];

  const handleBack = () => {
    if (selectedSubject) {
      setSelectedSubject(null);
      return;
    }

    if (selectedExam) {
      setSelectedExam(null);
      return;
    }

    setSelectedCategory(null);
  };

  const heroEyebrow = selectedSubject
    ? selectedExam?.name
    : selectedExam
      ? t(`exams.categories_title.${selectedCategory?.id}`)
      : t('exams.title');

  const heroTitle = selectedSubject ?? selectedExam?.name ?? t('exams.title');
  const heroDescription = selectedSubject
    ? t('exams.topics_header')
    : selectedExam
      ? selectedExam.fullName
      : t('exams.hero_description');

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('exams.title')}
      icon="school"
      size="large"
      className="exams-modal"
    >
      <div className="exams-body">
        <div className="modal-hero exams-hero">
          <div className="exams-hero__copy">
            <span className="exams-hero__eyebrow">
              <span className="material-symbols-outlined">workspace_premium</span>
              {heroEyebrow}
            </span>
            <h3 className="exams-hero__title">{heroTitle}</h3>
            <p className="exams-hero__description">{heroDescription}</p>
          </div>

          {selectedCategory || selectedExam || selectedSubject ? (
            <div className="exams-stage-bar" aria-label="breadcrumb">
              <button className="back-btn exams-back-btn" onClick={handleBack}>
                <span className="material-symbols-outlined">arrow_back</span>
                {t('exams.back')}
              </button>
              <div className="exams-stage-chips">
                <span className={`exams-stage-chip ${selectedCategory ? 'is-active' : ''}`}>1</span>
                <span className={`exams-stage-chip ${selectedExam ? 'is-active' : ''}`}>2</span>
                <span className={`exams-stage-chip ${selectedSubject ? 'is-active' : ''}`}>3</span>
              </div>
            </div>
          ) : null}
        </div>

        {!selectedCategory ? (
          <CategoriesView categories={examCategories} onSelectCategory={setSelectedCategory} />
        ) : !selectedExam ? (
          <ExamsListView category={selectedCategory} onSelectExam={setSelectedExam} />
        ) : !selectedSubject ? (
          <SubjectsView exam={selectedExam} onClose={onClose} onSelectSubject={setSelectedSubject} />
        ) : (
          <TopicsView
            exam={selectedExam}
            onClose={onClose}
            onExplainTopic={(topic) => {
              const prompt = t('exams.prompts.explain', {
                exam: selectedExam.name,
                subject: selectedSubject,
                topic,
              });
              sendMessage(prompt);
            }}
            onGeneratePlan={() => {
              const prompt = t('exams.prompts.plan', {
                exam: selectedExam.name,
                subject: selectedSubject,
                topics: currentTopics.map((top, index) => `${index + 1}. ${top}`).join('\n'),
              });
              sendMessage(prompt);
              onClose();
            }}
            onGenerateQuiz={(config) => {
              setQuizConfig(config);
              setShowQuiz(true);
            }}
            onGenerateStrategy={() => {
              const prompt = t('exams.prompts.strategy', {
                exam: selectedExam.name,
                subject: selectedSubject,
              });
              sendMessage(prompt);
              onClose();
            }}
            onOpenJudge={(config) => {
              setJudgeConfig(config);
              setShowJudge(true);
            }}
            subject={selectedSubject}
            topics={currentTopics}
          />
        )}
      </div>

      {showJudge && judgeConfig ? (
        <Suspense fallback={null}>
          <JudgeModal isOpen={showJudge} onClose={() => setShowJudge(false)} config={judgeConfig} />
        </Suspense>
      ) : null}

      {showQuiz && quizConfig ? (
        <Suspense fallback={null}>
          <QuizModal isOpen={showQuiz} onClose={() => setShowQuiz(false)} config={quizConfig} />
        </Suspense>
      ) : null}
    </BaseModal>
  );
};

export default ExamsModal;
