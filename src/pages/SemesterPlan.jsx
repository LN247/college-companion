import React from 'react';
import {useState} from "react";
import { Calendar, Table ,Home} from 'lucide-react';
import { Button } from '../components/ui/Button';
import Timetable from '../components/Timetable';
import '../Styles/SemesterPlan.css';
import AcademicCalendar from "../components/AcademicCalendar";
import userContext from "../context/UserContext.jsx";



const StudySchedulePage = () => {
    const [activeTab, setActiveTab] = useState('timetable');
  const [customEvents, setCustomEvents] = useState([]);


  const[userTimetable,events,semesterTimetable]=React.useContext(userContext);
  setCustomEvents(events);

  const handleCustomEventAdd = (newEvent) => {
    setCustomEvents([...customEvents, newEvent]);
  };


const switchTab = (tabName, currentTab, setTab) => {
  if (currentTab !== tabName) {
    setActiveTab(tabName);
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
          <Timetable courses={semesterTimetable} generatedSchedule={userTimetable} />
        ) : (
          <AcademicCalendar events={customEvents} onEventAdd={handleCustomEventAdd} />
        )}


      </div>
    </div>
  )
};
export default StudySchedulePage;