import React from 'react';
import {useState} from "react";
import { Calendar, Table ,Home} from 'lucide-react';
import { Button } from '../components/ui/Button';
import Timetable from '../components/Timetable';
import '../Styles/SemesterPlan.css';
import AcademicCalendar from "../components/AcademicCalendar";


// Reusable function to switch active tabs
const switchTab = (tabName, currentTab, setTab) => {
  if (currentTab !== tabName) {
    setTab(tabName);
  }
};



const StudySchedulePage = () => {
    const [activeTab, setActiveTab] = useState('timetable'); // Default active tab
  const [customEvents, setCustomEvents] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  const handleCustomEventAdd = (newEvent) => {
    setCustomEvents([...customEvents, newEvent]);
  };

// add the api calls to add and delete the events


const switchTab = (tabName, currentTab, setTab) => {
  if (currentTab !== tabName) {
    setActiveTab(tabName);
  }
};

// Add a new event
const addEvent = async (eventData) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch("/api/events/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  if (response.ok) {
    const newEvent = await response.json();
    setCustomEvents((prev) => [...prev, newEvent]);
    return newEvent;
  } else {
    // handle error
    return null;
  }
};

// Delete an event by ID
const deleteEvent = async (eventId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`/api/events/${eventId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    setCustomEvents((prev) => prev.filter((event) => event.id !== eventId));
    return true;
  } else {
    // handle error
    return false;
  }
};


  return (
    <div className="schedule-wrapper">
      <div className="schedule-container">
        <div className="schedule-header">
          <h1 className="schedule-title">Your Study Schedule</h1>
          <Button  variant="outline" className="btn-modify">
            <Home className="icon-small" />
            Home
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav">
          <Button
            onClick={() => switchTab('timetable', activeTab, setActiveTab)}
            variant={activeTab === 'timetable' ? 'default' : 'outline'}
            className="btn-tab"
          >
            <Table className="icon-small" />
            Timetable
          </Button>
          <Button
            onClick={() => switchTab('calendar', activeTab, setActiveTab)}
            variant={activeTab === 'calendar' ? 'default' : 'outline'}
            className="btn-tab"
          >
            <Calendar className="icon-small" />
            Personal Events
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'timetable' ? (
          <Timetable courses={courses} generatedSchedule={schedule} />
        ) : (
          <AcademicCalendar events={customEvents} onEventAdd={handleCustomEventAdd} />
        )}

        <button onClick={() => addEvent({ title: "New Event", ... })}>Add Event</button>
        <button onClick={() => deleteEvent(event.id)}>Delete</button>
      </div>
    </div>
  )
};
export default StudySchedulePage;