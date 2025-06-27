import React, { useState, useEffect, useRef, useCallback } from "react";
import "../Styles/ChatStyles.css";
import axiosInstance from "../api/axiosInstance";
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
  const [allGroups, setAllGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: null, name: "" });

  // Fetch user info, groups, and memberships on mount
  useEffect(() => {
    axiosInstance.get("/user/info/").then(res => {
      setCurrentUser({ id: res.data.id, name: res.data.username });
    });
    axiosInstance.get("/group-memberships/").then(res => {
      // You may need to adjust this mapping based on your API response
      setAllGroups(res.data.map(m => ({
        ...m.group, // assuming group-memberships returns {id, group: {...}}
        isJoined: true // user is a member of these groups
      })));
    });
    // Optionally, fetch all available groups and merge with memberships
    // axiosInstance.get("/group-chats/").then(res => { ... });
  }, []);

  // WebSocket handlers
  const handleMessageReceived = useCallback((data) => {
    if (data.type === 'chat_message' && data.message) {
      setMessages(prevMessages => [...prevMessages, data.message]);
    }
  }, []);

  const handleReadReceipt = useCallback((data) => {}, []);

  const { sendMessage, sendReadReceipt, connectionStatus } = useWebSocket(
    selectedGroup ? selectedGroup.id : null,
    handleMessageReceived,
    handleReadReceipt
  );

  // Load messages for selected group
  useEffect(() => {
    if (!selectedGroup) return;
    axiosInstance.get(`/group-messages/?group=${selectedGroup.id}`)
      .then(res => setMessages(res.data));
  }, [selectedGroup]);

  // Join a group
  const handleJoinGroup = async (groupId) => {
    try {
      await axiosInstance.post("/group-memberships/", { group: groupId });
      setAllGroups(groups =>
        groups.map(g => g.id === groupId ? { ...g, isJoined: true } : g)
      );
      if (selectedGroup && selectedGroup.id === groupId) {
        setSelectedGroup(g => ({ ...g, isJoined: true }));
      }
    } catch (e) {
      alert("Failed to join group.");
    }
  };

  // Leave a group
  const handleLeaveGroup = async (groupId) => {
    try {
      // Find the membership id for this group
      const membershipRes = await axiosInstance.get("/group-memberships/");
      const membership = membershipRes.data.find(m => m.group.id === groupId);
      if (membership) {
        await axiosInstance.delete(`/group-memberships/${membership.id}/`);
        setAllGroups(groups =>
          groups.map(g => g.id === groupId ? { ...g, isJoined: false } : g)
        );
        if (selectedGroup && selectedGroup.id === groupId) {
          setSelectedGroup(g => ({ ...g, isJoined: false }));
        }
      }
    } catch (e) {
      alert("Failed to leave group.");
    }
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
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
      sendMessage(message, currentUser.id);
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    <div className="chat-container modern-chat">
      <aside className="sidebar modern-sidebar">
        <div className="sidebar-header">
          <h2>Study Groups</h2>
          <button onClick={toggleTheme} className="theme-toggle modern-theme-toggle" aria-label="Switch theme">
            <span className="theme-toggle-icon" />
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>
        <StudyGroupList
          allGroups={allGroups}
          currentUser={currentUser}
          onSelectGroup={handleSelectGroup}
          onJoinLeaveGroup={(groupId, isJoined) =>
            isJoined ? handleLeaveGroup(groupId) : handleJoinGroup(groupId)
          }
          onToggleGroupOpen={handleToggleGroupOpen}
          onCreateGroupClick={() => setIsCreateModalOpen(true)}
        />
      </aside>
      <main className="main-content modern-main-content">
        <header className="chat-header modern-chat-header">
          <div className="chat-title-group">
            <h1>Study Group Chat</h1>
            <div className="connection-status modern-connection-status">
              {selectedGroup ? (
                <>
                  <span className="status-dot status-dot--active" />
                  Connected to <b>{selectedGroup.name}</b>
                </>
              ) : (
                <>
                  <span className="status-dot status-dot--inactive" />
                  No group selected
                </>
              )}
            </div>
          </div>
        </header>
        <section className="chat-section">
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
                <div className="chat-input modern-chat-input">
                  {selectedFile && (
                    <div className="file-preview modern-file-preview">
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" className="image-preview modern-image-preview" />
                      ) : (
                        <div className="file-info modern-file-info">
                          <span>{selectedFile.name}</span>
                          <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                        </div>
                      )}
                      <button className="remove-file modern-remove-file" onClick={handleRemoveFile} aria-label="Remove file">
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
                <div className="chat-input disabled-input modern-disabled-input">
                  <p>{!selectedGroup.isJoined ? "Join the group to send messages." : "This group is currently closed."}</p>
                </div>
              )}
            </>
          ) : (
            <div className="placeholder-chat modern-placeholder-chat">
              <div className="placeholder-content">
                <img src="/src/assets/Notfound-background.jpeg" alt="No group selected" className="placeholder-image" />
                <p className="no-group-selected modern-no-group-selected">Select a study group to start chatting.</p>
              </div>
            </div>
          )}
        </section>
      </main>
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}

export default ChatPage; 