export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: 'questions_answered' | 'correct_answers' | 'streak_days' | 'topics_mastered' | 'study_time' | 'trails_completed';
    value: number;
  };
  reward?: {
    xp: number;
    title?: string;
  };
  unlockedAt?: Date;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNext: number;
  achievements: Achievement[];
  unlockedAchievements: string[];
  stats: {
    totalQuestionsAnswered: number;
    totalCorrectAnswers: number;
    currentStreak: number;
    longestStreak: number;
    totalStudyTime: number; // in minutes
    topicsMastered: number;
    trailsCompleted: number;
  };
  lastActivity: Date;
}

export class GamificationSystem {
  private static readonly XP_PER_LEVEL = 100;
  private static readonly ACHIEVEMENTS: Achievement[] = [
    // Learning Achievements
    {
      id: 'first_question',
      title: 'Primeira Questão',
      description: 'Responda sua primeira questão',
      icon: '🎯',
      category: 'learning',
      rarity: 'common',
      requirements: { type: 'questions_answered', value: 1 },
      reward: { xp: 10 }
    },
    {
      id: 'quiz_master',
      title: 'Mestre dos Quizzes',
      description: 'Responda 100 questões corretamente',
      icon: '🧠',
      category: 'learning',
      rarity: 'rare',
      requirements: { type: 'correct_answers', value: 100 },
      reward: { xp: 100 }
    },
    {
      id: 'scholar',
      title: 'Erudito',
      description: 'Responda 500 questões corretamente',
      icon: '🎓',
      category: 'learning',
      rarity: 'epic',
      requirements: { type: 'correct_answers', value: 500 },
      reward: { xp: 250 }
    },
    {
      id: 'topic_expert',
      title: 'Especialista',
      description: 'Domine 5 tópicos diferentes',
      icon: '⭐',
      category: 'learning',
      rarity: 'rare',
      requirements: { type: 'topics_mastered', value: 5 },
      reward: { xp: 150 }
    },

    // Streak Achievements
    {
      id: 'consistent_learner',
      title: 'Aprendiz Consistente',
      description: 'Estude por 7 dias consecutivos',
      icon: '🔥',
      category: 'streak',
      rarity: 'rare',
      requirements: { type: 'streak_days', value: 7 },
      reward: { xp: 75 }
    },
    {
      id: 'dedicated_student',
      title: 'Estudante Dedicado',
      description: 'Estude por 30 dias consecutivos',
      icon: '💪',
      category: 'streak',
      rarity: 'epic',
      requirements: { type: 'streak_days', value: 30 },
      reward: { xp: 200 }
    },

    // Study Time Achievements
    {
      id: 'study_beginner',
      title: 'Iniciante',
      description: 'Estude por 1 hora',
      icon: '📖',
      category: 'learning',
      rarity: 'common',
      requirements: { type: 'study_time', value: 60 },
      reward: { xp: 25 }
    },
    {
      id: 'study_warrior',
      title: 'Guerreiro do Estudo',
      description: 'Estude por 10 horas',
      icon: '⚔️',
      category: 'learning',
      rarity: 'rare',
      requirements: { type: 'study_time', value: 600 },
      reward: { xp: 150 }
    },

    // Trail Achievements
    {
      id: 'trail_explorer',
      title: 'Explorador de Trilhas',
      description: 'Complete 5 trilhas de aprendizado',
      icon: '🗺️',
      category: 'learning',
      rarity: 'rare',
      requirements: { type: 'trails_completed', value: 5 },
      reward: { xp: 125 }
    }
  ];

  static getAchievements(): Achievement[] {
    return this.ACHIEVEMENTS;
  }

  static calculateLevel(xp: number): { level: number; xpToNext: number } {
    const level = Math.floor(xp / this.XP_PER_LEVEL) + 1;
    const xpToNext = (level * this.XP_PER_LEVEL) - xp;
    return { level, xpToNext };
  }

  static checkAchievementUnlock(progress: UserProgress, achievement: Achievement): boolean {
    const stat = progress.stats[achievement.requirements.type as keyof typeof progress.stats];
    return typeof stat === 'number' && stat >= achievement.requirements.value;
  }

  static updateProgress(
    currentProgress: UserProgress,
    action: {
      type: 'question_answered' | 'correct_answer' | 'study_time' | 'topic_mastered' | 'trail_completed';
      value?: number;
    }
  ): UserProgress {
    const newProgress = { ...currentProgress };
    newProgress.lastActivity = new Date();

    // Update stats
    switch (action.type) {
      case 'question_answered':
        newProgress.stats.totalQuestionsAnswered += 1;
        break;
      case 'correct_answer':
        newProgress.stats.totalCorrectAnswers += 1;
        newProgress.stats.totalQuestionsAnswered += 1;
        break;
      case 'study_time':
        newProgress.stats.totalStudyTime += action.value || 0;
        break;
      case 'topic_mastered':
        newProgress.stats.topicsMastered += 1;
        break;
      case 'trail_completed':
        newProgress.stats.trailsCompleted += 1;
        break;
    }

    // Check for new achievements
    const newAchievements: Achievement[] = [];
    this.ACHIEVEMENTS.forEach(achievement => {
      if (!newProgress.unlockedAchievements.includes(achievement.id) &&
          this.checkAchievementUnlock(newProgress, achievement)) {
        const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
        newAchievements.push(unlockedAchievement);
        newProgress.unlockedAchievements.push(achievement.id);
        newProgress.achievements.push(unlockedAchievement);

        // Award XP
        if (achievement.reward?.xp) {
          newProgress.xp += achievement.reward.xp;
        }
      }
    });

    // Update level
    const levelInfo = this.calculateLevel(newProgress.xp);
    newProgress.level = levelInfo.level;
    newProgress.xpToNext = levelInfo.xpToNext;

    return newProgress;
  }

  static getRarityColor(rarity: Achievement['rarity']): string {
    switch (rarity) {
      case 'common': return '#8B8B8B';
      case 'rare': return '#4A90E2';
      case 'epic': return '#9B59B6';
      case 'legendary': return '#F39C12';
      default: return '#8B8B8B';
    }
  }

  static getCategoryIcon(category: Achievement['category']): string {
    switch (category) {
      case 'learning': return '📚';
      case 'streak': return '🔥';
      case 'social': return '👥';
      case 'special': return '✨';
      default: return '🏆';
    }
  }
}