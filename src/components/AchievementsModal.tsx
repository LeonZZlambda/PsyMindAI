import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import { GamificationSystem } from '../utils/gamification';
import BaseModal from './BaseModal';
import '../styles/achievements.css';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const { t } = useTranslation(['achievements', 'translation']);
  const { userProgress, getRecentAchievements, getLevelProgress } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'learning' | 'streak' | 'social' | 'special'>('all');

  const allAchievements = GamificationSystem.getAchievements();
  const recentAchievements = getRecentAchievements();
  const levelProgress = getLevelProgress();

  const filteredAchievements = selectedCategory === 'all'
    ? allAchievements
    : allAchievements.filter(a => a.category === selectedCategory);

  const categories = [
    { id: 'all' as const, label: t('achievements.categories.all'), icon: '🏆' },
    { id: 'learning' as const, label: t('achievements.categories.learning'), icon: '📚' },
    { id: 'streak' as const, label: t('achievements.categories.streak'), icon: '🔥' },
    { id: 'social' as const, label: t('achievements.categories.social'), icon: '👥' },
    { id: 'special' as const, label: t('achievements.categories.special'), icon: '✨' },
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={t('achievements.title')} size="large">
      <div className="achievements-modal">
        {/* Level Progress */}
        <div className="level-section">
          <div className="level-header">
            <div className="level-info">
              <h3>{t('achievements.level', { level: userProgress.level })}</h3>
              <div className="xp-info">
                <span>{userProgress.xp} XP</span>
                <span>{userProgress.xpToNext} XP para o próximo nível</span>
              </div>
            </div>
            <div className="level-badge">
              <span className="level-number">{userProgress.level}</span>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${levelProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <div className="recent-achievements">
            <h4>{t('achievements.recent')}</h4>
            <div className="recent-list">
              {recentAchievements.map(achievement => (
                <motion.div
                  key={achievement.id}
                  className="recent-achievement"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h5>{achievement.title}</h5>
                    <p>{achievement.description}</p>
                  </div>
                  <div
                    className="rarity-indicator"
                    style={{ backgroundColor: GamificationSystem.getRarityColor(achievement.rarity) }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="achievements-grid">
          {filteredAchievements.map(achievement => {
            const isUnlocked = userProgress.unlockedAchievements.includes(achievement.id);
            const unlockedAchievement = userProgress.achievements.find(a => a.id === achievement.id);

            return (
              <motion.div
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="achievement-header">
                  <div className="achievement-icon-large">{achievement.icon}</div>
                  <div
                    className="rarity-badge"
                    style={{ backgroundColor: GamificationSystem.getRarityColor(achievement.rarity) }}
                  >
                    {t(`achievements.rarity.${achievement.rarity}`)}
                  </div>
                </div>

                <div className="achievement-content">
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>

                  <div className="achievement-requirements">
                    <span className="requirement-label">{t('achievements.requirements')}:</span>
                    <span className="requirement-value">
                      {t(`achievements.requirements.${achievement.requirements.type}`, {
                        value: achievement.requirements.value
                      })}
                    </span>
                  </div>

                  {achievement.reward && (
                    <div className="achievement-reward">
                      <span className="reward-label">{t('achievements.reward')}:</span>
                      <span className="reward-value">+{achievement.reward.xp} XP</span>
                    </div>
                  )}
                </div>

                {isUnlocked && unlockedAchievement?.unlockedAt && (
                  <div className="achievement-unlocked">
                    <MaterialIcon name="check_circle" />
                    <span>
                      {t('achievements.unlocked_at', {
                        date: unlockedAchievement.unlockedAt.toLocaleDateString()
                      })}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <h4>{t('achievements.stats.title')}</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{userProgress.stats.totalQuestionsAnswered}</span>
              <span className="stat-label">{t('achievements.stats.questions_answered')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userProgress.stats.totalCorrectAnswers}</span>
              <span className="stat-label">{t('achievements.stats.correct_answers')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(userProgress.stats.totalStudyTime / 60 * 10) / 10}h</span>
              <span className="stat-label">{t('achievements.stats.study_time')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userProgress.stats.trailsCompleted}</span>
              <span className="stat-label">{t('achievements.stats.trails_completed')}</span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}