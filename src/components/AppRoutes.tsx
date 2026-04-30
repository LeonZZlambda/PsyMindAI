import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';
import LandingPage from '../pages/LandingPage';
import RoadmapPage from '../pages/RoadmapPage';
import ContributePage from '../pages/ContributePage';
import StyleGuidePage from '../pages/StyleGuidePage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfUsePage from '../pages/TermsOfUsePage';
import TransparencyPage from '../pages/TransparencyPage';
import AnalyticsPage from '../pages/AnalyticsPage';

interface AppRoutesProps {
  inputRef: React.RefObject<HTMLTextAreaElement>;
  onOpenHelp: () => void;
  onOpenSupport: () => void;
  onOpenReflections: () => void;
  onOpenMoodTracker: () => void;
  onOpenEmotionalJournal: () => void;
  onOpenGuidedLearning: () => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({
  inputRef,
  onOpenHelp,
  onOpenSupport,
  onOpenReflections,
  onOpenMoodTracker,
  onOpenEmotionalJournal,
  onOpenGuidedLearning
}) => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/transparency" element={<TransparencyPage />} />
      <Route path="/contribute" element={<ContributePage />} />
      <Route path="/style-guide" element={<StyleGuidePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfUsePage />} />
      <Route 
        path="/chat" 
        element={
          <ChatPage 
            inputRef={inputRef} 
            onOpenHelp={onOpenHelp}
            onOpenSupport={onOpenSupport}
            onOpenReflections={onOpenReflections}
            onOpenMoodTracker={onOpenMoodTracker}
            onOpenEmotionalJournal={onOpenEmotionalJournal}
            onOpenGuidedLearning={onOpenGuidedLearning}
          />
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
