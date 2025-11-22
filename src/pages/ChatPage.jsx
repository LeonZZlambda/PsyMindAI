import React from 'react';
import MessageList from '../components/MessageList';
import InputArea from '../components/InputArea';

const ChatPage = ({ inputRef, onOpenHelp, onOpenSupport, onOpenReflections }) => {
  return (
    <>
      <MessageList />
      <InputArea 
        inputRef={inputRef} 
        onOpenHelp={onOpenHelp} 
        onOpenSupport={onOpenSupport}
        onOpenReflections={onOpenReflections}
      />
    </>
  );
};

export default ChatPage;
