import React from 'react';
import '../Styles/Message.css';

const Message = ({ type, content, time }) => {
  const highlightUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="url-link">
        ${url}
        <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
      </a>`;
    });
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(content);
    // In a real app, you might show a toast notification here
    console.log('Message copied to clipboard');
  };

  return (
    <div className={`message ${type}`}>
      <div className={`message-avatar ${type}`}>
        {type === 'user' ? (
          <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        ) : (
          <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        )}
      </div>
      <div className="message-content">
        <div
          className={`message-bubble ${type}`}
          dangerouslySetInnerHTML={{ __html: type === 'assistant' ? highlightUrls(content) : content }}
        />
        <div className={`message-actions ${type}`}>
          <span>{time}</span>
          <button className="copy-btn" onClick={copyMessage}>
            <svg className="icon-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;