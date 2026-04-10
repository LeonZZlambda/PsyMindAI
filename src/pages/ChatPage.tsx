import React from 'react'
import MessageList from '../components/MessageList'
import InputArea from '../components/InputArea'

interface ChatPageProps {
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
  onOpenHelp?: () => void
  onOpenSupport?: () => void
  onOpenReflections?: () => void
  onOpenMoodTracker?: () => void
  onOpenEmotionalJournal?: () => void
  onOpenGuidedLearning?: () => void
}

const ChatPage: React.FC<ChatPageProps> = ({ inputRef, onOpenHelp, onOpenSupport, onOpenReflections, onOpenMoodTracker, onOpenEmotionalJournal, onOpenGuidedLearning }) => {
  return (
    <>
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
    </>
  )
}

export default ChatPage
