import React, { useState, useRef, useEffect } from 'react';
import '../Styles/IntputArea.css';

const InputArea = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px';
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const setQuickMessage = (message) => {
    setInputValue(message);
  };

  useEffect(() => {
    autoResize();
  }, [inputValue]);

  return (
    <div className="input-area">
      <div className="input-container-1">
        <div className="input-row">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              id="messageInput"
              className="message-input"
              placeholder="Type your message here... (Press Enter to send)"
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </div>

        <div className="quick-actions">
          <button className="quick-action blue" onClick={() => setQuickMessage('Can you help me with React development?')}>
            React Help
          </button>
          <button className="quick-action green" onClick={() => setQuickMessage('Show me some useful programming resources')}>
            Resources
          </button>
          <button className="quick-action purple" onClick={() => setQuickMessage('Explain how APIs work')}>
            APIs
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;