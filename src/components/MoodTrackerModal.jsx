import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMood } from '../context/MoodContext';
import { generateMoodInsight } from '../services/tools/moodService';
import '../styles/mood.css';

const MoodTrackerModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { moodHistory, addMoodEntry, deleteMoodEntry } = useMood();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const moods = [
    { id: 'happy', label: t('mood_tracker.moods.happy'), icon: 'sentiment_very_satisfied', color: '#4CAF50' },
    { id: 'calm', label: t('mood_tracker.moods.calm'), icon: 'self_improvement', color: '#009688' },
    { id: 'focused', label: t('mood_tracker.moods.focused'), icon: 'center_focus_strong', color: '#2196F3' },
    { id: 'anxious', label: t('mood_tracker.moods.anxious'), icon: 'sentiment_worried', color: '#FF9800' },
    { id: 'tired', label: t('mood_tracker.moods.tired'), icon: 'bedtime', color: '#9C27B0' },
    { id: 'sad', label: t('mood_tracker.moods.sad'), icon: 'sentiment_dissatisfied', color: '#607D8B' }
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

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
      setAiInsight(t('mood_tracker.ai_insight.error'));
    }
    setIsLoadingInsight(false);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`modal-content mood-modal ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>mood</span>
            {t('mood_tracker.title')}
          </h2>
          <button className="close-btn" onClick={handleClose} aria-label={t('mood_tracker.close_aria')}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="pomodoro-modes" style={{ marginBottom: '1.5rem' }}>
            <button 
            className={`mode-btn ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            {t('mood_tracker.tabs.new')}
          </button>
          <button 
            className={`mode-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            {t('mood_tracker.tabs.history')}
          </button>
        </div>

        <div className="mood-content">
          {activeTab === 'new' ? (
            <>
              <h4 className="mood-section-title">{t('mood_tracker.question')}</h4>
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
                placeholder={t('mood_tracker.note_placeholder')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <div className="mood-actions">
                <button className="primary-btn cta" onClick={handleSave} disabled={!selectedMood}>
                  {t('mood_tracker.save')}
                </button>
              </div>
            </>
          ) : (
            <div className="history-list">
              {moodHistory.length === 0 ? (
                <p className="empty-state">{t('mood_tracker.empty')}</p>
              ) : (
                <>
                  <button 
                    className="ai-insight-btn"
                    onClick={getAiInsight}
                    disabled={isLoadingInsight}
                  >
                    <span className="material-symbols-outlined">
                      {isLoadingInsight ? 'hourglass_empty' : 'psychology'}
                    </span>
                    {isLoadingInsight ? t('mood_tracker.ai_insight.analyzing') : t('mood_tracker.ai_insight.button')}
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
                        <span className="history-mood">{t(`mood_tracker.moods.${entry.mood.id}`, entry.mood.label)}</span>
                        <span className="history-date">{formatDate(entry.date)}</span>
                      </div>
                      {entry.note && <p className="history-note">{entry.note}</p>}
                    </div>
                    <button 
                      className="delete-entry-btn"
                      onClick={() => deleteMoodEntry(entry.id)}
                      title={t('mood_tracker.delete_aria')}
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
    </div>
  );
};

export default MoodTrackerModal;
