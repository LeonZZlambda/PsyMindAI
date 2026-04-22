import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { sendMessage } from '../services/chat/chatService';
import { SYSTEM_PROMPTS } from '../services/prompts/systemPrompts';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/themes/prism-tomorrow.css';
import '../styles/judge.css';

const judgeSendOptions = {
  systemPrompt: SYSTEM_PROMPTS.OBI_JUDGE,
  skipMemoryUpdate: true
};

const JudgeModal = ({ isOpen, onClose, config }) => {
  const { t } = useTranslation();
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [challengeText, setChallengeText] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('C++');
  const [result, setResult] = useState('');
  const [genTick, setGenTick] = useState(0);

  const configKey = useMemo(() => {
    if (!config) return null;
    const topics = config.topics || [];
    return [config.subject, config.examName, topics.join('\n')].join('\0');
  }, [config]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setChallengeText('');
      setCode('');
      setResult('');
      setGenTick(0);
    }, 300);
  };

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
        const res = await sendMessage(prompt, [], judgeSendOptions);
        if (cancelled) return;
        if (res.success) {
          setChallengeText(res.text);
        } else {
          setChallengeText(t('judge.errors.generate_failed'));
        }
      } catch {
        if (!cancelled) setChallengeText(t('judge.errors.internal'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, configKey, genTick, config, t]);

  const handleRegenerate = useCallback(() => {
    setGenTick((n) => n + 1);
  }, []);

  const submitCode = async () => {
    if (!code.trim()) return;
    setEvaluating(true);

    const lead = t('judge.prompt_evaluate_lead', { language });
    const prompt = `${lead}\n[CHALLENGE]\n${challengeText}\n\n[STUDENT_CODE]\n\`\`\`${language}\n${code}\n\`\`\`\n`;

    try {
      const res = await sendMessage(prompt, [], judgeSendOptions);
      if (res.success) {
        setResult(res.text);
      } else {
        setResult(t('judge.errors.eval_failed'));
      }
    } catch {
      setResult(t('judge.errors.submit_failed'));
    } finally {
      setEvaluating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="judge-modal">
        <div className="modal-header" style={{borderBottom: '1px solid var(--border-color)', marginBottom: 0}}>
          <h2>
            <span className="material-symbols-outlined" style={{verticalAlign: 'middle', marginRight: '8px'}}>terminal</span>
            {t('judge.title')}
          </h2>
          <div className="judge-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="run-btn"
              onClick={handleRegenerate}
              disabled={loading || evaluating}
              style={{ fontSize: '13px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
              {t('judge.retry')}
            </button>
            <button type="button" className="close-btn" onClick={handleClose} aria-label={t('judge.close_aria')}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="judge-body">
          <div className="col-left">
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
          
          <div className="col-right">
            <div className="code-header">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                <option value="C">C</option>
                <option value="C++">C++</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
              </select>
              <button 
                className="run-btn" 
                onClick={submitCode}
                disabled={evaluating || loading || !code.trim()}
              >
                <span className="material-symbols-outlined" style={{fontSize: '18px'}}>play_arrow</span>
                {t('judge.submit')}
              </button>
            </div>
            
            <div className="code-editor-container">
              <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => {
                  let grammar = Prism.languages.javascript;
                  let langKey = 'javascript';
                  
                  if (language === 'C') { grammar = Prism.languages.c; langKey = 'c'; }
                  else if (language === 'C++') { grammar = Prism.languages.cpp; langKey = 'cpp'; }
                  else if (language === 'Python') { grammar = Prism.languages.python; langKey = 'python'; }
                  else if (language === 'Java') { grammar = Prism.languages.java; langKey = 'java'; }

                  return Prism.highlight(code, grammar, langKey);
                }}
                padding={16}
                className="code-editor"
                placeholder={t('judge.code_placeholder', { language })}
                style={{
                  fontFamily: '"Fira Code", monospace, "SFMono-Regular", Consolas, "Liberation Mono", Menlo',
                  fontSize: 14,
                  minHeight: '100%',
                  outline: 'none'
                }}
              />
            </div>

            {(result || evaluating) && (
              <div className="evaluation-panel">
                {evaluating ? (
                  <div className="eval-loading">
                    <span className="material-symbols-outlined rotating">hourglass_empty</span>
                    <p>{t('judge.loading_eval')}</p>
                  </div>
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeModal;
