import React from 'react';
import Header from '../components/Headers';
import ChatContainer from '../components/ChatContainer';
import InputArea from '../components/InputArea';
import './AIAssistant.css';

function AIAssistant() {
  return (
    <div className="app-container">
      <Header />
      <ChatContainer />
      <InputArea />
    </div>
  );
}

export default AIAssistant;