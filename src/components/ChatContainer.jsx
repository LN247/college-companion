import React, { useRef, useEffect } from 'react';
import Message from './Message';
import '../Styles/ChatContainer.css';

const ChatContainer = ({ messages, isTyping, formatTime }) => {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-container" ref={chatContainerRef}>
      <div className="messages">
        {messages.map(message => (
          <Message
            key={message.id}
            type={message.type}
            content={message.content}
            time={formatTime(message.time)}
          />
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <div className="message-avatar assistant">
              <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;