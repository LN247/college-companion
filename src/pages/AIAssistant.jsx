import React from 'react';
import {useState,} from "react";
import Header from '../components/Headers';
import ChatContainer from '../components/ChatContainer';
import InputArea from '../components/InputArea';
import '../Styles/AIAssistant.css';

// Helper function to get CSRF token from cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
};

function AIAssistant() {
     const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today? I can provide information, answer questions, and share relevant resources with you.",
      time: new Date()
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const API_BASE = "http://localhost:8000/api";

  const sendToAI = async (prompt) => {
    try {
      const response = await fetch(`${API_BASE}/ai/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({prompt: prompt})
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending message to AI:', error);
      return { response: "Sorry, I encountered an error. Please try again." };
    }
  };

  // Helper function to add messages to the chat
  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type: type,
      content: content,
      time: new Date()
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

   const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async (message) => {
    if (!message.trim()) return;

    // Add user message
    addMessage('user', message);
    setIsTyping(true);

    try {
      // Send to backend
      const aiResponse = await sendToAI(message);

      // Add AI response
      if (aiResponse && aiResponse.response) {
        addMessage('assistant', aiResponse.response);
      }
    } catch (error) {
      console.error('Error handling AI response:', error);
      addMessage('assistant', "Sorry, I encountered an error processing your request.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <ChatContainer
        messages={messages}
        isTyping={isTyping}
        formatTime={formatTime}
      />
      <InputArea onSend={handleSend} />
    </div>
  );
}

export default AIAssistant;