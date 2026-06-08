export interface ExamDefinition {
  calculatorType?: 'act' | 'alevels' | 'abitur' | 'enem' | 'gaokao' | 'gmat' | 'gre' | 'ib' | 'ielts' | 'jee_main' | 'sat' | 'toefl';
  fullName: string;
  isCalculator?: boolean;
  name: string;
  subjects: string[];
}

export interface ExamCategory {
  className: string;
  color: string;
  exams: ExamDefinition[];
  icon: string;
  id: 'undergraduate_admissions' | 'language_proficiency' | 'international_curricula' | 'graduate_professional' | 'exam_score_calculators' | 'olympiads';
  title: string;
}

export interface SubjectVisualConfig {
  className: string;
  icon: string;
}

export interface JudgeConfig {
  examName: string;
  subject: string;
  topics: string[];
}

export interface QuizConfig {
  exam: string;
  subject: string;
  topic: string;
}
