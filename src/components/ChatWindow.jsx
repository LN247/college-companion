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
    <>
      <div className="chat-header">
        <h2>{selectedGroup.name}</h2>
        <div className="members-list">
          {members.map((member) => (
            <div key={member.id} className="member-avatar-container">
              <img
                src={`https://ui-avatars.com/api/?name=${member.name.replace(
                  / /g,
                  "+"
                )}&background=F68712&color=FFFFFF`}
                alt={member.name}
              />
              {member.isAdmin && <span className="admin-badge">Admin</span>}
              {isCurrentUserAdmin && member.id !== currentUser.id && (
                <button
                  className="toggle-admin-button"
                  onClick={() => onToggleAdmin(selectedGroup.id, member.id)}
                >
                  {member.isAdmin ? "Demote" : "Promote"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-bubble ${message.sender === currentUser.name ? "my-message" : ""}`}
          >
            <span className="sender-name">{message.sender}</span>
            <p>{message.content}</p>
            <span className="message-time">{message.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
}

export default ChatWindow; 