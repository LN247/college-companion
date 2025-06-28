import React, { useState, useEffect, useRef, useCallback, useContext } from "react";
import "../Styles/ChatStyles.css";
import StudyGroupList from "../components/StudyGroupList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import CreateGroupModal from "../components/CreateGroupModal";
import useWebSocket from '../hooks/UseWebSocket';
import { useToast } from "../hooks/use-toast.js";
import userContext from "../context/UserContext.jsx";
import axios from 'axios';
function ChatPage() {
  const [theme, setTheme] = useState("light");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [allGroups, setAllGroups] = useState([]);
  const { user } = useContext(userContext);
  const { addtoast } = useToast();

  // Fetch groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("/group-memberships/");
        setAllGroups(res.data.map(m => ({
          ...m.group,
          isJoined: true
        })));
      } catch (error) {
        console.error("Error fetching groups:", error);
        addtoast({
          title: 'Error',
          description: 'Failed to load study groups',
          variant: "Error",
        });
      }
    };

    if (user) fetchGroups();
  }, [user, addtoast]);

  const handleMessageReceived = useCallback((data) => {
    if (data.type === 'chat_message') {
      setMessages(prev => [...prev, data.message]);
    }
  }, [setMessages]);

  const handleReadReceipt = useCallback((data) => {
    // Handle read receipts
  }, []);

  const { sendMessage, sendReadReceipt, connectionStatus } = useWebSocket(
    selectedGroup ? selectedGroup.id : null,
    user?.id,
    handleMessageReceived,
    handleReadReceipt
  );

  // Load messages for selected group
  useEffect(() => {
    if (!selectedGroup) return;

    const loadMessages = async () => {
      try {
        const res = await axios.get(`/group-messages/?group=${selectedGroup.id}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error loading messages:", error);
        addtoast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: "Error",
        });
      }
    };

    loadMessages();
  }, [selectedGroup, addtoast]);

  // Join a group
  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post("/group-memberships/", { group: groupId });
      setAllGroups(groups =>
        groups.map(g => g.id === groupId ? { ...g, isJoined: true } : g)
      );
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(prev => ({ ...prev, isJoined: true }));
      }
    } catch (error) {
      console.error("Join group failed:", error);
      addtoast({
        title: 'Error',
        description: 'Failed to join group',
        variant: "Error",
      });
    }
  };

  // Leave a group
  const handleLeaveGroup = async (groupId) => {
    try {
      const membershipRes = await axios.get("/group-memberships/");
      const membership = membershipRes.data.find(m => m.group.id === groupId);
      if (membership) {
        await axiosInstance.delete(`/group-memberships/${membership.id}/`);
        setAllGroups(groups =>
          groups.map(g => g.id === groupId ? { ...g, isJoined: false } : g)
        );
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(prev => ({ ...prev, isJoined: false }));
        }
      }
    } catch (error) {
      console.error("Leave group failed:", error);
      addtoast({
        title: 'Error',
        description: 'Failed to leave group',
        variant: "Error",
      });
    }
  };

  useEffect(() => {
    document.body.className = theme;
    return () => {
      document.body.className = '';
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setMessages([]);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !selectedGroup || !user) return;

    let fileUrl = "";

    try {
      // Upload file if exists
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await axiosInstance.post('/uploads/', formData);
        fileUrl = uploadRes.data.url;
      }

      // Send message via WebSocket
      sendMessage(message, user.id, fileUrl);

      // Reset file state
      setSelectedFile(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

    } catch (error) {
      console.error("Error sending message:", error);
      addtoast({
        title: 'Error',
        description: 'Failed to send message',
        variant: "Error",
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleToggleGroupOpen = (groupId) => {
    setAllGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId ? { ...group, isOpen: !group.isOpen } : group
      )
    );
    if (selectedGroup?.id === groupId) {
      setSelectedGroup(prev => ({ ...prev, isOpen: !prev.isOpen }));
    }
  };

  const handleToggleAdmin = (groupId, memberId) => {
    setAllGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.map(member =>
                member.id === memberId
                  ? { ...member, isAdmin: !member.isAdmin }
                  : member
              )
            }
          : group
      )
    );

    if (selectedGroup?.id === groupId) {
      setSelectedGroup(prev => ({
        ...prev,
        members: prev.members.map(member =>
          member.id === memberId
            ? { ...member, isAdmin: !member.isAdmin }
            : member
        )
      }));
    }
  };

  const handleCreateGroup = async ({ groupName, course }) => {
    try {
      const response = await axiosInstance.post("/groups/", {
        name: groupName,
        course: course,
        is_open: true
      });

      const newGroup = {
        ...response.data,
        isJoined: true,
        isAdmin: true,
        isOpen: true,
        creatorId: user?.id,
        members: [{ id: user?.id, name: user?.name, avatar: "", isAdmin: true }]
      };

      setAllGroups(prev => [...prev, newGroup]);
      setSelectedGroup(newGroup);
      setIsCreateModalOpen(false);

    } catch (error) {
      console.error("Group creation failed:", error);
      addtoast({
        title: 'Error',
        description: 'Failed to create group',
        variant: "Error",
      });
    }
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