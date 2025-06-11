import React, { useState, useEffect } from "react";
import "../Styles/ChatStyles.css";
import StudyGroupList from "../components/StudyGroupList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import CreateGroupModal from "../components/CreateGroupModal";

function ChatPage() {
  const [theme, setTheme] = useState("light"); // "light" or "dark"
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // New state for modal
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

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Load mock messages when a group is selected (for demonstration)
  useEffect(() => {
    if (selectedGroup) {
      // In a real application, you'd fetch messages from a backend
      setMessages([
        {
          id: 1,
          sender: "Sophia",
          content: "Hey everyone, are we meeting at the library today?",
          time: "10:00 AM",
        },
        {
          id: 2,
          sender: "Ethan",
          content: "Yes, I'll be there in 10 minutes.",
          time: "10:05 AM",
        },
        {
          id: 3,
          sender: "Olivia",
          content: "Sounds good, see you there!",
          time: "10:07 AM",
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedGroup]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleSendMessage = (newMessageContent) => {
    if (!selectedGroup || !selectedGroup.isJoined || !selectedGroup.isOpen) return;

    const newMessage = {
      id: messages.length + 1,
      sender: currentUser.name,
      content: newMessageContent,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
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
                <MessageInput onSendMessage={handleSendMessage} />
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