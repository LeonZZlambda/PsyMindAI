import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEmotionalJournal } from '../context/EmotionalJournalContext';
import BaseModal from './BaseModal';
import '../styles/emotional-journal.css';

const EmotionalJournalModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { entries, addEntry, deleteEntry } = useEmotionalJournal();
  const [activeTab, setActiveTab] = useState('new');
  const [responses, setResponses] = useState({
    excited: '',
    irritated: '',
    frustrated: '',
    proud: ''
  });

  const journalQuestions = [
    { id: 'excited', question: t('emotional_journal.questions.excited'), icon: 'celebration', color: '#FF9800' },
    { id: 'irritated', question: t('emotional_journal.questions.irritated'), icon: 'sentiment_frustrated', color: '#F44336' },
    { id: 'frustrated', question: t('emotional_journal.questions.frustrated'), icon: 'sentiment_stressed', color: '#9C27B0' },
    { id: 'proud', question: t('emotional_journal.questions.proud'), icon: 'emoji_events', color: '#4CAF50' }
  ];

  const handleSave = () => {
    const hasContent = Object.values(responses).some(r => r.trim());
    if (hasContent) {
      addEntry(responses);
      setResponses({ excited: '', irritated: '', frustrated: '', proud: '' });
      setActiveTab('history');
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('emotional_journal.title')}
      icon="auto_stories"
      maxWidth="600px"
    >
      <div className="journal-tabs">
        <button
          className={`journal-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          <span className="material-symbols-outlined">edit_note</span>
          {t('emotional_journal.tabs.new')}
        </button>
        <button
          className={`journal-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="material-symbols-outlined">history</span>
          {t('emotional_journal.tabs.history')}
        </button>
      </div>

      <div className="journal-content">
        {activeTab === 'new' ? (
          <>
            <h4 className="journal-subtitle">
              {t('emotional_journal.subtitle')}
            </h4>
              <div className="journal-questions">
                {journalQuestions.map(q => (
                  <div key={q.id} className="journal-question-block">
                    <label className="journal-question">
                      <div className="question-icon-wrapper" style={{ '--accent-color': q.color } as React.CSSProperties}>
                        <span className="material-symbols-outlined">
                          {q.icon}
                        </span>
                      </div>
                      <span className="question-text">{q.question}</span>
                    </label>
                    <textarea
                      className="journal-textarea"
                      placeholder={t('emotional_journal.placeholder')}
                      value={responses[q.id]}
                      onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              <div className="journal-actions">
                <button 
                  className="primary-btn cta" 
                  onClick={handleSave}
                  disabled={!Object.values(responses).some(r => r.trim())}
                >
                  {t('emotional_journal.save')}
                </button>
              </div>
            </>
          ) : (
            <div className="journal-history">
              {entries.length === 0 ? (
                <p className="empty-state">{t('emotional_journal.empty')}</p>
              ) : (
                entries.map(entry => (
                  <div key={entry.id} className="journal-entry">
                    <div className="entry-header">
                      <span className="entry-date">{formatDate(entry.date)}</span>
                      <button 
                        className="delete-entry-btn"
                        onClick={() => deleteEntry(entry.id)}
                        title={t('emotional_journal.delete_aria')}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <div className="entry-responses">
                      {journalQuestions.map(q => entry.responses[q.id] && (
                        <div key={q.id} className="entry-response">
                          <div className="response-question">
                            <span className="material-symbols-outlined" style={{ color: q.color }}>
                              {q.icon}
                            </span>
                            <span className="response-label">{q.question}</span>
                          </div>
                          <p className="response-text">{entry.responses[q.id]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
    </BaseModal>
  );
};

export default EmotionalJournalModal;
