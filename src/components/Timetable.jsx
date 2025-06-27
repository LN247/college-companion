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
      <div className="timetable__stats-container">
        <Card className="timetable__stat-card timetable__stat-card--blue">
          <div className="timetable__stat-content">
            <BookOpen className="timetable__stat-icon timetable__stat-icon--blue" />
            <div>
              <p className="timetable__stat-value timetable__stat-value--blue">{courseCount}</p>
              <p className="timetable__stat-label timetable__stat-label--blue">Total Courses</p>
            </div>
          </div>
        </Card>
        <Card className="timetable__stat-card timetable__stat-card--green">
          <div className="timetable__stat-content">
            <Clock className="timetable__stat-icon timetable__stat-icon--green" />
            <div>
              <p className="timetable__stat-value timetable__stat-value--green">{studyCount}</p>
              <p className="timetable__stat-label timetable__stat-label--green">Study Sessions</p>
            </div>
          </div>
        </Card>
        <Card className="timetable__stat-card timetable__stat-card--purple">
          <div className="timetable__stat-content">
            <Calendar className="timetable__stat-icon timetable__stat-icon--purple" />
            <div>
              <p className="timetable__stat-value timetable__stat-value--purple">
                {Math.round(totalHours)}h
              </p>
              <p className="timetable__stat-label timetable__stat-label--purple">Weekly Hours</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="timetable__tab-nav">
        <Button
          onClick={() => switchTab("fixed", activeTab, setActiveTab)}
          variant={activeTab === "fixed" ? "default" : "outline"}
          className={`timetable__btn-tab${activeTab === "fixed" ? " active" : ""}`}
          aria-pressed={activeTab === "fixed"}
        >
          <Table className="timetable__icon-small" />
          Fixed Timetable
        </Button>
        <Button
          onClick={() => switchTab("generated", activeTab, setActiveTab)}
          variant={activeTab === "generated" ? "default" : "outline"}
          className={`timetable__btn-tab${activeTab === "generated" ? " active" : ""}`}
          aria-pressed={activeTab === "generated"}
        >
          <Calendar className="timetable__icon-small" />
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
