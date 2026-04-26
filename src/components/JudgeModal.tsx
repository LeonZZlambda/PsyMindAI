import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import BaseModal from './BaseModal';
import { sendMessage } from '../services/chat/chatService';
import { SYSTEM_PROMPTS } from '../services/prompts/systemPrompts';
import '../styles/judge.css';

const judgeSendOptions = {
  systemPrompt: SYSTEM_PROMPTS.OBI_JUDGE,
  skipMemoryUpdate: true,
};

type JudgeConfig = {
  examName?: string;
  subject?: string;
  topics?: string[];
};

type JudgeModalProps = {
  config: JudgeConfig;
  isOpen: boolean;
  onClose: () => void;
};

const highlightCode = (sourceCode: string, language: string) => {
  let grammar = Prism.languages.javascript;
  let languageKey = 'javascript';

  if (language === 'C') {
    grammar = Prism.languages.c;
    languageKey = 'c';
  } else if (language === 'C++') {
    grammar = Prism.languages.cpp;
    languageKey = 'cpp';
  } else if (language === 'Python') {
    grammar = Prism.languages.python;
    languageKey = 'python';
  } else if (language === 'Java') {
    grammar = Prism.languages.java;
    languageKey = 'java';
  }

  return Prism.highlight(sourceCode, grammar, languageKey);
};

const JudgeModal: React.FC<JudgeModalProps> = ({ isOpen, onClose, config }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [challengeText, setChallengeText] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('C++');
  const [result, setResult] = useState('');
  const [generationTick, setGenerationTick] = useState(0);

  const configKey = useMemo(() => {
    if (!config) return null;
    const topics = config.topics || [];
    return [config.subject, config.examName, topics.join('\n')].join('\0');
  }, [config]);

  useEffect(() => {
    if (!isOpen || !configKey) return undefined;

    let cancelled = false;
    setLoading(true);
    setChallengeText('');
    setResult('');

    const subject = config.subject || t('judge.default_subject');
    const examName = config.examName || 'OBI';
    const topics = (config.topics || []).join(', ');
    const prompt = t('judge.prompt_generate', { subject, examName, topics });

    (async () => {
      try {
        const response = await sendMessage(prompt, [], judgeSendOptions);
        if (cancelled) return;

        setChallengeText(response.success ? response.text : t('judge.errors.generate_failed'));
      } catch {
        if (!cancelled) setChallengeText(t('judge.errors.internal'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, configKey, generationTick, config, t]);

  const handleRegenerate = useCallback(() => {
    setGenerationTick((value) => value + 1);
  }, []);

  const submitCode = async () => {
    if (!code.trim()) return;

    setEvaluating(true);
    const lead = t('judge.prompt_evaluate_lead', { language });
    const prompt = `${lead}\n[CHALLENGE]\n${challengeText}\n\n[STUDENT_CODE]\n\`\`\`${language}\n${code}\n\`\`\`\n`;

    try {
      const response = await sendMessage(prompt, [], judgeSendOptions);
      setResult(response.success ? response.text : t('judge.errors.eval_failed'));
    } catch {
      setResult(t('judge.errors.submit_failed'));
    } finally {
      setEvaluating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('judge.title')}
      icon="terminal"
      size="large"
      className="judge-modal"
    >
      <div className="judge-layout">
        <div className="modal-hero judge-hero">
          <div className="judge-hero__copy">
            <span className="judge-hero__eyebrow">
              <span className="material-symbols-outlined">code_blocks</span>
              {config?.examName || 'OBI'}
            </span>
            <h3 className="judge-hero__title">{config?.subject || t('judge.default_subject')}</h3>
          </div>

          <div className="judge-hero__actions">
            <button
              type="button"
              className="judge-btn judge-btn--secondary"
              onClick={handleRegenerate}
              disabled={loading || evaluating}
            >
              <span className="material-symbols-outlined">refresh</span>
              {t('judge.retry')}
            </button>
          </div>
        </div>

        <div className="judge-grid">
          <section className="modal-card judge-panel judge-panel--challenge">
            <div className="judge-panel__header">
              <h4 className="judge-panel__title">{t('judge.title')}</h4>
            </div>

            <div className="judge-panel__body judge-panel__body--scroll">
              {loading ? (
                <div className="eval-loading">
                  <span className="material-symbols-outlined rotating">autorenew</span>
                  <p>{t('judge.loading_challenge')}</p>
                </div>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown>{challengeText}</ReactMarkdown>
                </div>
              )}
            </div>
          </section>

          <section className="judge-stack">
            <div className="modal-card judge-panel judge-panel--editor">
              <div className="judge-panel__header judge-panel__header--editor">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="language-select"
                >
                  <option value="C">C</option>
                  <option value="C++">C++</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="JavaScript">JavaScript</option>
                </select>

                <button
                  className="judge-btn judge-btn--primary"
                  onClick={submitCode}
                  disabled={evaluating || loading || !code.trim()}
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  {t('judge.submit')}
                </button>
              </div>

              <div className="code-editor-container">
                <Editor
                  value={code}
                  onValueChange={(value) => setCode(value)}
                  highlight={(value) => highlightCode(value, language)}
                  padding={16}
                  className="code-editor"
                  placeholder={t('judge.code_placeholder', { language })}
                  style={{
                    fontFamily: '"Fira Code", monospace, "SFMono-Regular", Consolas, "Liberation Mono", Menlo',
                    fontSize: 14,
                    minHeight: '100%',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div className="modal-card judge-panel judge-panel--result">
              <div className="judge-panel__header">
                <h4 className="judge-panel__title">{t('judge.submit')}</h4>
              </div>

              <div className="judge-panel__body judge-panel__body--scroll">
                {evaluating ? (
                  <div className="eval-loading">
                    <span className="material-symbols-outlined rotating">hourglass_empty</span>
                    <p>{t('judge.loading_eval')}</p>
                  </div>
                ) : result ? (
                  <div className="markdown-content">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="judge-empty">
                    <span className="material-symbols-outlined">rule</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </BaseModal>
  );
};

export default JudgeModal;
