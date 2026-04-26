export interface ExamDefinition {
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
  id: 'international' | 'national' | 'regional' | 'olympiads';
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
