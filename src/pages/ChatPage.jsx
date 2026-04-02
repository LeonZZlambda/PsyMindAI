import React from 'react';
import MessageList from '../components/MessageList';
import InputArea from '../components/InputArea';

const ChatPage = ({ inputRef, onOpenHelp, onOpenSupport, onOpenReflections, onOpenMoodTracker, onOpenEmotionalJournal, onOpenGuidedLearning }) => {
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
  );
};

export default ChatPage;
