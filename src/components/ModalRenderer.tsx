import { Suspense, lazy, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Lazy load modals to improve initial load performance
const AccountModal = lazy(() => import('./AccountModal'));
const SettingsModal = lazy(() => import('./SettingsModal'));
const HelpModal = lazy(() => import('./HelpModal'));
const SupportModal = lazy(() => import('./SupportModal'));
const ReflectionsModal = lazy(() => import('./ReflectionsModal'));
const MoodTrackerModal = lazy(() => import('./MoodTrackerModal'));
const EmotionalJournalModal = lazy(() => import('./EmotionalJournalModal'));
const ImportContextModal = lazy(() => import('./ImportContextModal'));
const StudyStatsModal = lazy(() => import('./StudyStatsModal'));
const GuidedLearningModal = lazy(() => import('./GuidedLearningModal'));
const PomodoroModal = lazy(() => import('./PomodoroModal'));
const ExamsModal = lazy(() => import('./ExamsModal'));
const KindnessModal = lazy(() => import('./KindnessModal'));
const JudgeModal = lazy(() => import('./JudgeModal'));
const QuizModal = lazy(() => import('./QuizModal'));
const SoundscapesModal = lazy(() => import('./SoundscapesModal'));

/**
 * ModalRenderer Component
 * Centralizes rendering of all modals with Suspense and lazy loading
 * 
 * Props:
 * - openModals: Object with boolean flags for each modal (from useModal hook)
 * - toggleModal: Function to toggle modal state
 * - helpInitialTab: Tab to open HelpModal with
 */
export const ModalRenderer = ({ openModals, toggleModal, helpInitialTab = 'faq' }) => {
  return (
    <Suspense fallback={null}>
      {/* Account Modal */}
      {openModals.account && (
        <AccountModal
          isOpen={openModals.account}
          onClose={() => toggleModal('account')}
          onOpenStudyStats={() => toggleModal('studyStats')}
          initialView="personalization"
        />
      )}

      {/* Settings Modal */}
      {openModals.settings && (
        <SettingsModal 
          isOpen={openModals.settings} 
          onClose={() => toggleModal('settings')}
          onOpenImportContext={() => toggleModal('importContext')}
        />
      )}

      {/* Help Modal */}
      {openModals.help && (
        <HelpModal 
          isOpen={openModals.help} 
          onClose={() => toggleModal('help')} 
          initialTab={helpInitialTab}
        />
      )}

      {/* Support Modal */}
      {openModals.support && (
        <SupportModal 
          isOpen={openModals.support} 
          onClose={() => toggleModal('support')} 
        />
      )}

      {/* Reflections Modal */}
      {openModals.reflections && (
        <ReflectionsModal 
          isOpen={openModals.reflections} 
          onClose={() => toggleModal('reflections')} 
        />
      )}

      {/* Mood Tracker Modal */}
      {openModals.moodTracker && (
        <MoodTrackerModal 
          isOpen={openModals.moodTracker} 
          onClose={() => toggleModal('moodTracker')} 
        />
      )}

      {/* Emotional Journal Modal */}
      {openModals.emotionalJournal && (
        <EmotionalJournalModal 
          isOpen={openModals.emotionalJournal} 
          onClose={() => toggleModal('emotionalJournal')} 
        />
      )}

      {/* Import Context Modal */}
      {openModals.importContext && (
        <ImportContextModal 
          isOpen={openModals.importContext} 
          onClose={() => toggleModal('importContext')} 
        />
      )}

      {/* Study Stats Modal */}
      <AnimatePresence>
        {openModals.studyStats && (
          <StudyStatsModal 
            isOpen={openModals.studyStats} 
            onClose={() => toggleModal('studyStats')} 
          />
        )}
      </AnimatePresence>

      {/* Guided Learning Modal */}
      <AnimatePresence>
        {openModals.guidedLearning && (
          <GuidedLearningModal
            isOpen={openModals.guidedLearning}
            onClose={() => toggleModal('guidedLearning')}
          />
        )}
      </AnimatePresence>

      {/* Pomodoro Modal */}
      <AnimatePresence>
        {openModals.pomodoro && (
          <PomodoroModal
            isOpen={openModals.pomodoro}
            onClose={() => toggleModal('pomodoro')}
          />
        )}
      </AnimatePresence>

      {/* Exams Modal */}
      <AnimatePresence>
        {openModals.exams && (
          <ExamsModal
            isOpen={openModals.exams}
            onClose={() => toggleModal('exams')}
          />
        )}
      </AnimatePresence>

      {/* Kindness Modal */}
      <AnimatePresence>
        {openModals.kindness && (
          <KindnessModal
            isOpen={openModals.kindness}
            onClose={() => toggleModal('kindness')}
          />
        )}
      </AnimatePresence>

      {/* Judge Modal */}
      <AnimatePresence>
        {openModals.judge && (
          <JudgeModal
            isOpen={openModals.judge}
            onClose={() => toggleModal('judge')}
          />
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {openModals.quiz && (
          <QuizModal
            isOpen={openModals.quiz}
            onClose={() => toggleModal('quiz')}
          />
        )}
      </AnimatePresence>

      {/* Soundscapes Modal */}
      <AnimatePresence>
        {openModals.soundscapes && (
          <SoundscapesModal
            isOpen={openModals.soundscapes}
            onClose={() => toggleModal('soundscapes')}
          />
        )}
      </AnimatePresence>
    </Suspense>
  );
};

export default ModalRenderer;
