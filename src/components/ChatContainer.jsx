import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import '../Styles/ChatContainer.css';

const ChatContainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today? I can provide information, answer questions, and share relevant resources with you.",
      time: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const sampleResponses = [
    "I'd be happy to help! For more detailed information, you might want to check out https://www.example.com/documentation or visit https://github.com/example/repo for the source code.",
    "That's a great question! Here are some helpful resources: https://stackoverflow.com/questions/example, https://developer.mozilla.org/en-US/docs/Web, and https://www.w3schools.com/html/.",
    "I can help you with that. You might find these links useful: https://reactjs.org/docs/getting-started.html for React documentation, and https://tailwindcss.com/docs for styling reference.",
    "Based on your question, I recommend checking out: https://www.youtube.com/watch?v=example for a video tutorial, and https://medium.com/@example/article for an in-depth article.",
    "Here's what I found: https://api.example.com/v1/docs provides API documentation, while https://www.npmjs.com/package/example has the package details you need."
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const addMessage = (type, content) => {
    const newMessage = {
      id: messages.length + 1,
      type,
      content,
      time: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      addMessage('assistant', randomResponse);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = (message) => {
    if (!message.trim()) return;
    addMessage('user', message);
    simulateResponse();
  };

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