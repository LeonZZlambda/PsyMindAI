import React from 'react';
import MessageList from '../components/MessageList';
import InputArea from '../components/InputArea';

const ChatPage = ({ inputRef }) => {
  return (
    <>
      <MessageList />
      <InputArea inputRef={inputRef} />
    </>
  );
};

export default ChatPage;
