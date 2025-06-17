import React, { useState } from "react";

function MessageInput({ onSendMessage, fileInputRef, onFileSelect }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="message-input-field"
        />
        <div className="input-actions">
          <label className="file-upload-button">
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
            />
            <i className="fas fa-paperclip"></i>
          </label>
          <button type="submit" className="send-button">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </form>
  );
}

export default MessageInput; 