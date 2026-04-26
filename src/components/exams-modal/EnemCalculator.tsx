import React, { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useChat } from '../../context/ChatContext';

type EnemCalculatorProps = {
  onClose: () => void;
};

type CalculatorMode = 'advanced' | 'select' | 'simple';

type ScoreFields = {
  humanas: string;
  linguagens: string;
  matematica: string;
  natureza: string;
  redacao: string;
};

type TriRange = {
  avg: number;
  max: number;
  min: number;
};

type CalculatorResult =
  | { type: 'simple'; value: string }
  | {
      details: {
        humanas: TriRange;
        linguagens: TriRange;
        matematica: TriRange;
        natureza: TriRange;
      };
      ignoredRedacao: boolean;
      range: { max: string; min: string };
      type: 'advanced';
      value: string;
    };

const initialScores: ScoreFields = {
  humanas: '',
  linguagens: '',
  matematica: '',
  natureza: '',
  redacao: '',
};

export const EnemCalculator: React.FC<EnemCalculatorProps> = ({ onClose }) => {
  const { sendMessage } = useChat();
  const { t } = useTranslation();
  const [mode, setMode] = useState<CalculatorMode>('select');
  const [scores, setScores] = useState<ScoreFields>(initialScores);
  const [correctAnswers, setCorrectAnswers] = useState<ScoreFields>(initialScores);
  const [desiredCourse, setDesiredCourse] = useState('');
  const [category, setCategory] = useState('Ampla Concorrência');
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [ignoreRedacao, setIgnoreRedacao] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      event.preventDefault();
      const modes: CalculatorMode[] = ['select', 'simple', 'advanced'];
      const currentIndex = modes.indexOf(mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      setMode(modes[nextIndex]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [result]);

  const categories = [
    'Ampla Concorrência',
    'Escola Pública (EP)',
    'Preto, Pardo ou Indígena (PPI)',
    'Pessoas com Deficiência (PcD)',
    'Baixa Renda',
  ];

  const handleCalculateSimple = () => {
    const values = Object.values(scores).map((value) => Number.parseFloat(value) || 0);
    const sum = values.reduce((left, right) => left + right, 0);
    const avg = (sum / 5).toFixed(2);
    setResult({ type: 'simple', value: avg });

    if (!desiredCourse) return;

    const prompt = t('exams.calculator.prompts.simple', {
      linguagens: scores.linguagens,
      humanas: scores.humanas,
      natureza: scores.natureza,
      matematica: scores.matematica,
      redacao: scores.redacao,
      avg,
      course: desiredCourse,
      category,
    });

    sendMessage(prompt);
    onClose();
  };

  const handleCalculateAdvanced = () => {
    const calculateTRIRange = (correct: string, maxScore: number, minScore = 300): TriRange => {
      const score = Number.parseFloat(correct) || 0;
      if (score === 0) return { min: 0, max: 0, avg: 0 };
      if (score === 45) return { min: maxScore, max: maxScore, avg: maxScore };

      const ratio = score / 45;
      const baseScore = minScore + ratio * (maxScore - minScore);
      const volatility = 50 * Math.sin(ratio * Math.PI);

      return {
        min: Math.floor(baseScore - volatility),
        max: Math.ceil(baseScore + volatility),
        avg: Math.round(baseScore),
      };
    };

    const triLinguagens = calculateTRIRange(correctAnswers.linguagens, 820, 280);
    const triHumanas = calculateTRIRange(correctAnswers.humanas, 860, 300);
    const triNatureza = calculateTRIRange(correctAnswers.natureza, 880, 300);
    const triMatematica = calculateTRIRange(correctAnswers.matematica, 980, 320);
    const redacaoVal = ignoreRedacao ? 0 : (Number.parseFloat(correctAnswers.redacao) || 0);
    const divisor = ignoreRedacao ? 4 : 5;
    const totalMin = (triLinguagens.min + triHumanas.min + triNatureza.min + triMatematica.min + redacaoVal) / divisor;
    const totalMax = (triLinguagens.max + triHumanas.max + triNatureza.max + triMatematica.max + redacaoVal) / divisor;
    const totalAvg = (triLinguagens.avg + triHumanas.avg + triNatureza.avg + triMatematica.avg + redacaoVal) / divisor;

    setResult({
      type: 'advanced',
      value: totalAvg.toFixed(2),
      range: { min: totalMin.toFixed(2), max: totalMax.toFixed(2) },
      details: {
        linguagens: triLinguagens,
        humanas: triHumanas,
        natureza: triNatureza,
        matematica: triMatematica,
      },
      ignoredRedacao: ignoreRedacao,
    });

    if (!desiredCourse) return;

    const redacaoInfo = ignoreRedacao ? '⚠️ Redação: AINDA NÃO DIVULGADA (excluída do cálculo)' : `• Redação: ${correctAnswers.redacao} pontos`;
    const observacao = ignoreRedacao ? '\n💡 (Cálculo baseado apenas nas 4 áreas objetivas)' : '';
    const impactoRedacao = ignoreRedacao ? '   - Como a nota da redação pode impactar minhas chances?' : '';

    const prompt = t('exams.calculator.prompts.advanced', {
      linguagens: correctAnswers.linguagens,
      triLinguagensMin: triLinguagens.min,
      triLinguagensMax: triLinguagens.max,
      humanas: correctAnswers.humanas,
      triHumanasMin: triHumanas.min,
      triHumanasMax: triHumanas.max,
      natureza: correctAnswers.natureza,
      triNaturezaMin: triNatureza.min,
      triNaturezaMax: triNatureza.max,
      matematica: correctAnswers.matematica,
      triMatematicaMin: triMatematica.min,
      triMatematicaMax: triMatematica.max,
      redacaoInfo,
      totalMin: totalMin.toFixed(2),
      totalMax: totalMax.toFixed(2),
      totalAvg: totalAvg.toFixed(2),
      observacao,
      course: desiredCourse,
      category,
      impactoRedacao,
    });

    sendMessage(prompt);
    onClose();
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (value === '' || (Number.parseFloat(value) >= 0 && Number.parseFloat(value) <= 1000)) {
      setScores((previous) => ({ ...previous, [name]: value }));
    }
  };

  const handleCorrectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const max = name === 'redacao' ? 1000 : 45;
    if (value === '' || (Number.parseFloat(value) >= 0 && Number.parseFloat(value) <= max)) {
      setCorrectAnswers((previous) => ({ ...previous, [name]: value }));
    }
  };

  if (mode === 'select') {
    return (
      <div className="enem-calculator">
        <div className="calc-mode-selection">
          <div className="calc-mode-card" onClick={() => setMode('simple')}>
            <div className="calc-mode-icon">
              <span className="material-symbols-outlined">calculate</span>
            </div>
            <h4>{t('exams.calculator.mode_simple.title')}</h4>
            <p>{t('exams.calculator.mode_simple.desc')}</p>
          </div>
          <div className="calc-mode-card" onClick={() => setMode('advanced')}>
            <div className="calc-mode-icon">
              <span className="material-symbols-outlined">fact_check</span>
            </div>
            <h4>{t('exams.calculator.mode_advanced.title')}</h4>
            <p>{t('exams.calculator.mode_advanced.desc')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enem-calculator">
      <div className="calc-extra-inputs">
        <div className="md-input-group full-width has-icon">
          <span className="material-symbols-outlined field-icon">school</span>
          <input id="desiredCourse" type="text" value={desiredCourse} onChange={(event) => setDesiredCourse(event.target.value)} placeholder=" " />
          <label htmlFor="desiredCourse">{t('exams.calculator.inputs.course')}</label>
        </div>
        <div className="md-input-group full-width has-icon">
          <span className="material-symbols-outlined field-icon">category</span>
          <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label htmlFor="category">{t('exams.calculator.inputs.category')}</label>
        </div>
      </div>

      <div className="calc-inputs">
        {mode === 'simple' ? (
          <>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">translate</span>
              <input id="linguagens" type="number" name="linguagens" value={scores.linguagens} onChange={handleScoreChange} placeholder=" " />
              <label htmlFor="linguagens">{t('exams.calculator.subjects.linguagens')}</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">history_edu</span>
              <input id="humanas" type="number" name="humanas" value={scores.humanas} onChange={handleScoreChange} placeholder=" " />
              <label htmlFor="humanas">{t('exams.calculator.subjects.humanas')}</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">biotech</span>
              <input id="natureza" type="number" name="natureza" value={scores.natureza} onChange={handleScoreChange} placeholder=" " />
              <label htmlFor="natureza">{t('exams.calculator.subjects.natureza')}</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">calculate</span>
              <input id="matematica" type="number" name="matematica" value={scores.matematica} onChange={handleScoreChange} placeholder=" " />
              <label htmlFor="matematica">{t('exams.calculator.subjects.matematica')}</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">edit_note</span>
              <input id="redacao" type="number" name="redacao" value={scores.redacao} onChange={handleScoreChange} placeholder=" " />
              <label htmlFor="redacao">{t('exams.calculator.subjects.redacao')}</label>
            </div>
          </>
        ) : (
          <>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">translate</span>
              <input id="linguagens_correct" type="number" name="linguagens" value={correctAnswers.linguagens} onChange={handleCorrectChange} placeholder=" " />
              <label htmlFor="linguagens_correct">{t('exams.calculator.correct_labels.linguagens')}</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">history_edu</span>
              <input id="humanas_correct" type="number" name="humanas" value={correctAnswers.humanas} onChange={handleCorrectChange} placeholder=" " />
              <label htmlFor="humanas_correct">{t('exams.calculator.correct_labels.humanas')}</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">biotech</span>
              <input id="natureza_correct" type="number" name="natureza" value={correctAnswers.natureza} onChange={handleCorrectChange} placeholder=" " />
              <label htmlFor="natureza_correct">{t('exams.calculator.correct_labels.natureza')}</label>
            </div>
            <div className="md-input-group has-icon">
              <span className="material-symbols-outlined field-icon">calculate</span>
              <input id="matematica_correct" type="number" name="matematica" value={correctAnswers.matematica} onChange={handleCorrectChange} placeholder=" " />
              <label htmlFor="matematica_correct">{t('exams.calculator.correct_labels.matematica')}</label>
            </div>
            <div className={`md-input-group has-icon ${ignoreRedacao ? 'disabled' : ''}`}>
              <span className="material-symbols-outlined field-icon">edit_note</span>
              <input id="redacao_score" type="number" name="redacao" value={correctAnswers.redacao} onChange={handleCorrectChange} placeholder=" " disabled={ignoreRedacao} />
              <label htmlFor="redacao_score">{t('exams.calculator.correct_labels.redacao')}</label>
            </div>

            <div className="checkbox-group full-width">
              <label className="checkbox-container">
                <input type="checkbox" checked={ignoreRedacao} onChange={(event) => setIgnoreRedacao(event.target.checked)} />
                <span className="checkmark"></span>
                <span className="checkbox-label">{t('exams.calculator.ignore_redacao')}</span>
              </label>
            </div>
          </>
        )}
      </div>

      {result ? (
        <div className="calc-result" ref={resultRef}>
          <span className="label">
            {mode === 'simple' ? t('exams.calculator.result.simple_label') : t('exams.calculator.result.advanced_label')}
          </span>

          {result.type === 'simple' ? (
            <span className="value">{result.value}</span>
          ) : (
            <div className="tri-result-container">
              <div className="tri-range-display">
                <span className="range-val min">{result.range.min}</span>
                <span className="range-sep">a</span>
                <span className="range-val max">{result.range.max}</span>
              </div>
              <span className="tri-avg-label">{t('exams.calculator.result.avg', { val: result.value })}</span>
            </div>
          )}

          {result.type === 'advanced' && result.ignoredRedacao ? (
            <div className="warning-box">
              <span className="material-symbols-outlined">warning</span>
              <p>
                <Trans i18nKey="exams.calculator.result.warning">
                  A nota da Redação <strong>NÃO</strong> foi incluída neste cálculo. Esta média considera apenas as 4 áreas objetivas.
                </Trans>
              </p>
            </div>
          ) : null}

          <p className="note">
            {mode === 'simple' ? t('exams.calculator.result.note_simple') : t('exams.calculator.result.note_advanced')}
          </p>
        </div>
      ) : null}

      <div className="calc-actions">
        <button className="calc-btn secondary" onClick={() => { setMode('select'); setResult(null); }}>
          {t('exams.calculator.buttons.switch')}
        </button>
        <button className="calc-btn primary" onClick={mode === 'simple' ? handleCalculateSimple : handleCalculateAdvanced}>
          {desiredCourse ? t('exams.calculator.buttons.calc_ai') : t('exams.calculator.buttons.calc')}
        </button>
      </div>
    </div>
  );
};

export default EnemCalculator;
