import { useCallback } from 'react';
import { Telemetry, ExamTelemetryPayload, ExamCategoryType } from '../services/analytics/telemetry';

export const useExamTelemetry = () => {
  const trackFunnel = useCallback((category?: ExamCategoryType, target_exam?: string) => {
    Telemetry.trackExam('FUNNEL', { category, target_exam });
  }, []);

  const trackInteraction = useCallback((subject: string, topic?: string, exam?: string) => {
    Telemetry.trackExam('INTERACTION', {
      subject_access: subject,
      topic_depth: topic,
      target_exam: exam
    });
  }, []);

  const trackConversion = useCallback((feature: 'ai_study_plan_click' | 'exam_strategy_view', exam?: string, subject?: string) => {
    Telemetry.trackExam('CONVERSION', {
      feature_id: feature,
      target_exam: exam,
      subject_access: subject
    });
  }, []);

  return {
    trackFunnel,
    trackInteraction,
    trackConversion
  };
};
