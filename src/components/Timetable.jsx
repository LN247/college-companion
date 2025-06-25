import React, { useState } from 'react';
import FixedTimetable from './FixedTimetable';
import GeneratedTimetable from './GeneratedTimetable';
import { Button } from '../components/ui/Button';
import {Eye, BookOpen, Clock, Calendar, Table} from 'lucide-react';
import '../Styles/Timetable.css';
import {Card} from "./ui/card";
const Timetable = ({ courses, generatedSchedule = [] }) => {
  const [viewType, setViewType] = useState('fixed'); // Tracks the selected timetable view

    // Calculate the total number of courses
  const courseCount = Array.isArray(courses) ? courses.length : 0;

  // Calculate the number of study sessions
  const studyCount = Array.isArray(generatedSchedule)
    ? generatedSchedule.filter((e) => e.type === 'study').length
    : 0;

  // Calculate the total hours for the schedule
  const totalHours = Array.isArray(generatedSchedule)
    ? generatedSchedule.reduce((total, event) => {
        const duration = (new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60);
        return total + duration;
      }, 0)
    : 0;

   const [activeTab, setActiveTab] = useState('fixed');



const switchTab = (tabName, currentTab, setTab) => {
  if (currentTab !== tabName) {
    setTab(tabName);
  }
};

  return (
    <div>
      {/* Render the selected timetable */}

        <div className="stats-container">
      {/* Total Courses */}
      <Card className="stat-card blue-card">
        <div className="stat-content">
          <BookOpen className="stat-icon blue-icon" />
          <div>
            <p className="stat-value blue-value">{courseCount}</p>
            <p className="stat-label blue-label">Total Courses</p>
          </div>
        </div>
      </Card>

      {/* Study Sessions */}
      <Card className="stat-card green-card">
        <div className="stat-content">
          <Clock className="stat-icon green-icon" />
          <div>
            <p className="stat-value green-value">{studyCount}</p>
            <p className="stat-label green-label">Study Sessions</p>
          </div>
        </div>
      </Card>

      {/* Weekly Hours */}
      <Card className="stat-card purple-card">
        <div className="stat-content">
          <Calendar className="stat-icon purple-icon" />
          <div>
            <p className="stat-value purple-value">{Math.round(totalHours)}h</p>
            <p className="stat-label purple-label">Weekly Hours</p>
          </div>
        </div>
      </Card>
    </div>


                {/* Tab Navigation */}
        <div className="tab-nav">
          <Button
            onClick={() => switchTab('fixed', activeTab, setActiveTab)}
            variant={activeTab === 'fixed' ? 'default' : 'outline'}
            className="btn-tab"
          >
            <Table className="icon-small" />
            Fixed Timetable
          </Button>
          <Button
            onClick={() => switchTab('generated', activeTab, setActiveTab)}
            variant={activeTab === 'generated' ? 'default' : 'outline'}
            className="btn-tab"
          >
            <Calendar className="icon-small" />
            Generated Timetable
          </Button>
        </div>



      {activeTab === 'fixed' ? (
        <FixedTimetable courses={courses} />
      ) : (
        <GeneratedTimetable generatedSchedule={generatedSchedule} />
      )}


    </div>
  );
};

export default Timetable;