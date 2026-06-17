import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { m, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../hooks/context/useGamification';
import { GamificationSystem } from '../../utils/gamification';
import BaseModal from './BaseModal';
import MaterialIcon from '@/components/ui/MaterialIcon';
import '../../styles/achievements.css';

interface AchievementsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isEmbedded?: boolean;
}

export default function AchievementsModal({ isOpen = true, onClose, isEmbedded = false }: AchievementsModalProps) {
  const { t } = useTranslation(['achievements', 'translation']);
  const { userProgress, getRecentAchievements, getLevelProgress } = useGamification();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'learning' | 'streak' | 'social' | 'special'>('all');

  const allAchievements = GamificationSystem.getAchievements().map(achievement => ({
    ...achievement,
    title: t(`achievements.list.${achievement.id}.title`, achievement.title),
    description: t(`achievements.list.${achievement.id}.description`, achievement.description)
  }));
  const recentAchievements = getRecentAchievements().map(achievement => ({
    ...achievement,
    title: t(`achievements.list.${achievement.id}.title`, achievement.title),
    description: t(`achievements.list.${achievement.id}.description`, achievement.description)
  }));
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

  const content = (
    <div className="achievements-modal">
      {/* Level Progress */}
      <div className="level-section">
        <div className="level-header">
          <div className="level-info">
            <h3>{t('achievements.level', { level: userProgress.level })}</h3>
            <div className="xp-info">
              <span>{userProgress.xp} XP</span>
              <span>{t('achievements.xp_to_next', { xp: userProgress.xpToNext })}</span>
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
            {recentAchievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="recent-item">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="recent-info">
                  <span className="achievement-name">{achievement.title}</span>
                  <span className="achievement-date">
                    {achievement.unlockedAt?.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((category) => (
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
        <AnimatePresence>
          {filteredAchievements.map((achievement) => {
            const unlockedAchievement = userProgress.achievements.find(a => a.id === achievement.id);
            const isUnlocked = !!unlockedAchievement;

            return (
              <m.div
                key={achievement.id}
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="achievement-header">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <div className="achievement-info">
                    <h4 className="achievement-name">{achievement.title}</h4>
                    <span className={`achievement-category category-${achievement.category}`}>
                      {t(`achievements.categories.${achievement.category}`)}
                    </span>
                  </div>
                </div>

                <p className="achievement-description">{achievement.description}</p>

                <div className="achievement-requirements">
                  <div className="requirement-item">
                    <span className="requirement-text">
                      {t(`achievements.requirements.${achievement.requirements.type}`, {
                        value: achievement.requirements.value
                      })}
                    </span>
                    <span className={`requirement-status ${isUnlocked ? 'met' : 'pending'}`}>
                      {isUnlocked ? '✓' : '○'}
                    </span>
                  </div>
                </div>

                {achievement.reward && (
                  <div className="achievement-reward">
                    <span className="reward-label">{t('achievements.reward')}:</span>
                    <span className="reward-value">+{achievement.reward.xp} XP</span>
                  </div>
                )}

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
              </m.div>
            );
          })}
        </AnimatePresence>
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
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose || (() => {})} title={t('achievements.title')} size="large">
      {content}
    </BaseModal>
  );
}
