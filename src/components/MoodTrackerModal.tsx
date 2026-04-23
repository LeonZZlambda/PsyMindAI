import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMood } from '../context/MoodContext';
import { generateMoodInsight } from '../services/tools/moodService';
import BaseModal from './BaseModal';
import '../styles/mood.css';

const MoodTrackerModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { moodHistory, addMoodEntry, deleteMoodEntry } = useMood();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'history'
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const moods = [
    { id: 'happy', label: t('mood_tracker.moods.happy'), icon: 'sentiment_very_satisfied', color: '#4CAF50' },
    { id: 'calm', label: t('mood_tracker.moods.calm'), icon: 'self_improvement', color: '#009688' },
    { id: 'focused', label: t('mood_tracker.moods.focused'), icon: 'center_focus_strong', color: '#2196F3' },
    { id: 'anxious', label: t('mood_tracker.moods.anxious'), icon: 'sentiment_worried', color: '#FF9800' },
    { id: 'tired', label: t('mood_tracker.moods.tired'), icon: 'bedtime', color: '#9C27B0' },
    { id: 'sad', label: t('mood_tracker.moods.sad'), icon: 'sentiment_dissatisfied', color: '#607D8B' }
  ];

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
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('mood_tracker.title')}
      icon="mood"
      maxWidth="550px"
    >
      <div className="mood-tabs">
        <button 
          className={`mood-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
          onClick={() => setActiveTab('new')}
        >
          <span className="material-symbols-outlined">add_circle</span>
          {t('mood_tracker.tabs.new')}
        </button>
        <button 
          className={`mood-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <span className="material-symbols-outlined">history</span>
          {t('mood_tracker.tabs.history')}
        </button>
      </div>

      <div className="mood-content">
          {activeTab === 'new' ? (
            <>
              <h4 className="mood-section-title">{t('mood_tracker.question')}</h4>
              <div className="mood-selection-grid">
                {moods.map(mood => (
                  <button
                    key={mood.id}
                    className={`mood-card ${selectedMood?.id === mood.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(mood)}
                    style={{ '--mood-color': mood.color } as React.CSSProperties}
                  >
                    <div className="mood-card-icon">
                      <span className="material-symbols-outlined">
                        {mood.icon}
                      </span>
                    </div>
                    <span className="mood-card-label">{mood.label}</span>
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
                    <div className="ai-insight-card">
                      <div className="ai-insight-header">
                        <span className="material-symbols-outlined">auto_awesome</span>
                        <span>{t('mood_tracker.ai_insight.title', 'PsyMind Insight')}</span>
                      </div>
                      <p className="ai-insight-text">{aiInsight}</p>
                    </div>
                  )}
                                    {moodHistory.map(entry => (
                  <div key={entry.id} className="history-entry">
                    <div className="entry-mood-indicator" style={{ backgroundColor: entry.mood.color }}>
                      <span className="material-symbols-outlined">
                        {entry.mood.icon}
                      </span>
                    </div>
                    <div className="entry-body">
                      <div className="entry-header">
                        <span className="entry-mood-name">{t(`mood_tracker.moods.${entry.mood.id}`, entry.mood.label)}</span>
                        <span className="entry-timestamp">{formatDate(entry.date)}</span>
                      </div>
                      {entry.note && <p className="entry-note-text">{entry.note}</p>}
                    </div>
                    <button 
                      className="delete-entry-btn"
                      onClick={() => deleteMoodEntry(entry.id)}
                      title={t('mood_tracker.delete_aria')}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                  ))}
                </>
              )}
            </div>
          )}
      </div>
    </BaseModal>
  );
};

export default MoodTrackerModal;
