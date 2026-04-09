import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import BaseModal from './BaseModal';

const KindnessModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [act, setAct] = useState('');
  const [category, setCategory] = useState('random');
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const categories = [
    { id: 'random', label: t('kindness.categories.random'), icon: 'shuffle', color: '#6366f1' },
    { id: 'stranger', label: t('kindness.categories.stranger'), icon: 'public', color: '#f59e0b' },
    { id: 'family', label: t('kindness.categories.family'), icon: 'group', color: '#ec4899' },
    { id: 'self', label: t('kindness.categories.self'), icon: 'favorite', color: '#ef4444' },
    { id: 'work', label: t('kindness.categories.work'), icon: 'work', color: '#06b6d4' }
  ];

  const generateAct = async (selectedCategory = category) => {
    setIsLoading(true);
    setCompleted(false);
    
    // Refresh t() bindings for prompt mapping
    const promptMap = t('kindness.prompts', { returnObjects: true });
    // Handle edge case where i18n object hasn't hydrated properly, falling back to english or pt.
    const getPrompt = (id) => promptMap[id] || promptMap['random'];

    try {
      const { sendMessage: sendMessageToGemini } = await import('../services/chat/chatService');
      const prompt = getPrompt(selectedCategory);
      const result = await sendMessageToGemini(prompt, []);
      
      if (result.success) {
        setAct(result.text.trim());
      } else {
        fallbackAct(selectedCategory);
      }
    } catch (error) {
      fallbackAct(selectedCategory);
    }
    
    setIsLoading(false);
  };

  const fallbackAct = (selectedCategory) => {
    const db = t('kindness.database', { returnObjects: true });
    let pool = [];
    if (selectedCategory === 'random') {
      Object.values(db).forEach(arr => pool.push(...arr));
    } else {
      pool = db[selectedCategory] || db['stranger'];
    }
    const randomAct = pool[Math.floor(Math.random() * pool.length)];
    setAct(randomAct);
  };

  useEffect(() => {
    if (isOpen && !act) {
      generateAct();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleComplete = () => {
    setCompleted(true);
    toast.success(t('kindness.success_toast'));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('kindness.title')}
    >
      <div className="kindness-modal-content">
        <div className="modal-body kindness-body">
          <div className="kindness-categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${category === cat.id ? 'active' : ''}`}
                onClick={() => {
                  setCategory(cat.id);
                  generateAct(cat.id);
                }}
                title={cat.label}
              >
                <span className="material-symbols-outlined" style={{ color: category === cat.id ? '#ffffff' : cat.color }}>{cat.icon}</span>
                <span className="category-label">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="act-display-container">
            {isLoading ? (
              <div className="act-loading">
                <span className="material-symbols-outlined spin-animation">psychology</span>
                <p style={{ color: 'var(--text-light)' }}>{t('kindness.loading')}</p>
              </div>
            ) : (
              <div className={`act-card ${completed ? 'completed' : ''}`}>
                <span className="material-symbols-outlined act-icon">volunteer_activism</span>
                <p className="act-text">{act}</p>
                {completed && (
                  <div className="completion-badge">
                    <span className="material-symbols-outlined">check_circle</span>
                    {t('kindness.completed')}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="kindness-controls">
            <button 
              className="action-btn secondary"
              onClick={() => generateAct()}
              disabled={isLoading}
            >
              <span className="material-symbols-outlined">refresh</span>
              {t('kindness.generate_new')}
            </button>
            
            <button 
              className={`action-btn primary ${completed ? 'disabled' : ''}`}
              onClick={handleComplete}
              disabled={completed || isLoading}
            >
              <span className="material-symbols-outlined">favorite</span>
              {completed ? t('kindness.done') : t('kindness.will_do')}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default KindnessModal;
