import React, { lazy, Suspense } from 'react'
import { SkeletonChatPage } from '../components/SkeletonScreen'

const MessageList = lazy(() => import('../components/MessageList'))
const InputArea = lazy(() => import('../components/InputArea'))

interface ChatPageProps {
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  onOpenHelp?: () => void
  onOpenSupport?: () => void
  onOpenReflections?: () => void
  onOpenMoodTracker?: () => void
  onOpenEmotionalJournal?: () => void
  onOpenGuidedLearning?: () => void
}

const ChatPage: React.FC<ChatPageProps> = ({
  inputRef,
  onOpenHelp,
  onOpenSupport,
  onOpenReflections,
  onOpenMoodTracker,
  onOpenEmotionalJournal,
  onOpenGuidedLearning,
}) => {
  return (
    <Suspense fallback={<SkeletonChatPage />}>
      <MessageList />
      <InputArea
        inputRef={inputRef}
        onOpenHelp={onOpenHelp}
        onOpenSupport={onOpenSupport}
        onOpenReflections={onOpenReflections}
        onOpenMoodTracker={onOpenMoodTracker}
        onOpenEmotionalJournal={onOpenEmotionalJournal}
        onOpenGuidedLearning={onOpenGuidedLearning}
      />
    </Suspense>
  )
}

export default ChatPage
