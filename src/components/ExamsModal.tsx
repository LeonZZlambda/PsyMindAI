import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../context/ChatContext';
import TelemetryService from '../services/TelemetryService';
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
  const { t } = useTranslation(['learning', 'translation']);
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
    if (isOpen) {
      TelemetryService.trackEvent('modal_open', { modal: 'exams' });
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const onSelectCategoryWrapper = (category: ExamCategory) => {
    setSelectedCategory(category);
    TelemetryService.trackEvent('exams_funnel', { step: 1, category: category.id });
  };

  const onSelectExamWrapper = (exam: ExamDefinition) => {
    setSelectedExam(exam);
    TelemetryService.trackEvent('exams_funnel', { step: 2, exam: exam.name });
  };

  const onSelectSubjectWrapper = (subject: string) => {
    setSelectedSubject(subject);
    TelemetryService.trackEvent('exams_funnel', { step: 3, subject });
  };


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
      ? t(`learning:exams.categories_title.${selectedCategory?.id}`)
      : t('learning:exams.title');

  const heroTitle = selectedSubject ?? selectedExam?.name ?? t('learning:exams.title');
  const heroDescription = selectedSubject
    ? t('learning:exams.topics_header')
    : selectedExam
      ? selectedExam.fullName
      : t('learning:exams.hero_description');

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('learning:exams.title')}
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
                <span className="material-symbols-outlined icon-rtl-flip">arrow_back</span>
                {t('learning:exams.back')}
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
          <CategoriesView categories={examCategories} onSelectCategory={onSelectCategoryWrapper} />
        ) : !selectedExam ? (
          <ExamsListView category={selectedCategory} onSelectExam={onSelectExamWrapper} />
        ) : !selectedSubject ? (
          <SubjectsView exam={selectedExam} onClose={onClose} onSelectSubject={onSelectSubjectWrapper} />
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
              TelemetryService.trackEvent('ai_feature_use', { feature: 'study_plan', subject: selectedSubject, exam: selectedExam.name });
              const prompt = t('exams.prompts.plan', {
                exam: selectedExam.name,
                subject: selectedSubject,
                topics: currentTopics.map((top, index) => `${index + 1}. ${top}`).join('\n'),
              });
              sendMessage(prompt);
              onClose();
            }}
            onGenerateQuiz={(config) => {
              TelemetryService.trackEvent('ai_feature_use', { feature: 'quiz', subject: selectedSubject, exam: selectedExam.name });
              setQuizConfig(config);
              setShowQuiz(true);
            }}
            onGenerateStrategy={() => {
              TelemetryService.trackEvent('ai_feature_use', { feature: 'exam_strategy', subject: selectedSubject, exam: selectedExam.name });
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
