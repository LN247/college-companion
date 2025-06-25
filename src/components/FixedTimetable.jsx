import React from 'react';
import { DAYS, TIME_SLOTS } from '../consatants/timetableConstants';

const getTimeSlotIndex = (time) => {
  const hour = parseInt(time.split(':')[0]);
  return hour - 7; // Start from 7 AM
};

const FixedTimetable = ({ courses }) => {
  const timetableData = {};

  // Initialize timetable structure
  DAYS.forEach((day) => {
    timetableData[day] = {};
  });

  // Fill timetable with course data
  courses.forEach((course) => {
    const startIndex = getTimeSlotIndex(course.startTime);
    const endIndex = getTimeSlotIndex(course.endTime);

    for (let i = startIndex; i < endIndex; i++) {
      if (i >= 0 && i < TIME_SLOTS.length) {
        timetableData[course.day][TIME_SLOTS[i]] = course;
      }
    }
  });

  return (
    <div className="timetable-container">
      <table className="timetable-table">
        <thead>
          <tr className="table-header">
            <th className="time-header">Time</th>
            {DAYS.map((day) => (
              <th key={day} className="day-header">
                {day.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((timeSlot) => (
            <tr key={timeSlot} className="table-row">
              <td className="time-slot">{timeSlot}</td>
              {DAYS.map((day) => {
                const course = timetableData[day][timeSlot];
                return (
                  <td key={`${day}-${timeSlot}`} className="table-cell">
                    {course && (
                      <div className="course-event">
                        <div className="course-name">{course.name}</div>
                        <div className="course-time">
                          {course.startTime} - {course.endTime}
                        </div>
                        <div className="course-semester">{course.semester}</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FixedTimetable;