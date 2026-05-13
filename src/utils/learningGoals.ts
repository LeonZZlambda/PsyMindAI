export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: {
    questionsAnswered?: number;
    correctAnswers?: number;
    studyTime?: number; // in minutes
    topicsMastered?: number;
    trailsCompleted?: number;
    streakDays?: number;
  };
  progress: {
    questionsAnswered: number;
    correctAnswers: number;
    studyTime: number;
    topicsMastered: number;
    trailsCompleted: number;
    streakDays: number;
  };
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
  isActive: boolean;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: LearningGoal['target'];
  icon: string;
}

export class LearningGoalsSystem {
  private static readonly STORAGE_KEY = 'psymind_learning_goals';
  private static readonly TEMPLATES: GoalTemplate[] = [
    {
      id: 'daily_questions',
      title: 'Maratonista Diário',
      description: 'Responda 20 questões por dia',
      type: 'daily',
      target: { questionsAnswered: 20 },
      icon: '🎯'
    },
    {
      id: 'weekly_mastery',
      title: 'Mestre Semanal',
      description: 'Domine 3 novos tópicos por semana',
      type: 'weekly',
      target: { topicsMastered: 3 },
      icon: '🧠'
    },
    {
      id: 'study_streak',
      title: 'Sequência de Estudo',
      description: 'Estude por 7 dias consecutivos',
      type: 'custom',
      target: { streakDays: 7 },
      icon: '🔥'
    },
    {
      id: 'accuracy_focus',
      title: 'Precisão Perfeita',
      description: 'Acerte 90% das questões em uma semana',
      type: 'weekly',
      target: { correctAnswers: 50 }, // Assumindo meta de 50+ questões
      icon: '🎯'
    },
    {
      id: 'trail_explorer',
      title: 'Explorador de Trilhas',
      description: 'Complete 5 trilhas de aprendizado',
      type: 'monthly',
      target: { trailsCompleted: 5 },
      icon: '🗺️'
    }
  ];

  static getTemplates(): GoalTemplate[] {
    return this.TEMPLATES;
  }

  static createGoal(template: GoalTemplate, customDeadline?: Date): LearningGoal {
    const deadline = customDeadline || this.calculateDeadline(template.type);

    return {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: template.title,
      description: template.description,
      type: template.type,
      target: { ...template.target },
      progress: {
        questionsAnswered: 0,
        correctAnswers: 0,
        studyTime: 0,
        topicsMastered: 0,
        trailsCompleted: 0,
        streakDays: 0,
      },
      deadline,
      createdAt: new Date(),
      isActive: true,
    };
  }

  static createCustomGoal(
    title: string,
    description: string,
    target: LearningGoal['target'],
    deadline?: Date
  ): LearningGoal {
    return {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      type: 'custom',
      target,
      progress: {
        questionsAnswered: 0,
        correctAnswers: 0,
        studyTime: 0,
        topicsMastered: 0,
        trailsCompleted: 0,
        streakDays: 0,
      },
      deadline,
      createdAt: new Date(),
      isActive: true,
    };
  }

  private static calculateDeadline(type: 'daily' | 'weekly' | 'monthly' | 'custom'): Date | undefined {
    if (type === 'custom') return undefined;
    const now = new Date();
    switch (type) {
      case 'daily':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      case 'weekly': {
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + (7 - now.getDay()));
        return nextWeek;
      }
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default 1 day
    }
  }

  static updateGoalProgress(
    goal: LearningGoal,
    action: {
      type: 'question_answered' | 'correct_answer' | 'study_time' | 'topic_mastered' | 'trail_completed' | 'streak_updated';
      value?: number;
    }
  ): LearningGoal {
    const updatedGoal = { ...goal };

    switch (action.type) {
      case 'question_answered':
        updatedGoal.progress.questionsAnswered += 1;
        break;
      case 'correct_answer':
        updatedGoal.progress.correctAnswers += 1;
        updatedGoal.progress.questionsAnswered += 1;
        break;
      case 'study_time':
        updatedGoal.progress.studyTime += action.value || 0;
        break;
      case 'topic_mastered':
        updatedGoal.progress.topicsMastered += 1;
        break;
      case 'trail_completed':
        updatedGoal.progress.trailsCompleted += 1;
        break;
      case 'streak_updated':
        updatedGoal.progress.streakDays = action.value || 0;
        break;
    }

    // Check if goal is completed
    if (this.isGoalCompleted(updatedGoal) && !updatedGoal.completedAt) {
      updatedGoal.completedAt = new Date();
      updatedGoal.isActive = false;
    }

    return updatedGoal;
  }

  static isGoalCompleted(goal: LearningGoal): boolean {
    const { target, progress } = goal;

    if (target.questionsAnswered && progress.questionsAnswered < target.questionsAnswered) return false;
    if (target.correctAnswers && progress.correctAnswers < target.correctAnswers) return false;
    if (target.studyTime && progress.studyTime < target.studyTime) return false;
    if (target.topicsMastered && progress.topicsMastered < target.topicsMastered) return false;
    if (target.trailsCompleted && progress.trailsCompleted < target.trailsCompleted) return false;
    if (target.streakDays && progress.streakDays < target.streakDays) return false;

    return true;
  }

  static getGoalProgressPercentage(goal: LearningGoal): number {
    const { target, progress } = goal;
    let totalProgress = 0;
    let totalTarget = 0;

    // Calculate weighted progress
    if (target.questionsAnswered) {
      totalProgress += Math.min(progress.questionsAnswered / target.questionsAnswered, 1);
      totalTarget += 1;
    }
    if (target.correctAnswers) {
      totalProgress += Math.min(progress.correctAnswers / target.correctAnswers, 1);
      totalTarget += 1;
    }
    if (target.studyTime) {
      totalProgress += Math.min(progress.studyTime / target.studyTime, 1);
      totalTarget += 1;
    }
    if (target.topicsMastered) {
      totalProgress += Math.min(progress.topicsMastered / target.topicsMastered, 1);
      totalTarget += 1;
    }
    if (target.trailsCompleted) {
      totalProgress += Math.min(progress.trailsCompleted / target.trailsCompleted, 1);
      totalTarget += 1;
    }
    if (target.streakDays) {
      totalProgress += Math.min(progress.streakDays / target.streakDays, 1);
      totalTarget += 1;
    }

    return totalTarget > 0 ? (totalProgress / totalTarget) * 100 : 0;
  }

  static getTimeRemaining(goal: LearningGoal): { days: number; hours: number; isOverdue: boolean } {
    if (!goal.deadline) return { days: 0, hours: 0, isOverdue: false };

    const now = new Date();
    const timeDiff = goal.deadline.getTime() - now.getTime();
    const isOverdue = timeDiff < 0;

    const absTimeDiff = Math.abs(timeDiff);
    const days = Math.floor(absTimeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return { days, hours, isOverdue };
  }

  static getMotivationalMessage(goal: LearningGoal): string {
    const percentage = this.getGoalProgressPercentage(goal);
    const timeRemaining = this.getTimeRemaining(goal);

    if (goal.completedAt) {
      return "🎉 Parabéns! Meta alcançada!";
    }

    if (timeRemaining.isOverdue) {
      return "⏰ O prazo passou, mas você ainda pode completar!";
    }

    if (percentage >= 80) {
      return "🚀 Quase lá! Você está arrasando!";
    } else if (percentage >= 50) {
      return "💪 Metade do caminho andado. Continue assim!";
    } else if (percentage >= 25) {
      return "🌟 Bom começo! Mantenha o foco!";
    } else {
      return "🎯 Vamos começar! Cada passo conta!";
    }
  }

  // Storage methods
  static saveGoals(goals: LearningGoal[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar metas:', error);
    }
  }

  static loadGoals(): LearningGoal[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const goals = JSON.parse(data);
        // Convert date strings back to Date objects
        return goals.map((goal: any) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          deadline: goal.deadline ? new Date(goal.deadline) : undefined,
          completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
    return [];
  }

  static getActiveGoals(): LearningGoal[] {
    return this.loadGoals().filter(goal => goal.isActive);
  }

  static getCompletedGoals(): LearningGoal[] {
    return this.loadGoals().filter(goal => goal.completedAt);
  }
}