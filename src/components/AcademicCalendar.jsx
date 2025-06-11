import React, { useState } from "react";
import { format, eachDayOfInterval, isSameDay } from "date-fns";
import "../Styles/AcademicCalendar.css";

const AcademicCalendar = ({ semesterStart, semesterEnd, courses }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const semesterDays = eachDayOfInterval({
    start: new Date(semesterStart),
    end: new Date(semesterEnd),
  });

  const weeks = [];
  let week = [];

  semesterDays.forEach((day, index) => {
    week.push(day);
    if (week.length === 7 || index === semesterDays.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  const getCoursesForDate = (date) => {
    return courses.filter((course) =>
      course.dates.some((d) => isSameDay(new Date(d), date))
    );
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendarContainer">
      <div className="header">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="dayHeader">
            {day}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="weekRow">
          {week.map((day, dayIndex) => {
            const dayCourses = getCoursesForDate(day);
            const courseColors = [...new Set(dayCourses.map((c) => c.color))];

            return (
              <div
                key={dayIndex}
                className={`${"dayCell"} ${
                  isSameDay(day, selectedDate) ? styles.selectedDay : ""
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className="dayNumber">{format(day, "d")}</div>
                <div className="courseIndicators">
                  {courseColors.map((color, i) => (
                    <div
                      key={i}
                      className="courseDot"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {selectedDate && (
        <div className="dateDetails">
          <h3>{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
          <div className="courseList">
            {getCoursesForDate(selectedDate).map((course, index) => (
              <div key={index} className="courseItem">
                <div
                  className="courseColorBox"
                  style={{ backgroundColor: course.color }}
                ></div>
                <div>
                  <div className="courseName">{course.name}</div>
                  <div className="courseTime">{course.time}</div>
                  <div className="courseLocation">{course.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="legend">
        <h3>Course Legend</h3>
        <div className="legendItems">
          {courses.map((course, index) => (
            <div key={index} className="legendItem">
              <div
                className="legendColor"
                style={{ backgroundColor: course.color }}
              ></div>
              <span>{course.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
