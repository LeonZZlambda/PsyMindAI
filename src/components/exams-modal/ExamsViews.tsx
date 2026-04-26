import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ExamCategory, ExamDefinition, JudgeConfig, QuizConfig } from './types';
import { EnemCalculator } from './EnemCalculator';
import { getSubjectConfig } from './data';

type CategoriesViewProps = {
  categories: ExamCategory[];
  onSelectCategory: (category: ExamCategory) => void;
};

type ExamsListViewProps = {
  category: ExamCategory;
  onSelectExam: (exam: ExamDefinition) => void;
};

type SubjectsViewProps = {
  exam: ExamDefinition;
  onClose: () => void;
  onSelectSubject: (subject: string) => void;
};

type TopicsViewProps = {
  exam: ExamDefinition;
  onClose: () => void;
  onExplainTopic: (topic: string) => void;
  onGeneratePlan: () => void;
  onGenerateQuiz: (config: QuizConfig) => void;
  onGenerateStrategy: () => void;
  onOpenJudge: (config: JudgeConfig) => void;
  subject: string;
  topics: string[];
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({ categories, onSelectCategory }) => {
  const { t } = useTranslation();

  return (
    <div className="exams-section">
      <div className="exams-section__header">
        <h4 className="modal-section-title">{t('exams.sections.categories')}</h4>
      </div>
      <div className="exams-categories-grid">
        {categories.map((category) => (
          <button key={category.id} className="exam-category-btn modal-card" onClick={() => onSelectCategory(category)}>
            <div className="exam-category-btn__icon" style={{ color: category.color }}>
              <span className="material-symbols-outlined">{category.icon}</span>
            </div>
            <span>{t(`exams.categories_title.${category.id}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ExamsListView: React.FC<ExamsListViewProps> = ({ category, onSelectExam }) => {
  const { t } = useTranslation();

  return (
    <div className="exams-list-view">
      <div className="category-header-small modal-card">
        <span className="material-symbols-outlined" style={{ color: category.color }}>
          {category.icon}
        </span>
        <div className="exam-info">
          <span className="exam-name">{t(`exams.categories_title.${category.id}`)}</span>
          <span className="exam-fullname">{t('exams.sections.available_options', { count: category.exams.length })}</span>
        </div>
      </div>

      <div className="exams-list">
        {category.exams.map((exam) => (
          <button key={exam.name} className="exam-item-modal" onClick={() => onSelectExam(exam)}>
            <div className="exam-item-modal__icon">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div className="exam-info">
              <span className="exam-name">{exam.name}</span>
              <span className="exam-fullname">{exam.fullName}</span>
            </div>
            <span className="material-symbols-outlined arrow-icon">chevron_right</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const SubjectsView: React.FC<SubjectsViewProps> = ({ exam, onClose, onSelectSubject }) => {
  const { t } = useTranslation();

  if (exam.isCalculator) {
    return (
      <div className="exams-subjects-view">
        <div className="modal-card exams-calculator-shell">
          <EnemCalculator onClose={onClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="exams-subjects-view">
      <div className="exams-section">
        <div className="exams-section__header">
          <h4 className="modal-section-title">{t('exams.sections.subjects')}</h4>
          <p className="exams-section__caption">{t('exams.sections.subjects_caption')}</p>
        </div>

        <div className="subjects-grid">
          {exam.subjects.map((subject) => {
            const { icon, className } = getSubjectConfig(subject, exam.name);
            return (
              <button key={subject} className={`subject-card ${className}`} onClick={() => onSelectSubject(subject)} type="button">
                <div className="subject-icon-wrapper">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span>{subject}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TopicsView: React.FC<TopicsViewProps> = ({
  exam,
  onClose,
  onExplainTopic,
  onGeneratePlan,
  onGenerateQuiz,
  onGenerateStrategy,
  onOpenJudge,
  subject,
  topics,
}) => {
  const { t } = useTranslation();

  return (
    <div className="exams-topics-view">
      <div className="exam-ai-actions">
        <button className="ai-action-btn primary" onClick={onGeneratePlan}>
          <span className="material-symbols-outlined">auto_awesome</span>
          {t('exams.actions.ai_plan')}
        </button>

        <button className="ai-action-btn secondary" onClick={onGenerateStrategy}>
          <span className="material-symbols-outlined">psychology</span>
          {t('exams.actions.ai_strategy')}
        </button>

        {exam.name === 'OBI' ? (
          <button
            className="ai-action-btn tertiary"
            onClick={() => onOpenJudge({ subject, examName: exam.name, topics })}
          >
            <span className="material-symbols-outlined">terminal</span>
            {t('exams.actions.ai_judge')}
          </button>
        ) : null}
      </div>

      <div className="topics-list">
        {topics.map((topic) => (
          <div key={topic} className="topic-item">
            <div className="topic-item__body">
              <span className="material-symbols-outlined topic-icon">check_circle</span>
              <span className="topic-text">{topic}</span>
            </div>
            <div className="topic-actions">
              <button className="topic-action-btn" onClick={() => { onExplainTopic(topic); onClose(); }} title={t('exams.actions.explain_topic')}>
                <span className="material-symbols-outlined">school</span>
              </button>
              <button className="topic-action-btn" onClick={() => onGenerateQuiz({ exam: exam.name, subject, topic })} title={t('exams.actions.generate_quiz')}>
                <span className="material-symbols-outlined">quiz</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
