import React, { useEffect, useRef } from "react";

function ChatWindow({ selectedGroup, messages, currentUser, members, onToggleAdmin }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedGroup) {
    return null;
  }

  const isCurrentUserAdmin = selectedGroup.isAdmin || selectedGroup.creatorId === currentUser.id;

  return (
    <div className="chat-window modern-chat-window">
      <div className="chat-header chatwindow-header modern-chatwindow-header">
        <h2 className="chatwindow-title">{selectedGroup.name}</h2>
        <div className="members-list modern-members-list">
          {members.map((member) => (
            <div key={member.id} className="member-avatar-container modern-member-avatar-container">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=F68712&color=FFFFFF&size=64`}
                alt={member.name}
                className="member-avatar modern-member-avatar"
              />
              {member.isAdmin && <span className="admin-badge modern-admin-badge">Admin</span>}
              {isCurrentUserAdmin && member.id !== currentUser.id && (
                <button
                  className="toggle-admin-button modern-toggle-admin-button"
                  onClick={() => onToggleAdmin(selectedGroup.id, member.id)}
                  aria-label={member.isAdmin ? "Demote from admin" : "Promote to admin"}
                >
                  {member.isAdmin ? "Demote" : "Promote"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-messages modern-chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble modern-message-bubble ${message.sender === currentUser.name ? "my-message modern-my-message" : ""}`}
          >
            <span className="sender-name modern-sender-name">{message.sender}</span>
            <p className="message-content modern-message-content">{message.content}</p>
            <span className="message-time modern-message-time">{message.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatWindow; 