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
      {openModals.accountModal && (
        <AccountModal
          isOpen={openModals.accountModal}
          onClose={() => toggleModal('accountModal')}
          onOpenStudyStats={() => toggleModal('studyStatsModal')}
          initialView="personalization"
        />
      )}

      {/* Settings Modal */}
      {openModals.settingsModal && (
        <SettingsModal 
          isOpen={openModals.settingsModal} 
          onClose={() => toggleModal('settingsModal')}
          onOpenImportContext={() => toggleModal('importContextModal')}
        />
      )}

      {/* Help Modal */}
      {openModals.helpModal && (
        <HelpModal 
          isOpen={openModals.helpModal} 
          onClose={() => toggleModal('helpModal')} 
          initialTab={helpInitialTab}
        />
      )}

      {/* Support Modal */}
      {openModals.supportModal && (
        <SupportModal 
          isOpen={openModals.supportModal} 
          onClose={() => toggleModal('supportModal')} 
        />
      )}

      {/* Reflections Modal */}
      {openModals.reflectionsModal && (
        <ReflectionsModal 
          isOpen={openModals.reflectionsModal} 
          onClose={() => toggleModal('reflectionsModal')} 
        />
      )}

      {/* Mood Tracker Modal */}
      {openModals.moodTrackerModal && (
        <MoodTrackerModal 
          isOpen={openModals.moodTrackerModal} 
          onClose={() => toggleModal('moodTrackerModal')} 
        />
      )}

      {/* Emotional Journal Modal */}
      {openModals.emotionalJournalModal && (
        <EmotionalJournalModal 
          isOpen={openModals.emotionalJournalModal} 
          onClose={() => toggleModal('emotionalJournalModal')} 
        />
      )}

      {/* Import Context Modal */}
      {openModals.importContextModal && (
        <ImportContextModal 
          isOpen={openModals.importContextModal} 
          onClose={() => toggleModal('importContextModal')} 
        />
      )}

      {/* Study Stats Modal */}
      <AnimatePresence>
        {openModals.studyStatsModal && (
          <StudyStatsModal 
            isOpen={openModals.studyStatsModal} 
            onClose={() => toggleModal('studyStatsModal')} 
          />
        )}
      </AnimatePresence>

      {/* Guided Learning Modal */}
      <AnimatePresence>
        {openModals.guidedLearningModal && (
          <GuidedLearningModal
            isOpen={openModals.guidedLearningModal}
            onClose={() => toggleModal('guidedLearningModal')}
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
