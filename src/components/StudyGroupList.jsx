import React, { useState } from "react";

function StudyGroupList({ onSelectGroup, allGroups, currentUser, onJoinLeaveGroup, onToggleGroupOpen, onCreateGroupClick }) {
  const [searchQuery, setSearchQuery] = useState("");

  const myGroups = allGroups.filter((group) => group.isJoined);
  const suggestedGroups = allGroups.filter((group) => !group.isJoined);

  const filteredMyGroups = myGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestedGroups = suggestedGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="study-group-list">
      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button onClick={onCreateGroupClick} className="create-group-button">
        <i className="fas fa-plus"></i> Create Group
      </button>
      <h3>My Groups</h3>
      <ul>
        {filteredMyGroups.length > 0 ? (filteredMyGroups.map((group) => (
          <li key={group.id} className="group-item">
            <div onClick={() => onSelectGroup(group)} className="group-info">
              <i className="fas fa-users"></i> {group.name}
              <span>{group.course}</span>
            </div>
            <div className="group-actions">
              {group.creatorId === currentUser.id || group.isAdmin ? (
                <button
                  onClick={() => onToggleGroupOpen(group.id)}
                  className={`group-action-button ${group.isOpen ? "close-group" : "open-group"}`}
                >
                  {group.isOpen ? "Close" : "Open"}
                </button>
              ) : null}
              <button
                onClick={() => onJoinLeaveGroup(group.id)}
                className="group-action-button leave-group"
              >
                Leave
              </button>
            </div>
          </li>
        ))) : (<p className="no-groups-message">No groups joined yet.</p>)}
      </ul>
      <h3>Suggested Groups</h3>
      <ul>
        {filteredSuggestedGroups.length > 0 ? (filteredSuggestedGroups.map((group) => (
          <li key={group.id} className="group-item">
            <div onClick={() => onSelectGroup(group)} className="group-info">
              <i className="fas fa-users"></i> {group.name}
              <span>{group.course}</span>
            </div>
            <div className="group-actions">
              <button
                onClick={() => onJoinLeaveGroup(group.id)}
                className="group-action-button join-group"
                disabled={!group.isOpen}
              >
                {group.isOpen ? "Join" : "Closed"}
              </button>
            </div>
          </li>
        ))) : (<p className="no-groups-message">No suggested groups available.</p>)}
      </ul>
    </div>
  );
}

export default StudyGroupList; 