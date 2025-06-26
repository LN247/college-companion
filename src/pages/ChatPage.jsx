import React, { useState, useEffect, useRef, useCallback } from "react";
import "../Styles/ChatStyles.css";
import StudyGroupList from "../components/StudyGroupList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import CreateGroupModal from "../components/CreateGroupModal";
import useWebSocket from '../hooks/UseWebSocket';

function ChatPage() {
  const [theme, setTheme] = useState("light"); // "light" or "dark"
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // New state for modal
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [allGroups, setAllGroups] = useState([
    { 
      id: "1", 
      name: "Calculus Study Group", 
      course: "Math 101", 
      isJoined: true, 
      isAdmin: true, 
      isOpen: true, 
      creatorId: "user1",
      members: [
        { id: "user1", name: "You", avatar: "", isAdmin: true },
        { id: "user2", name: "Sophia", avatar: "", isAdmin: false },
        { id: "user3", name: "Ethan", avatar: "", isAdmin: false },
      ],
    },
    { 
      id: "2", 
      name: "Physics Study Group", 
      course: "Physics 201", 
      isJoined: false, 
      isAdmin: false, 
      isOpen: true, 
      creatorId: "user2",
      members: [
        { id: "user2", name: "Sophia", avatar: "", isAdmin: true },
        { id: "user1", name: "You", avatar: "", isAdmin: false },
      ],
    },
    { 
      id: "3", 
      name: "Chemistry Study Group", 
      course: "Chemistry 101", 
      isJoined: true, 
      isAdmin: false, 
      isOpen: true, 
      creatorId: "user3",
      members: [
        { id: "user3", name: "Ethan", avatar: "", isAdmin: true },
        { id: "user1", name: "You", avatar: "", isAdmin: false },
      ],
    },
    { 
      id: "4", 
      name: "History Study Group", 
      course: "History 101", 
      isJoined: false, 
      isAdmin: false, 
      isOpen: true, 
      creatorId: "user4",
      members: [
        { id: "user4", name: "Olivia", avatar: "", isAdmin: true },
      ],
    },
    { 
      id: "5", 
      name: "English Study Group", 
      course: "English 101", 
      isJoined: false, 
      isAdmin: false, 
      isOpen: false, 
      creatorId: "user1",
      members: [
        { id: "user1", name: "You", avatar: "", isAdmin: true },
      ],
    }, 
  ]);

  const currentUser = { id: "user1", name: "You" }; // Mock current user

  // WebSocket handlers
  const handleMessageReceived = useCallback((data) => {
    console.log('Message received:', data);
    if (data.type === 'chat_message' && data.message) {
      setMessages(prevMessages => [...prevMessages, data.message]);
    }
  }, []);

  const handleReadReceipt = useCallback((data) => {
    console.log('Read receipt received:', data);
  }, []);

  // Connect to WebSocket only when a group is selected
  const { sendMessage, sendReadReceipt, connectionStatus } = useWebSocket(
    selectedGroup ? selectedGroup.id : null,
    handleMessageReceived,
    handleReadReceipt
  );

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    // Clear messages when switching groups
    setMessages([]);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSendMessage = (message) => {
    if (message.trim() && selectedGroup) {
      // Send message in the format expected by Django Channels backend
      sendMessage(message, currentUser.id);
      
      // Clear file selection
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleJoinLeaveGroup = (groupId) => {
    setAllGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, isJoined: !group.isJoined }
          : group
      )
    );
    if (selectedGroup && selectedGroup.id === groupId) {
      setSelectedGroup((prevSelectedGroup) => ({ ...prevSelectedGroup, isJoined: !prevSelectedGroup.isJoined }));
    }
  };

  const handleToggleGroupOpen = (groupId) => {
    setAllGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, isOpen: !group.isOpen }
          : group
      )
    );
    if (selectedGroup && selectedGroup.id === groupId) {
      setSelectedGroup((prevSelectedGroup) => ({ ...prevSelectedGroup, isOpen: !prevSelectedGroup.isOpen }));
    }
  };

  const handleToggleAdmin = (groupId, memberId) => {
    setAllGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.map((member) =>
                member.id === memberId
                  ? { ...member, isAdmin: !member.isAdmin }
                  : member
              ),
            }
          : group
      )
    );

    if (selectedGroup && selectedGroup.id === groupId) {
      setSelectedGroup((prevSelectedGroup) => ({
        ...prevSelectedGroup,
        members: prevSelectedGroup.members.map((member) =>
          member.id === memberId
            ? { ...member, isAdmin: !member.isAdmin }
            : member
        ),
      }));
    }
  };

  const handleCreateGroup = ({ groupName, course }) => {
    const newGroupId = `group${allGroups.length + 1}`;
    const newGroup = {
      id: newGroupId,
      name: groupName,
      course: course,
      isJoined: true,
      isAdmin: true, // Creator is admin
      isOpen: true, // New groups are open by default
      creatorId: currentUser.id,
      members: [{ id: currentUser.id, name: currentUser.name, avatar: "", isAdmin: true }],
    };
    setAllGroups((prevGroups) => [...prevGroups, newGroup]);
    setSelectedGroup(newGroup); // Automatically select the new group
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Study Group Chat</h1>
        <div className="connection-status">
          Status: {selectedGroup ? `${connectionStatus} to ${selectedGroup.name}` : 'No group selected'}
        </div>
      </div>
      <div className="sidebar">
        <h2>Study Groups</h2>
        <StudyGroupList
          allGroups={allGroups}
          currentUser={currentUser}
          onSelectGroup={handleSelectGroup}
          onJoinLeaveGroup={handleJoinLeaveGroup}
          onToggleGroupOpen={handleToggleGroupOpen}
          onCreateGroupClick={() => setIsCreateModalOpen(true)} // Open modal
        />
        <button onClick={toggleTheme} className="theme-toggle">
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
      <div className="main-content">
        {selectedGroup ? (
          <>
            <ChatWindow
              selectedGroup={selectedGroup}
              messages={messages}
              currentUser={currentUser}
              members={selectedGroup.members}
              onToggleAdmin={handleToggleAdmin}
            />
            {selectedGroup.isJoined && selectedGroup.isOpen ? (
              <div className="chat-input">
                {selectedFile && (
                  <div className="file-preview">
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="image-preview" />
                    ) : (
                      <div className="file-info">
                        <span>{selectedFile.name}</span>
                        <span className="file-size">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    )}
                    <button className="remove-file" onClick={handleRemoveFile}>
                      ×
                    </button>
                  </div>
                )}
                <MessageInput 
                  onSendMessage={handleSendMessage}
                  fileInputRef={fileInputRef}
                  onFileSelect={handleFileSelect}
                />
              </div>
            ) : (
              <div className="chat-input disabled-input">
                <p>{!selectedGroup.isJoined ? "Join the group to send messages." : "This group is currently closed."}</p>
              </div>
            )}
          </>
        ) : (
          <div className="placeholder-chat">
            <p className="no-group-selected">Select a study group to start chatting.</p>
          </div>
        )}
      </div>
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}

export default ChatPage; 