import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from '../pages/ChatPage';

import { lazy, Suspense } from 'react';
import LandingPage from '../pages/LandingPage';
const RoadmapPage = lazy(() => import('../pages/RoadmapPage'));
const ContributePage = lazy(() => import('../pages/ContributePage'));
const StyleGuidePage = lazy(() => import('../pages/StyleGuidePage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('../pages/TermsOfUsePage'));
const TransparencyPage = lazy(() => import('../pages/TransparencyPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));

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
      <Route path="/roadmap" element={<Suspense fallback={<div className="app-loading-skeleton">Loading...</div>}><RoadmapPage /></Suspense>} />
      <Route path="/analytics" element={<Suspense fallback={<div className="app-loading-skeleton">Loading...</div>}><AnalyticsPage /></Suspense>} />
      <Route path="/transparency" element={<Suspense fallback={<div className="app-loading-skeleton">Loading...</div>}><TransparencyPage /></Suspense>} />
      <Route path="/contribute" element={<Suspense fallback={<div className="app-loading-skeleton">Loading...</div>}><ContributePage /></Suspense>} />
      <Route path="/style-guide" element={<Suspense fallback={<div className="app-loading-skeleton">Loading...</div>}><StyleGuidePage /></Suspense>} />
      <Route path="/privacy" element={<Suspense fallback={<div className="app-loading-skeleton">Loading...</div>}><PrivacyPolicyPage /></Suspense>} />
      <Route path="/terms" element={<Suspense fallback={<div className="app-loading-skeleton">Loading...</div>}><TermsOfUsePage /></Suspense>} />
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
