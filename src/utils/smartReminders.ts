import { SRSItem } from './srsAlgorithm';

export interface StudyReminder {
  id: string;
  type: 'srs_due' | 'streak_maintenance' | 'topic_review' | 'weekly_goal';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  data?: {
    itemId?: string;
    topic?: string;
    streakDays?: number;
    questionsDue?: number;
  };
}

export class SmartReminderSystem {
  private static readonly STORAGE_KEY = 'psymind_study_reminders';

  // Calcular próximos lembretes baseados nos itens SRS
  static generateReminders(srsData: Record<string, SRSItem>): StudyReminder[] {
    const reminders: StudyReminder[] = [];
    const now = new Date();

    // Lembretes para itens SRS vencidos ou próximos do vencimento
    Object.entries(srsData).forEach(([itemId, item]) => {
      const timeUntilDue = item.nextReview.getTime() - now.getTime();
      const hoursUntilDue = timeUntilDue / (1000 * 60 * 60);

      if (timeUntilDue <= 0) {
        // Item vencido - alta prioridade
        reminders.push({
          id: `srs_overdue_${itemId}`,
          type: 'srs_due',
          title: 'Revisão Pendente',
          message: `Você tem uma revisão pendente no SRS. Não deixe seu progresso esfriar!`,
          priority: 'high',
          dueDate: item.nextReview,
          data: { itemId, topic: item.examType }
        });
      } else if (hoursUntilDue <= 24) {
        // Vence nas próximas 24h - média prioridade
        reminders.push({
          id: `srs_due_soon_${itemId}`,
          type: 'srs_due',
          title: 'Revisão Próxima',
          message: `Uma revisão estará disponível em ${Math.ceil(hoursUntilDue)} horas. Mantenha o ritmo!`,
          priority: 'medium',
          dueDate: item.nextReview,
          data: { itemId, topic: item.examType }
        });
      }
    });

    // Lembrete de manutenção de streak
    const lastActivity = this.getLastActivityDate();
    if (lastActivity) {
      const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceActivity >= 1) {
        reminders.push({
          id: 'streak_warning',
          type: 'streak_maintenance',
          title: 'Mantenha sua Sequência!',
          message: `Você não estuda há ${daysSinceActivity} dia${daysSinceActivity > 1 ? 's' : ''}. Quebre o gelo com algumas questões!`,
          priority: daysSinceActivity >= 3 ? 'high' : 'medium',
          dueDate: new Date(now.getTime() + (24 - now.getHours()) * 60 * 60 * 1000), // Próxima meia-noite
          data: { streakDays: daysSinceActivity }
        });
      }
    }

    // Lembrete semanal de metas
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Domingo da semana
    const questionsThisWeek = this.getQuestionsAnsweredThisWeek();

    if (questionsThisWeek < 50) { // Meta semanal de 50 questões
      const remaining = 50 - questionsThisWeek;
      reminders.push({
        id: 'weekly_goal_reminder',
        type: 'weekly_goal',
        title: 'Meta Semanal',
        message: `Você respondeu ${questionsThisWeek} questões esta semana. Faltam ${remaining} para alcançar sua meta!`,
        priority: remaining > 25 ? 'high' : 'medium',
        dueDate: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000), // Fim da semana
        data: { questionsDue: remaining }
      });
    }

    return reminders.sort((a, b) => {
      // Ordenar por prioridade e data
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }

  // Verificar se deve mostrar notificação baseada na frequência
  static shouldShowNotification(reminder: StudyReminder): boolean {
    const lastShown = this.getLastShownTime(reminder.id);
    const now = new Date();

    switch (reminder.priority) {
      case 'high':
        // Mostrar imediatamente e repetir a cada 2 horas
        return !lastShown || (now.getTime() - lastShown.getTime()) > (2 * 60 * 60 * 1000);
      case 'medium':
        // Mostrar uma vez por dia
        return !lastShown || (now.getTime() - lastShown.getTime()) > (24 * 60 * 60 * 1000);
      case 'low':
        // Mostrar uma vez por semana
        return !lastShown || (now.getTime() - lastShown.getTime()) > (7 * 24 * 60 * 60 * 1000);
      default:
        return false;
    }
  }

  // Mostrar notificação do navegador
  static async showBrowserNotification(reminder: StudyReminder): Promise<void> {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const notification = new Notification(reminder.title, {
          body: reminder.message,
          icon: '/psymind-icon.png',
          badge: '/psymind-badge.png',
          tag: reminder.id, // Previne notificações duplicadas
          requireInteraction: reminder.priority === 'high',
          silent: false
        });

        // Marcar como mostrada
        this.markAsShown(reminder.id);

        // Auto-close após 5 segundos para notificações não críticas
        if (reminder.priority !== 'high') {
          setTimeout(() => notification.close(), 5000);
        }

        // Click handler - pode abrir o app ou modal específico
        notification.onclick = () => {
          window.focus();
          // Aqui poderia abrir um modal específico baseado no tipo de lembrete
          notification.close();
        };
      }
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
    }
  }

  // Métodos auxiliares para persistência
  private static getLastActivityDate(): Date | null {
    try {
      const data = localStorage.getItem('psymind_gamification_progress');
      if (data) {
        const progress = JSON.parse(data);
        return progress.lastActivity ? new Date(progress.lastActivity) : null;
      }
    } catch (error) {
      console.error('Erro ao ler data da última atividade:', error);
    }
    return null;
  }

  private static getQuestionsAnsweredThisWeek(): number {
    try {
      const data = localStorage.getItem('psymind_gamification_progress');
      if (data) {
        const progress = JSON.parse(data);
        return progress.stats?.totalQuestionsAnswered || 0;
      }
    } catch (error) {
      console.error('Erro ao ler estatísticas:', error);
    }
    return 0;
  }

  private static getLastShownTime(reminderId: string): Date | null {
    try {
      const shown = localStorage.getItem(`${this.STORAGE_KEY}_shown`);
      if (shown) {
        const shownTimes = JSON.parse(shown);
        const time = shownTimes[reminderId];
        return time ? new Date(time) : null;
      }
    } catch (error) {
      console.error('Erro ao ler tempos de exibição:', error);
    }
    return null;
  }

  private static markAsShown(reminderId: string): void {
    try {
      const shown = localStorage.getItem(`${this.STORAGE_KEY}_shown`) || '{}';
      const shownTimes = JSON.parse(shown);
      shownTimes[reminderId] = new Date().toISOString();
      localStorage.setItem(`${this.STORAGE_KEY}_shown`, JSON.stringify(shownTimes));
    } catch (error) {
      console.error('Erro ao salvar tempo de exibição:', error);
    }
  }

  // Sistema de agendamento de lembretes
  static scheduleReminders(srsData: Record<string, SRSItem>): void {
    const reminders = this.generateReminders(srsData);

    reminders.forEach(reminder => {
      if (this.shouldShowNotification(reminder)) {
        // Agendar para mostrar em momento apropriado
        const delay = Math.max(0, reminder.dueDate.getTime() - Date.now());

        setTimeout(() => {
          this.showBrowserNotification(reminder);
        }, Math.min(delay, 24 * 60 * 60 * 1000)); // Máximo 24h de antecedência
      }
    });
  }

  // Verificar lembretes periodicamente (pode ser chamado por um service worker)
  static checkAndShowReminders(srsData: Record<string, SRSItem>): void {
    const reminders = this.generateReminders(srsData);
    const urgentReminders = reminders.filter(r => r.priority === 'high' && r.dueDate <= new Date());

    urgentReminders.forEach(reminder => {
      if (this.shouldShowNotification(reminder)) {
        this.showBrowserNotification(reminder);
      }
    });
  }
}