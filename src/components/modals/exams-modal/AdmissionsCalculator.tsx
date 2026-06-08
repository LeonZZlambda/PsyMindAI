import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChat } from '../../../hooks/context/useChat';
import type { ExamDefinition } from './types';

type AdmissionsCalculatorProps = {
  exam: ExamDefinition;
  onClose: () => void;
};

type FieldConfig = {
  icon: string;
  id: string;
  label: { en: string; pt: string };
  max: number;
  min: number;
  step?: number;
};

type CalculatorConfig = {
  fields: FieldConfig[];
  note: { en: string; pt: string };
  resultLabel: { en: string; pt: string };
};

type CalculatorResult = {
  details: string[];
  note: string;
  primary: string;
  secondary?: string;
};

const aLevelPoints: Record<string, number> = {
  'A*': 56,
  A: 48,
  B: 40,
  C: 32,
  D: 24,
  E: 16,
  U: 0,
};

const calculatorConfigs: Record<NonNullable<ExamDefinition['calculatorType']>, CalculatorConfig> = {
  act: {
    fields: [
      { id: 'english', icon: 'translate', min: 1, max: 36, label: { en: 'English score (1-36)', pt: 'Nota de English (1-36)' } },
      { id: 'math', icon: 'calculate', min: 1, max: 36, label: { en: 'Math score (1-36)', pt: 'Nota de Math (1-36)' } },
      { id: 'reading', icon: 'auto_stories', min: 1, max: 36, label: { en: 'Reading score (1-36)', pt: 'Nota de Reading (1-36)' } },
      { id: 'science', icon: 'biotech', min: 1, max: 36, label: { en: 'Science score (1-36)', pt: 'Nota de Science (1-36)' } },
      { id: 'writing', icon: 'edit_note', min: 2, max: 12, label: { en: 'Optional writing score (2-12)', pt: 'Writing opcional (2-12)' } },
    ],
    resultLabel: { en: 'Estimated ACT Composite', pt: 'ACT Composite estimado' },
    note: {
      en: 'Composite is the rounded average of English, Math, Reading, and Science. Writing is reported separately.',
      pt: 'O Composite é a média arredondada de English, Math, Reading e Science. Writing é reportado separadamente.',
    },
  },
  alevels: {
    fields: [
      { id: 'subject1', icon: 'looks_one', min: 0, max: 0, label: { en: 'A-Level subject 1', pt: 'A-Level matéria 1' } },
      { id: 'subject2', icon: 'looks_two', min: 0, max: 0, label: { en: 'A-Level subject 2', pt: 'A-Level matéria 2' } },
      { id: 'subject3', icon: 'looks_3', min: 0, max: 0, label: { en: 'A-Level subject 3', pt: 'A-Level matéria 3' } },
      { id: 'subject4', icon: 'counter_4', min: 0, max: 0, label: { en: 'A-Level subject 4', pt: 'A-Level matéria 4' } },
    ],
    resultLabel: { en: 'UCAS Tariff Points', pt: 'Pontos UCAS Tariff' },
    note: {
      en: 'A-Level UCAS Tariff mapping used: A*=56, A=48, B=40, C=32, D=24, E=16, U=0.',
      pt: 'Conversão UCAS Tariff usada: A*=56, A=48, B=40, C=32, D=24, E=16, U=0.',
    },
  },
  enem: {
    fields: [],
    resultLabel: { en: 'ENEM score', pt: 'Nota ENEM' },
    note: { en: 'Uses the dedicated ENEM calculator.', pt: 'Usa a calculadora dedicada do ENEM.' },
  },
  ib: {
    fields: [
      { id: 'subject1', icon: 'looks_one', min: 1, max: 7, label: { en: 'Subject 1 grade (1-7)', pt: 'Nota da matéria 1 (1-7)' } },
      { id: 'subject2', icon: 'looks_two', min: 1, max: 7, label: { en: 'Subject 2 grade (1-7)', pt: 'Nota da matéria 2 (1-7)' } },
      { id: 'subject3', icon: 'looks_3', min: 1, max: 7, label: { en: 'Subject 3 grade (1-7)', pt: 'Nota da matéria 3 (1-7)' } },
      { id: 'subject4', icon: 'counter_4', min: 1, max: 7, label: { en: 'Subject 4 grade (1-7)', pt: 'Nota da matéria 4 (1-7)' } },
      { id: 'subject5', icon: 'counter_5', min: 1, max: 7, label: { en: 'Subject 5 grade (1-7)', pt: 'Nota da matéria 5 (1-7)' } },
      { id: 'subject6', icon: 'counter_6', min: 1, max: 7, label: { en: 'Subject 6 grade (1-7)', pt: 'Nota da matéria 6 (1-7)' } },
      { id: 'core', icon: 'hub', min: 0, max: 3, label: { en: 'TOK/EE core points (0-3)', pt: 'Pontos TOK/EE (0-3)' } },
    ],
    resultLabel: { en: 'IB Diploma Points', pt: 'Pontos do Diploma IB' },
    note: {
      en: 'Adds six subject grades plus up to 3 core points. Diploma award also depends on IB minimum conditions.',
      pt: 'Soma seis matérias e até 3 pontos do núcleo. A obtenção do diploma também depende das condições mínimas do IB.',
    },
  },
  jee_main: {
    fields: [
      { id: 'correct', icon: 'check_circle', min: 0, max: 75, label: { en: 'Correct answers', pt: 'Respostas corretas' } },
      { id: 'incorrect', icon: 'cancel', min: 0, max: 75, label: { en: 'Incorrect answers', pt: 'Respostas incorretas' } },
    ],
    resultLabel: { en: 'JEE Main Raw Score', pt: 'Pontuação bruta JEE Main' },
    note: {
      en: 'Raw score uses +4 for each correct answer and -1 for each incorrect answer. Final percentile/rank depends on normalization.',
      pt: 'A pontuação bruta usa +4 por acerto e -1 por erro. Percentil e ranking finais dependem da normalização.',
    },
  },
  sat: {
    fields: [
      { id: 'readingWriting', icon: 'auto_stories', min: 200, max: 800, step: 10, label: { en: 'Reading and Writing (200-800)', pt: 'Reading and Writing (200-800)' } },
      { id: 'math', icon: 'calculate', min: 200, max: 800, step: 10, label: { en: 'Math (200-800)', pt: 'Math (200-800)' } },
    ],
    resultLabel: { en: 'SAT Total Score', pt: 'Pontuação total SAT' },
    note: {
      en: 'Total score is the sum of Reading and Writing plus Math. Raw-to-scaled conversion varies by test form.',
      pt: 'A pontuação total soma Reading and Writing e Math. A conversão de acertos para escala varia por prova.',
    },
  },
  gmat: {
    fields: [
      { id: 'quant', icon: 'calculate', min: 0, max: 60, label: { en: 'Quantitative scaled score (0-60)', pt: 'Nota Quantitativa escalonada (0-60)' } },
      { id: 'verbal', icon: 'translate', min: 0, max: 60, label: { en: 'Verbal scaled score (0-60)', pt: 'Nota Verbal escalonada (0-60)' } },
      { id: 'ir', icon: 'hub', min: 0, max: 8, label: { en: 'Integrated Reasoning (0-8)', pt: 'Reasoning Integrado (0-8)' } },
      { id: 'awa', icon: 'edit_note', min: 0, max: 6, label: { en: 'Analytical Writing (0-6)', pt: 'Escrita Analítica (0-6)' } },
    ],
    resultLabel: { en: 'GMAT Total Score', pt: 'Pontuação total GMAT' },
    note: {
      en: 'GMAT total ranges from 200-800. Quantitative and Verbal sections are scaled, while IR and AWA are reported separately.',
      pt: 'Total GMAT varia de 200-800. Seções quantitativa e verbal são escalonadas, enquanto IR e AWA são reportadas separadamente.',
    },
  },
  gre: {
    fields: [
      { id: 'quant', icon: 'calculate', min: 130, max: 170, label: { en: 'Quantitative (130-170)', pt: 'Quantitativo (130-170)' } },
      { id: 'verbal', icon: 'translate', min: 130, max: 170, label: { en: 'Verbal Reasoning (130-170)', pt: 'Reasoning Verbal (130-170)' } },
      { id: 'aw', icon: 'edit_note', min: 0, max: 6, label: { en: 'Analytical Writing (0-6)', pt: 'Escrita Analítica (0-6)' } },
    ],
    resultLabel: { en: 'GRE Total Score', pt: 'Pontuação total GRE' },
    note: {
      en: 'GRE Quantitative and Verbal each range 130-170. Analytical Writing is scored 0-6 and reported separately.',
      pt: 'GRE Quantitativo e Verbal cada um varia de 130-170. Escrita Analítica é 0-6 e reportada separadamente.',
    },
  },
  toefl: {
    fields: [
      { id: 'reading', icon: 'auto_stories', min: 0, max: 30, label: { en: 'Reading (0-30)', pt: 'Reading (0-30)' } },
      { id: 'listening', icon: 'hearing', min: 0, max: 30, label: { en: 'Listening (0-30)', pt: 'Listening (0-30)' } },
      { id: 'speaking', icon: 'record_voice_over', min: 0, max: 30, label: { en: 'Speaking (0-30)', pt: 'Speaking (0-30)' } },
      { id: 'writing', icon: 'edit_note', min: 0, max: 30, label: { en: 'Writing (0-30)', pt: 'Writing (0-30)' } },
    ],
    resultLabel: { en: 'TOEFL Total Score', pt: 'Pontuação total TOEFL' },
    note: {
      en: 'TOEFL iBT total ranges from 0-120. Each section contributes equally (0-30 points each).',
      pt: 'Total TOEFL iBT varia de 0-120. Cada seção contribui igualmente (0-30 pontos cada).',
    },
  },
  ielts: {
    fields: [
      { id: 'reading', icon: 'auto_stories', min: 0, max: 9, step: 0.5, label: { en: 'Reading band (0-9)', pt: 'Banda Reading (0-9)' } },
      { id: 'listening', icon: 'hearing', min: 0, max: 9, step: 0.5, label: { en: 'Listening band (0-9)', pt: 'Banda Listening (0-9)' } },
      { id: 'speaking', icon: 'record_voice_over', min: 0, max: 9, step: 0.5, label: { en: 'Speaking band (0-9)', pt: 'Banda Speaking (0-9)' } },
      { id: 'writing', icon: 'edit_note', min: 0, max: 9, step: 0.5, label: { en: 'Writing band (0-9)', pt: 'Banda Writing (0-9)' } },
    ],
    resultLabel: { en: 'IELTS Overall Band', pt: 'Banda Geral IELTS' },
    note: {
      en: 'IELTS overall band is the average of all four sections, rounded to the nearest half or whole band.',
      pt: 'A banda geral IELTS é a média de todas as quatro seções, arredondada para a meia banda ou banda inteira mais próxima.',
    },
  },
  abitur: {
    fields: [
      { id: 'subj1', icon: 'looks_one', min: 0, max: 15, label: { en: 'Subject 1 score (0-15)', pt: 'Nota matéria 1 (0-15)' } },
      { id: 'subj2', icon: 'looks_two', min: 0, max: 15, label: { en: 'Subject 2 score (0-15)', pt: 'Nota matéria 2 (0-15)' } },
      { id: 'subj3', icon: 'looks_3', min: 0, max: 15, label: { en: 'Subject 3 score (0-15)', pt: 'Nota matéria 3 (0-15)' } },
      { id: 'subj4', icon: 'counter_4', min: 0, max: 15, label: { en: 'Subject 4 score (0-15)', pt: 'Nota matéria 4 (0-15)' } },
    ],
    resultLabel: { en: 'Abitur GPA (Numerus Clausus)', pt: 'GPA Abitur (Numerus Clausus)' },
    note: {
      en: 'Abitur GPA is calculated from the sum of subject scores, converted to German GPA scale (1.0-4.0).',
      pt: 'GPA Abitur é calculado a partir da soma de notas, convertido para a escala alemã de GPA (1,0-4,0).',
    },
  },
  gaokao: {
    fields: [
      { id: 'chinese', icon: 'translate', min: 0, max: 150, label: { en: 'Chinese (0-150)', pt: 'Chinês (0-150)' } },
      { id: 'math', icon: 'calculate', min: 0, max: 150, label: { en: 'Mathematics (0-150)', pt: 'Matemática (0-150)' } },
      { id: 'english', icon: 'translate', min: 0, max: 150, label: { en: 'English (0-150)', pt: 'Inglês (0-150)' } },
      { id: 'others', icon: 'school', min: 0, max: 300, label: { en: 'Other subjects combined (0-300)', pt: 'Outras matérias combinadas (0-300)' } },
    ],
    resultLabel: { en: 'Gaokao Total Score', pt: 'Pontuação total Gaokao' },
    note: {
      en: 'Gaokao total typically ranges from 0-750. Chinese, Math, and English are each 150 points, with remaining points from electives.',
      pt: 'Total Gaokao normalmente varia de 0-750. Chinês, Matemática e Inglês são 150 pontos cada, com pontos restantes de eletivas.',
    },
  },
};

const getLocaleText = (language: string, text: { en: string; pt: string }) => (language.startsWith('pt') ? text.pt : text.en);

export const AdmissionsCalculator: React.FC<AdmissionsCalculatorProps> = ({ exam, onClose }) => {
  const { sendMessage } = useChat();
  const { i18n } = useTranslation();
  const language = i18n.language || 'en';
  const config = exam.calculatorType ? calculatorConfigs[exam.calculatorType] : undefined;
  const [values, setValues] = useState<Record<string, string>>({});
  const [desiredCourse, setDesiredCourse] = useState('');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const isPortuguese = language.startsWith('pt');
  const gradeOptions = useMemo(() => Object.keys(aLevelPoints), []);

  if (!config || !exam.calculatorType) return null;

  const setFieldValue = (id: string, value: string) => {
    const field = config.fields.find((item) => item.id === id);
    if (exam.calculatorType !== 'alevels' && field && value !== '') {
      const numericValue = Number.parseFloat(value);
      if (Number.isNaN(numericValue) || numericValue < field.min || numericValue > field.max) return;
    }

    setValues((previous) => ({ ...previous, [id]: value }));
  };

  const getNumber = (id: string) => Number.parseFloat(values[id] || '0') || 0;

  const calculate = () => {
    let nextResult: CalculatorResult;

    switch (exam.calculatorType) {
      case 'sat': {
        const readingWriting = getNumber('readingWriting');
        const math = getNumber('math');
        const total = readingWriting + math;
        nextResult = {
          primary: total.toString(),
          secondary: `${readingWriting} + ${math}`,
          details: [`${isPortuguese ? 'Faixa oficial' : 'Official range'}: 400-1600`],
          note: getLocaleText(language, config.note),
        };
        break;
      }
      case 'act': {
        const sectionIds = ['english', 'math', 'reading', 'science'];
        const sectionScores = sectionIds.map(getNumber);
        const composite = Math.round(sectionScores.reduce((sum, score) => sum + score, 0) / sectionScores.length);
        const writing = values.writing ? `${isPortuguese ? 'Writing opcional' : 'Optional Writing'}: ${values.writing}` : undefined;
        nextResult = {
          primary: composite.toString(),
          secondary: sectionScores.join(' + '),
          details: [writing].filter(Boolean) as string[],
          note: getLocaleText(language, config.note),
        };
        break;
      }
      case 'ib': {
        const subjectTotal = ['subject1', 'subject2', 'subject3', 'subject4', 'subject5', 'subject6'].reduce((sum, id) => sum + getNumber(id), 0);
        const core = getNumber('core');
        const total = subjectTotal + core;
        nextResult = {
          primary: `${total}/45`,
          secondary: `${isPortuguese ? 'Matérias' : 'Subjects'}: ${subjectTotal}/42 | Core: ${core}/3`,
          details: [total >= 24 ? (isPortuguese ? 'Atinge a referência mínima de 24 pontos.' : 'Meets the 24-point minimum reference.') : (isPortuguese ? 'Abaixo da referência mínima de 24 pontos.' : 'Below the 24-point minimum reference.')],
          note: getLocaleText(language, config.note),
        };
        break;
      }
      case 'alevels': {
        const grades = ['subject1', 'subject2', 'subject3', 'subject4'].map((id) => values[id]).filter(Boolean);
        const total = grades.reduce((sum, grade) => sum + (aLevelPoints[grade] || 0), 0);
        nextResult = {
          primary: total.toString(),
          secondary: grades.map((grade) => `${grade}: ${aLevelPoints[grade] || 0}`).join(' | '),
          details: [],
          note: getLocaleText(language, config.note),
        };
        break;
      }
      case 'jee_main': {
        const correct = getNumber('correct');
        const incorrect = getNumber('incorrect');
        const rawScore = correct * 4 - incorrect;
        nextResult = {
          primary: `${rawScore}/300`,
          secondary: `(${correct} × 4) - (${incorrect} × 1)`,
          details: [],
          note: getLocaleText(language, config.note),
        };
        break;
      }
      default:
        return;
    }

    setResult(nextResult);
    window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));

    if (!desiredCourse) return;

    const prompt = isPortuguese
      ? `Analise meu resultado em ${exam.name} para candidatura universitária.\n\nResultado: ${nextResult.primary}\nDetalhes: ${[nextResult.secondary, ...nextResult.details].filter(Boolean).join(' | ')}\nCurso desejado: ${desiredCourse}\n\nExplique a competitividade, próximos passos, riscos e como melhorar a candidatura.`
      : `Analyze my ${exam.name} result for university admissions.\n\nResult: ${nextResult.primary}\nDetails: ${[nextResult.secondary, ...nextResult.details].filter(Boolean).join(' | ')}\nTarget course: ${desiredCourse}\n\nExplain competitiveness, next steps, risks, and how to improve my application.`;

    sendMessage(prompt);
    onClose();
  };

  return (
    <div className="enem-calculator">
      <div className="calc-extra-inputs">
        <div className="md-input-group full-width has-icon">
          <span className="material-symbols-outlined field-icon">school</span>
          <input id={`${exam.calculatorType}-desired-course`} type="text" value={desiredCourse} onChange={(event) => setDesiredCourse(event.target.value)} placeholder=" " />
          <label htmlFor={`${exam.calculatorType}-desired-course`}>{isPortuguese ? 'Curso desejado (opcional)' : 'Target course (optional)'}</label>
        </div>
      </div>

      <div className="calc-inputs">
        {config.fields.map((field) => (
          <div className="md-input-group has-icon" key={field.id}>
            <span className="material-symbols-outlined field-icon">{field.icon}</span>
            {exam.calculatorType === 'alevels' ? (
              <select id={`${exam.calculatorType}-${field.id}`} value={values[field.id] || ''} onChange={(event) => setFieldValue(field.id, event.target.value)}>
                <option value="">{isPortuguese ? 'Selecione a nota' : 'Select grade'}</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`${exam.calculatorType}-${field.id}`}
                max={field.max}
                min={field.min}
                step={field.step || 1}
                type="number"
                value={values[field.id] || ''}
                onChange={(event) => setFieldValue(field.id, event.target.value)}
                placeholder=" "
              />
            )}
            <label htmlFor={`${exam.calculatorType}-${field.id}`}>{getLocaleText(language, field.label)}</label>
          </div>
        ))}
      </div>

      {result ? (
        <div className="calc-result" ref={resultRef}>
          <span className="label">{getLocaleText(language, config.resultLabel)}</span>
          <span className="value">{result.primary}</span>
          {result.secondary ? <span className="tri-avg-label">{result.secondary}</span> : null}
          {result.details.map((detail) => (
            <span className="calc-result-detail" key={detail}>
              {detail}
            </span>
          ))}
          <p className="note">{result.note}</p>
        </div>
      ) : null}

      <div className="calc-actions">
        <button className="calc-btn primary" onClick={calculate}>
          {desiredCourse ? (isPortuguese ? 'Calcular e Analisar com IA' : 'Calculate and Analyze with AI') : (isPortuguese ? 'Calcular' : 'Calculate')}
        </button>
      </div>
    </div>
  );
};

export default AdmissionsCalculator;
