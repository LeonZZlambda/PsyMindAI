import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import BaseModal from './BaseModal'
import { useChat } from '../context/ChatContext'
import { useTheme } from '../context/ThemeContext'
import PsyBot from './PsyBot'
import { sendMessage } from '../services/chat/chatService'
import logger from '../utils/logger'
import TelemetryService from '../services/TelemetryService'
import '../styles/ai-learning.css'

/**
 * PROMPT DE SISTEMA PARA A IA (Utilizado no processamento final)
 *
 * "Atue como um Psicólogo Organizacional especialista em carreira.
 * Analise as respostas do usuário baseadas no modelo RIASEC (Realista, Investigativo, Artístico, Social, Empreendedor, Convencional)
 * e traços do Big Five.
 * Forneça um JSON com:
 * 1. topAreas: Array de 3 objetos { area: string, justification: string }
 * 2. softSkills: Array de strings.
 * 3. careerArchetype: Nome criativo para o perfil.
 *
 * Mantenha tom empático, profissional e motivador."
 */

interface Question {
  id: number
  text: string
  dimension: 'R' | 'I' | 'A' | 'S' | 'E' | 'C'
}

type Dimension = Question['dimension']

type VocationalResult = {
  archetype: string
  topAreas: Array<{ area: string; justification: string }>
  softSkills: string[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Você gosta de montar ou consertar objetos mecânicos no dia à dia ou de vez em quando?',
    dimension: 'R',
  },
  {
    id: 2,
    text: 'Você curte investigar problemas científicos ou matemáticos para achar soluções?',
    dimension: 'I',
  },
  {
    id: 3,
    text: 'Você se sente bem expressando ideias com design, artes ou criação visual?',
    dimension: 'A',
  },
  {
    id: 4,
    text: 'Você gosta de ajudar pessoas a aprender algo novo ou se desenvolver?',
    dimension: 'S',
  },
  { id: 5, text: 'Você se anima em liderar equipes e tomar decisões em projetos?', dimension: 'E' },
  {
    id: 6,
    text: 'Você gosta de organizar dados, arquivos e seguir rotinas claras?',
    dimension: 'C',
  },
  {
    id: 7,
    text: 'Você gosta de mexer com ferramentas, máquinas ou atividades práticas?',
    dimension: 'R',
  },
  { id: 8, text: 'Você se sente bem observando detalhes e testando hipóteses?', dimension: 'I' },
  {
    id: 9,
    text: 'Você gosta de criar algo original, mesmo que seja so por hobby?',
    dimension: 'A',
  },
  { id: 10, text: 'Você curte ouvir as pessoas e oferecer apoio quando precisam?', dimension: 'S' },
  { id: 11, text: 'Você se motiva em convencer, negociar ou vender uma ideia?', dimension: 'E' },
  {
    id: 12,
    text: 'Você se sente bem seguindo processos claros e checando tudo com cuidado?',
    dimension: 'C',
  },
  {
    id: 13,
    text: 'Você gosta de atividades ao ar livre ou que envolvam uso do corpo?',
    dimension: 'R',
  },
  {
    id: 14,
    text: 'Você gosta de aprender por conta propria e explorar assuntos a fundo?',
    dimension: 'I',
  },
  { id: 15, text: 'Você se anima em contar histórias, escrever ou compôr algo?', dimension: 'A' },
  {
    id: 16,
    text: 'Você gosta de trabalhar em equipe e criar um clima de colaboração?',
    dimension: 'S',
  },
  {
    id: 17,
    text: 'Você gosta de assumir a frente para organizar pessoas e metas?',
    dimension: 'E',
  },
  {
    id: 18,
    text: 'Você curte planilhas, organizacao financeira ou tarefas administrativas?',
    dimension: 'C',
  },
]

const DIMENSION_LABELS: Record<Dimension, string> = {
  R: 'Realista',
  I: 'Investigativo',
  A: 'Artistico',
  S: 'Social',
  E: 'Empreendedor',
  C: 'Convencional',
}

const DIMENSION_ARCHETYPES: Record<Dimension, string> = {
  R: 'Construtor',
  I: 'Investigador',
  A: 'Criador',
  S: 'Mentor',
  E: 'Visionario',
  C: 'Organizador',
}

const DIMENSION_FALLBACK: Record<Dimension, { areas: string[]; skills: string[] }> = {
  R: {
    areas: ['Engenharias', 'Manutencao e Operacoes', 'Tecnologia Industrial'],
    skills: ['Praticidade', 'Precisao', 'Foco em execucao'],
  },
  I: {
    areas: ['Pesquisa e Ciencia', 'Analise de Dados', 'Tecnologia e Inovacao'],
    skills: ['Pensamento critico', 'Curiosidade intelectual', 'Resolucao de problemas'],
  },
  A: {
    areas: ['Design e Criacao', 'Comunicacao e Conteudo', 'Marketing Criativo'],
    skills: ['Criatividade', 'Expressao original', 'Sensibilidade estetica'],
  },
  S: {
    areas: ['Educacao', 'Psicologia e Desenvolvimento Humano', 'Saude e Bem-estar'],
    skills: ['Empatia', 'Comunicacao acolhedora', 'Trabalho em equipe'],
  },
  E: {
    areas: ['Empreendedorismo', 'Gestao e Lideranca', 'Vendas e Negociacao'],
    skills: ['Persuasao', 'Iniciativa', 'Visao estrategica'],
  },
  C: {
    areas: ['Administracao', 'Financas e Contabilidade', 'Processos e Qualidade'],
    skills: ['Organizacao', 'Planejamento', 'Confiabilidade'],
  },
}

const LIKERT_OPTIONS = [
  { value: 1, icon: 'sentiment_very_dissatisfied', color: 'var(--danger-color, #ef4444)' },
  { value: 2, icon: 'sentiment_dissatisfied', color: 'var(--warning-color, #f97316)' },
  { value: 3, icon: 'sentiment_neutral', color: 'var(--text-secondary, #94a3b8)' },
  { value: 4, icon: 'sentiment_satisfied', color: 'var(--success-light, #84cc16)' },
  { value: 5, icon: 'sentiment_very_satisfied', color: 'var(--success-color, #10b981)' },
]

const parseVocationalResult = (raw: string): VocationalResult | null => {
  try {
    const cleaned = raw.replace(/```json|```/gi, '').trim()
    const parsed = JSON.parse(cleaned)
    const archetype = parsed.archetype || parsed.careerArchetype
    const topAreas = Array.isArray(parsed.topAreas) ? parsed.topAreas : []
    const softSkills = Array.isArray(parsed.softSkills) ? parsed.softSkills : []

    if (!archetype || topAreas.length < 3 || softSkills.length === 0) return null

    return {
      archetype: String(archetype),
      topAreas: topAreas.slice(0, 3).map((item: any) => ({
        area: String(item.area || ''),
        justification: String(item.justification || ''),
      })),
      softSkills: softSkills.map((skill: any) => String(skill)).filter(Boolean),
    }
  } catch (error) {
    return null
  }
}

const buildFallbackResult = (scores: Record<Dimension, number>): VocationalResult => {
  const ranked = (Object.keys(scores) as Dimension[])
    .map((dimension) => ({ dimension, score: scores[dimension] }))
    .sort((a, b) => b.score - a.score)

  const topDimensions = ranked.slice(0, 3).map((item) => item.dimension)
  const archetype = `O ${DIMENSION_ARCHETYPES[topDimensions[0]]} ${DIMENSION_ARCHETYPES[topDimensions[1]]}`

  const topAreas = topDimensions.map((dimension) => ({
    area: DIMENSION_FALLBACK[dimension].areas[0],
    justification: `Seu perfil mostra afinidade forte com o eixo ${DIMENSION_LABELS[dimension]}, o que favorece esta area.`,
  }))

  const softSkills = Array.from(
    new Set(topDimensions.flatMap((dimension) => DIMENSION_FALLBACK[dimension].skills)),
  )

  return {
    archetype,
    topAreas,
    softSkills: softSkills.slice(0, 8),
  }
}

const VocationalTestModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation(['learning', 'translation'])
  const { setInput } = useChat()
  const { reducedMotion } = useTheme()

  React.useEffect(() => {
    if (isOpen) {
      TelemetryService.trackEvent('modal_open', { modal: 'vocational_test' })
    }
  }, [isOpen])

  const [phase, setPhase] = useState<'introduction' | 'questions' | 'processing' | 'results'>(
    'introduction',
  )
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const progress =
    phase === 'questions' ? (Object.keys(answers).length / QUESTIONS.length) * 100 : 0

  const handleStartTest = () => {
    setPhase('questions')
  }

  const handleAnswer = (value: number) => {
    const nextAnswers = { ...answers, [QUESTIONS[currentStep].id]: value }
    setAnswers(nextAnswers)

    // Track step completion for drop-off analysis
    TelemetryService.trackEvent('vocational_test_step', {
      step: currentStep + 1,
      total_steps: QUESTIONS.length,
      question_id: QUESTIONS[currentStep].id,
    })

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setPhase('processing')
      processResults(nextAnswers)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const processResults = async (finalAnswers: Record<number, number> = answers) => {
    setIsProcessing(true)
    try {
      // Simulacao de chamada à API ou logica local RIASEC
      const scores: Record<Dimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
      const dimensionCounts: Record<Dimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

      QUESTIONS.forEach((question) => {
        scores[question.dimension] += finalAnswers[question.id] || 0
        dimensionCounts[question.dimension] += 1
      })

      const maxScores: Record<Dimension, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
      ;(Object.keys(dimensionCounts) as Dimension[]).forEach((dimension) => {
        maxScores[dimension] = dimensionCounts[dimension] * 5
      })

      const rankedDimensions = (Object.keys(scores) as Dimension[])
        .map((dimension) => ({
          dimension,
          label: DIMENSION_LABELS[dimension],
          score: scores[dimension],
          max: maxScores[dimension],
          percent: maxScores[dimension]
            ? Math.round((scores[dimension] / maxScores[dimension]) * 100)
            : 0,
        }))
        .sort((a, b) => b.score - a.score)
      const answersSummary = QUESTIONS.map((question) => {
        const value = finalAnswers[question.id] ?? 3
        const label = t(`exams.vocational.likert.${value}`)
        const questionText = t(`exams.vocational.questions.${question.id}`)
        const dimensionLabel = t(`exams.vocational.dimensions.${question.dimension}`)
        return `${question.id}. (${dimensionLabel}) ${questionText} -> ${value} (${label})`
      }).join('\n')

      const scoresSummary = rankedDimensions
        .map((item) => {
          const dimensionLabel = t(`exams.vocational.dimensions.${item.dimension}`)
          return `${dimensionLabel} (${item.dimension}): ${item.score}/${item.max} (${item.percent}%)`
        })
        .join('\n')

      const topLabels = rankedDimensions
        .slice(0, 3)
        .map((item) => t(`exams.vocational.dimensions.${item.dimension}`))
        .join(', ')

      const targetLanguage = i18n.language.startsWith('pt') ? 'Português' : 'English'

      const systemPrompt =
        `Atue como um Psicologo Organizacional especialista em carreira.\n` +
        `Analise as respostas do usuario baseadas no modelo RIASEC.\n` +
        `Se nao houver dados suficientes sobre Big Five, nao invente.\n` +
        `Seja empatico, profissional e motivador. Responda obrigatoriamente no idioma: ${targetLanguage}.`

      const prompt =
        `Use o contexto abaixo para gerar um resumo vocacional.\n\n` +
        `Escala de respostas: 1 = Nao curto e evito; 2 = Acho chato; 3 = Tanto faz / Neutro; 4 = Gosto de fazer; 5 = Adoro! Faria sempre.\n\n` +
        `Respostas do usuario:\n${answersSummary}\n\n` +
        `Pontuacoes por dimensao:\n${scoresSummary}\n\n` +
        `Top dimensoes: ${topLabels}.\n\n` +
        `Retorne APENAS um JSON valido no formato:\n` +
        `{\n` +
        `  "archetype": "Nome criativo do perfil",\n` +
        `  "topAreas": [\n` +
        `    { "area": "", "justification": "" },\n` +
        `    { "area": "", "justification": "" },\n` +
        `    { "area": "", "justification": "" }\n` +
        `  ],\n` +
        `  "softSkills": ["", "", "", "", "", ""]\n` +
        `}\n` +
        `Sem markdown, sem texto extra.`

      const response = await sendMessage(prompt, [], { systemPrompt, skipMemoryUpdate: true })
      if ('success' in response && response.success) {
        const parsed = parseVocationalResult(response.text)
        if (parsed) {
          setResult(parsed)
          setIsProcessing(false)
          setPhase('results')
          return
        }
        logger.warn('Invalid vocational JSON response, falling back to local result.')
      } else {
        logger.warn('Vocational AI request failed, falling back to local result.')
      }

      const finalResult = buildFallbackResult(scores)
      setResult(finalResult)
      TelemetryService.trackEvent('vocational_test_complete', {
        archetype: finalResult.archetype,
        top_area: finalResult.topAreas[0].area,
      })
      setIsProcessing(false)
      setPhase('results')
    } catch (e) {
      logger.error('Error processing vocational test', e)
      setIsProcessing(false)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('exams.vocational.title')}
      icon="explore"
      maxWidth="600px"
    >
      <div className="vocational-modal-content vocational-shell">
        {phase === 'questions' && (
          <div className="vocational-progress-bar">
            <div
              className="vocational-progress-fill"
              style={{ width: `${progress}%` }}
              aria-label={t('exams.vocational.progress_aria')}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === 'introduction' && (
            <motion.div
              key="introduction"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="vocational-introduction"
            >
              <div className="vocational-intro-content">
                <div className="vocational-intro-header">
                  <span className="material-symbols-outlined vocational-intro-icon">
                    psychology
                  </span>
                  <h2>{t('exams.vocational.introduction.title')}</h2>
                </div>
                <div className="vocational-intro-description">
                  <p>{t('exams.vocational.introduction.description')}</p>
                  <div className="vocational-intro-features">
                    <div className="feature-item">
                      <span className="material-symbols-outlined">timeline</span>
                      <span>{t('exams.vocational.introduction.features.riasec')}</span>
                    </div>
                    <div className="feature-item">
                      <span className="material-symbols-outlined">lightbulb</span>
                      <span>{t('exams.vocational.introduction.features.insights')}</span>
                    </div>
                    <div className="feature-item">
                      <span className="material-symbols-outlined">school</span>
                      <span>{t('exams.vocational.introduction.features.guidance')}</span>
                    </div>
                  </div>
                </div>
                <button className="primary-btn vocational-start-btn" onClick={handleStartTest}>
                  <span className="material-symbols-outlined icon-rtl-flip">play_arrow</span>
                  {t('exams.vocational.introduction.start_button')}
                </button>
              </div>
            </motion.div>
          )}
          {phase === 'questions' && (
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="vocational-question-step"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                {currentStep > 0 ? (
                  <button
                    onClick={handleBack}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-light)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      arrow_back
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                      {t('common.back', 'Voltar')}
                    </span>
                  </button>
                ) : (
                  <div />
                )}
                <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {currentStep + 1} / {QUESTIONS.length}
                </span>
              </div>

              <h3 className="vocational-question">
                {t(`exams.vocational.questions.${QUESTIONS[currentStep].id}`)}
              </h3>

              <div className="vocational-options">
                {LIKERT_OPTIONS.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    whileTap={{ scale: 0.98 }}
                    className="vocational-option"
                    style={{ '--option-color': option.color } as React.CSSProperties}
                  >
                    <span className="vocational-option__icon">
                      <span className="material-symbols-outlined">{option.icon}</span>
                    </span>

                    <span className="vocational-option__label">
                      {t(`exams.vocational.likert.${option.value}`)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
          {phase === 'processing' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="vocational-processing"
            >
              <div className="psybot-loader">
                <PsyBot isAnalyzing isHappy reducedMotion={reducedMotion} />
                <p className="psybot-loader__text">{t('exams.vocational.processing')}</p>
              </div>
            </motion.div>
          )}
          {phase === 'results' && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="vocational-results"
            >
              <div className="vocational-results__hero">
                <span className="material-symbols-outlined">verified</span>
                <h2>{result.archetype}</h2>
              </div>

              <div className="result-sections">
                {result.topAreas.map((item: any, i: number) => (
                  <div key={i} className="area-card">
                    <h4>{item.area}</h4>
                    <p>{item.justification}</p>
                  </div>
                ))}

                <div className="skills-tags">
                  {result.softSkills.map((s: string) => (
                    <span key={s} className="skill-tag">
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  className="primary-btn cta vocational-cta"
                  onClick={() => {
                    setInput(
                      t('exams.vocational.result.chat_input', { area: result.topAreas[0].area }),
                    )
                    onClose()
                  }}
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  {t('exams.vocational.result.cta_plan')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseModal>
  )
}

export default VocationalTestModal
