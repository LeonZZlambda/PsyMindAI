import React, { useState } from 'react';
import { useMood } from '../context/MoodContext';
import { generateMoodInsight } from '../services/tools/moodService';
import '../styles/mood.css';

const moods = [
  { id: 'happy', label: 'Feliz', icon: 'sentiment_very_satisfied', color: '#4CAF50' },
  { id: 'calm', label: 'Calmo', icon: 'self_improvement', color: '#009688' },
  { id: 'focused', label: 'Focado', icon: 'center_focus_strong', color: '#2196F3' },
  { id: 'anxious', label: 'Ansioso', icon: 'sentiment_worried', color: '#FF9800' },
  { id: 'tired', label: 'Cansado', icon: 'bedtime', color: '#9C27B0' },
  { id: 'sad', label: 'Triste', icon: 'sentiment_dissatisfied', color: '#607D8B' }
];

const MoodTrackerModal = ({ isOpen, onClose }) => {
  const { moodHistory, addMoodEntry, deleteMoodEntry } = useMood();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (selectedMood) {
      addMoodEntry(selectedMood, note);
      setSelectedMood(null);
      setNote('');
      setActiveTab('history');
    }
  };

  const getAiInsight = async () => {
    if (moodHistory.length === 0) return;
    
    setIsLoadingInsight(true);
    try {
      const insight = await generateMoodInsight(moodHistory);
      setAiInsight(insight);
    } catch (error) {
      setAiInsight('❌ Erro ao conectar com IA. Tente novamente.');
    }
    setIsLoadingInsight(false);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="mood-modal" onClick={e => e.stopPropagation()}>
        <div className="mood-header">
          <div className="mood-title">
            <span className="material-symbols-outlined">mood</span>
            <h3>Diário de Emoções</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="pomodoro-modes" style={{ marginBottom: '1.5rem' }}>
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

        <div className="mood-content">
          {activeTab === 'new' ? (
            <>
              <h4 className="mood-section-title">Como você está se sentindo agora?</h4>
              <div className="mood-grid">
                {moods.map(mood => (
                  <button
                    key={mood.id}
                    className={`mood-btn ${selectedMood?.id === mood.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(mood)}
                  >
                    <span className="material-symbols-outlined" style={{ color: selectedMood?.id === mood.id ? 'inherit' : mood.color }}>
                      {mood.icon}
                    </span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>

              <textarea
                className="mood-note-input"
                placeholder="Adicione uma nota sobre o que está sentindo... (opcional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="mood-actions">
                <button className="primary-btn" onClick={handleSave} disabled={!selectedMood}>
                  Salvar Registro
                </button>
              </div>
            </>
          ) : (
            <div className="history-list">
              {moodHistory.length === 0 ? (
                <p className="empty-state">Nenhum registro encontrado.</p>
              ) : (
                <>
                  <button 
                    className="ai-insight-btn"
                    onClick={getAiInsight}
                    disabled={isLoadingInsight}
                    style={{ marginBottom: '1rem', width: '100%' }}
                  >
                    <span className="material-symbols-outlined">
                      {isLoadingInsight ? 'hourglass_empty' : 'psychology'}
                    </span>
                    {isLoadingInsight ? 'Analisando...' : 'Análise IA do Humor'}
                  </button>
                  
                  {aiInsight && (
                    <div className="ai-insight-box" style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(156, 39, 176, 0.1)', borderRadius: '12px', border: '1px solid rgba(156, 39, 176, 0.3)' }}>
                      <p style={{ margin: 0, lineHeight: 1.6 }}>{aiInsight}</p>
                    </div>
                  )}
                  
                  {moodHistory.map(entry => (
                  <div key={entry.id} className="history-item">
                    <div className="history-icon">
                      <span className="material-symbols-outlined" style={{ color: entry.mood.color }}>
                        {entry.mood.icon}
                      </span>
                    </div>
                    <div className="history-content">
                      <div className="history-header">
                        <span className="history-mood">{entry.mood.label}</span>
                        <span className="history-date">{formatDate(entry.date)}</span>
                      </div>
                      {entry.note && <p className="history-note">{entry.note}</p>}
                    </div>
                    <button 
                      className="delete-entry-btn"
                      onClick={() => deleteMoodEntry(entry.id)}
                      title="Excluir registro"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                    </button>
                  </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerModal;
