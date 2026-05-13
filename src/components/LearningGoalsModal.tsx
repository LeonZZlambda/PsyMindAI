import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import BaseModal from './BaseModal';
import { useLearningGoals } from '../hooks/context/useLearningGoals';
import { LearningGoalsSystem, GoalTemplate } from '../utils/learningGoals';
import '../styles/learning-goals.css';

interface LearningGoalsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
}

const LearningGoalsModal: React.FC<LearningGoalsModalProps> = ({ isOpen = true, onClose, isEmbedded = false }) => {
  const { t } = useTranslation();
  const { activeGoals, completedGoals, templates, createGoal, createCustomGoal, deleteGoal, getGoalProgress } = useLearningGoals();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'create'>('active');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customTarget, setCustomTarget] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    studyTime: 0,
    topicsMastered: 0,
    trailsCompleted: 0,
    streakDays: 0,
  });

  const handleCreateFromTemplate = (template: GoalTemplate) => {
    createGoal(template);
    setActiveTab('active');
  };

  const handleCreateCustom = () => {
    if (customTitle.trim() && customDescription.trim()) {
      createCustomGoal(customTitle, customDescription, customTarget);
      setCustomTitle('');
      setCustomDescription('');
      setCustomTarget({
        questionsAnswered: 0,
        correctAnswers: 0,
        studyTime: 0,
        topicsMastered: 0,
        trailsCompleted: 0,
        streakDays: 0,
      });
      setShowCreateForm(false);
      setActiveTab('active');
    }
  };

  const GoalCard: React.FC<{ goal: any; isCompleted?: boolean }> = ({ goal, isCompleted = false }) => {
    const progress = getGoalProgress(goal.id);
    const timeRemaining = LearningGoalsSystem.getTimeRemaining(goal);
    const motivationalMessage = LearningGoalsSystem.getMotivationalMessage(goal);

    return (
      <motion.div
        className={`goal-card ${isCompleted ? 'completed' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="goal-header">
          <h3>{goal.title}</h3>
          {!isCompleted && (
            <button
              className="delete-goal-btn"
              onClick={() => deleteGoal(goal.id)}
              title="Excluir meta"
            >
              ×
            </button>
          )}
        </div>

        <p className="goal-description">{goal.description}</p>

        {!isCompleted && (
          <div className="goal-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        )}

        <div className="goal-targets">
          {goal.target.questionsAnswered && (
            <div className="target-item">
              <span>Questões respondidas:</span>
              <span>{goal.progress.questionsAnswered}/{goal.target.questionsAnswered}</span>
            </div>
          )}
          {goal.target.correctAnswers && (
            <div className="target-item">
              <span>Acertos:</span>
              <span>{goal.progress.correctAnswers}/{goal.target.correctAnswers}</span>
            </div>
          )}
          {goal.target.studyTime && (
            <div className="target-item">
              <span>Tempo de estudo:</span>
              <span>{goal.progress.studyTime}/{goal.target.studyTime}min</span>
            </div>
          )}
          {goal.target.topicsMastered && (
            <div className="target-item">
              <span>Tópicos dominados:</span>
              <span>{goal.progress.topicsMastered}/{goal.target.topicsMastered}</span>
            </div>
          )}
          {goal.target.trailsCompleted && (
            <div className="target-item">
              <span>Trilhas completadas:</span>
              <span>{goal.progress.trailsCompleted}/{goal.target.trailsCompleted}</span>
            </div>
          )}
          {goal.target.streakDays && (
            <div className="target-item">
              <span>Dias de sequência:</span>
              <span>{goal.progress.streakDays}/{goal.target.streakDays}</span>
            </div>
          )}
        </div>

        {!isCompleted && goal.deadline && (
          <div className={`goal-deadline ${timeRemaining.isOverdue ? 'overdue' : ''}`}>
            {timeRemaining.isOverdue ? (
              <span>Prazo expirado</span>
            ) : (
              <span>{timeRemaining.days}d {timeRemaining.hours}h restantes</span>
            )}
          </div>
        )}

        <div className="goal-motivation">
          {motivationalMessage}
        </div>

        {isCompleted && goal.completedAt && (
          <div className="goal-completed-date">
            Concluída em {goal.completedAt.toLocaleDateString()}
          </div>
        )}
      </motion.div>
    );
  };

  const content = (
    <div className="learning-goals-modal">
      <div className="goals-tabs">
        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Ativas ({activeGoals.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Concluídas ({completedGoals.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Criar Meta
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'active' && (
          <motion.div
            key="active"
            className="goals-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {activeGoals.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">target</span>
                <h3>Nenhuma meta ativa</h3>
                <p>Crie sua primeira meta de aprendizado para começar!</p>
              </div>
            ) : (
              <div className="goals-grid">
                {activeGoals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'completed' && (
          <motion.div
            key="completed"
            className="goals-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {completedGoals.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined">celebration</span>
                <h3>Nenhuma meta concluída</h3>
                <p>Complete suas metas para vê-las aqui!</p>
              </div>
            ) : (
              <div className="goals-grid">
                {completedGoals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} isCompleted />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'create' && (
          <motion.div
            key="create"
            className="goals-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="create-goals-section">
              <h3>Templates de Metas</h3>
              <div className="templates-grid">
                {templates.map(template => (
                  <div key={template.id} className="template-card">
                    <div className="template-header">
                      <span className="template-icon">{template.icon}</span>
                      <h4>{template.title}</h4>
                    </div>
                    <p>{template.description}</p>
                    <button
                      className="create-from-template-btn"
                      onClick={() => handleCreateFromTemplate(template)}
                    >
                      Criar Meta
                    </button>
                  </div>
                ))}
              </div>

              <div className="custom-goal-section">
                <button
                  className="toggle-custom-form-btn"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  {showCreateForm ? 'Cancelar' : '+ Criar Meta Personalizada'}
                </button>

                {showCreateForm && (
                  <motion.div
                    className="custom-goal-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="form-group">
                      <label>Título da Meta</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="Ex: Estudar matemática por 2 horas"
                      />
                    </div>

                    <div className="form-group">
                      <label>Descrição</label>
                      <textarea
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="Descreva sua meta em detalhes..."
                      />
                    </div>

                    <div className="targets-section">
                      <h4>Objetivos (configure pelo menos um)</h4>
                      <div className="targets-grid">
                        <div className="form-group">
                          <label>Questões respondidas</label>
                          <input
                            type="number"
                            min="0"
                            value={customTarget.questionsAnswered}
                            onChange={(e) => setCustomTarget(prev => ({
                              ...prev,
                              questionsAnswered: parseInt(e.target.value) || 0
                            }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Acertos</label>
                          <input
                            type="number"
                            min="0"
                            value={customTarget.correctAnswers}
                            onChange={(e) => setCustomTarget(prev => ({
                              ...prev,
                              correctAnswers: parseInt(e.target.value) || 0
                            }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tempo de estudo (min)</label>
                          <input
                            type="number"
                            min="0"
                            value={customTarget.studyTime}
                            onChange={(e) => setCustomTarget(prev => ({
                              ...prev,
                              studyTime: parseInt(e.target.value) || 0
                            }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Tópicos dominados</label>
                          <input
                            type="number"
                            min="0"
                            value={customTarget.topicsMastered}
                            onChange={(e) => setCustomTarget(prev => ({
                              ...prev,
                              topicsMastered: parseInt(e.target.value) || 0
                            }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Trilhas completadas</label>
                          <input
                            type="number"
                            min="0"
                            value={customTarget.trailsCompleted}
                            onChange={(e) => setCustomTarget(prev => ({
                              ...prev,
                              trailsCompleted: parseInt(e.target.value) || 0
                            }))}
                          />
                        </div>
                        <div className="form-group">
                          <label>Dias de sequência</label>
                          <input
                            type="number"
                            min="0"
                            value={customTarget.streakDays}
                            onChange={(e) => setCustomTarget(prev => ({
                              ...prev,
                              streakDays: parseInt(e.target.value) || 0
                            }))}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      className="create-custom-goal-btn"
                      onClick={handleCreateCustom}
                      disabled={!customTitle.trim() || !customDescription.trim()}
                    >
                      Criar Meta Personalizada
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose || (() => {})} title="🎯 Metas de Aprendizado">
      {content}
    </BaseModal>
  );
};

export default LearningGoalsModal;
