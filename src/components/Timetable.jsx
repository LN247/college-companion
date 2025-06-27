import React, { useState } from "react";
import FixedTimetable from "./FixedTimetable";
import GeneratedTimetable from "./GeneratedTimetable";
import { Button } from "../components/ui/Button";
import { BookOpen, Clock, Calendar, Table } from "lucide-react";
import "../Styles/Timetable.css";
import { Card } from "./ui/card";
import UserContext from "../context/UserContext";

const Timetable = () => {
  const { userTimetable, semesterTimetable, isLoading } =
    React.useContext(UserContext) || {};

  const [activeTab, setActiveTab] = useState("fixed");

  const currentData = activeTab === "fixed" ? semesterTimetable : userTimetable;

  const courseCount = Array.isArray(currentData)
    ? new Set(currentData.map((item) => item.course_id)).size
    : 0;

  const studyCount = Array.isArray(currentData)
    ? currentData.filter((e) => e.type === "study").length || currentData.length
    : 0;

  const totalHours = Array.isArray(currentData)
    ? currentData.reduce((total, event) => {
        const start = event.start_time || event.start;
        const end = event.end_time || event.end;
        if (start && end) {
          const [sh, sm] = start.split(":").map(Number);
          const [eh, em] = end.split(":").map(Number);
          const duration = eh + em / 60 - (sh + sm / 60);
          return total + duration;
        }
        return total;
      }, 0)
    : 0;

  const switchTab = (tabName, currentTab, setTab) => {
    if (currentTab !== tabName) {
      setTab(tabName);
    }
  };

  return (
    <div>
      {/* Stats */}
      <div className="stats-container">
        <Card className="stat-card blue-card">
          <div className="stat-content">
            <BookOpen className="stat-icon blue-icon" />
            <div>
              <p className="stat-value blue-value">{courseCount}</p>
              <p className="stat-label blue-label">Total Courses</p>
            </div>
          </div>
        </Card>
        <Card className="stat-card green-card">
          <div className="stat-content">
            <Clock className="stat-icon green-icon" />
            <div>
              <p className="stat-value green-value">{studyCount}</p>
              <p className="stat-label green-label">Study Sessions</p>
            </div>
          </div>
        </Card>
        <Card className="stat-card purple-card">
          <div className="stat-content">
            <Calendar className="stat-icon purple-icon" />
            <div>
              <p className="stat-value purple-value">
                {Math.round(totalHours)}h
              </p>
              <p className="stat-label purple-label">Weekly Hours</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <Button
          onClick={() => switchTab("fixed", activeTab, setActiveTab)}
          variant={activeTab === "fixed" ? "default" : "outline"}
          className="btn-tab"
        >
          <Table className="icon-small" />
          Fixed Timetable
        </Button>
        <Button
          onClick={() => switchTab("generated", activeTab, setActiveTab)}
          variant={activeTab === "generated" ? "default" : "outline"}
          className="btn-tab"
        >
          <Calendar className="icon-small" />
          Generated Timetable
        </Button>
      </div>

      {activeTab === "fixed" ? (
        <FixedTimetable courses={semesterTimetable} />
      ) : (
        <GeneratedTimetable generatedSchedule={userTimetable} />
      )}
    </div>
  );
};

export default Timetable;
