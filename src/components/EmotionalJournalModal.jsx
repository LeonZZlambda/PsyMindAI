import React, { useState } from 'react';
import { useEmotionalJournal } from '../context/EmotionalJournalContext';
import '../styles/emotional-journal.css';

const journalQuestions = [
  { id: 'excited', question: 'O que te deixou animado no dia de hoje?', icon: 'celebration', color: '#FF9800' },
  { id: 'irritated', question: 'O que te irritou?', icon: 'sentiment_frustrated', color: '#F44336' },
  { id: 'frustrated', question: 'Algo te frustrou?', icon: 'sentiment_stressed', color: '#9C27B0' },
  { id: 'proud', question: 'Quando você se sentiu bem consigo mesmo?', icon: 'emoji_events', color: '#4CAF50' }
];

const EmotionalJournalModal = ({ isOpen, onClose }) => {
  const { entries, addEntry, deleteEntry } = useEmotionalJournal();
  const [activeTab, setActiveTab] = useState('new');
  const [responses, setResponses] = useState({
    excited: '',
    irritated: '',
    frustrated: '',
    proud: ''
  });

  if (!isOpen) return null;

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
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="emotional-journal-modal" onClick={e => e.stopPropagation()}>
        <div className="journal-header">
          <div className="journal-title">
            <span className="material-symbols-outlined">auto_stories</span>
            <h3>Repertório Emocional</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="journal-description">
          Amplie seu vocabulário emocional. Quanto mais você nomeia o que sente, mais fácil é comunicar-se e conectar-se.
        </p>

        <div className="pomodoro-modes">
          <button 
            className={`mode-btn ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            Novo Registro
          </button>
          <button 
            className={`mode-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Histórico
          </button>
        </div>

        <div className="journal-content">
          {activeTab === 'new' ? (
            <>
              <div className="journal-questions">
                {journalQuestions.map(q => (
                  <div key={q.id} className="journal-question-block">
                    <label className="journal-question">
                      <span className="material-symbols-outlined" style={{ color: q.color }}>
                        {q.icon}
                      </span>
                      {q.question}
                    </label>
                    <textarea
                      className="journal-textarea"
                      placeholder="Escreva sua resposta..."
                      value={responses[q.id]}
                      onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              <div className="journal-actions">
                <button 
                  className="primary-btn" 
                  onClick={handleSave}
                  disabled={!Object.values(responses).some(r => r.trim())}
                >
                  Salvar Registro
                </button>
              </div>
            </>
          ) : (
            <div className="journal-history">
              {entries.length === 0 ? (
                <p className="empty-state">Nenhum registro encontrado. Comece seu diário emocional!</p>
              ) : (
                entries.map(entry => (
                  <div key={entry.id} className="journal-entry">
                    <div className="entry-header">
                      <span className="entry-date">{formatDate(entry.date)}</span>
                      <button 
                        className="delete-entry-btn"
                        onClick={() => deleteEntry(entry.id)}
                        title="Excluir registro"
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
                            <strong>{q.question}</strong>
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
      </div>
    </div>
  );
};

export default EmotionalJournalModal;
