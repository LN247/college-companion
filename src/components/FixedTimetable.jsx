import React from "react";
import { DAYS, TIME_SLOTS } from "../consatants/timetableConstants";
import '../Styles/FixedTimetable.css';

const getTimeSlotIndex = (time) => {
  const hour = parseInt(time.split(":")[0]);
  return hour - 7; // Start from 7 AM (assuming TIME_SLOTS starts from 7:00)
};

const FixedTimetable = ({ courses }) => {
  const timetableData = {};

  // Initialize timetable structure
  DAYS.forEach((day) => {
    timetableData[day] = {};
  });

  // Fill timetable with course data
  courses.forEach((course) => {
    const startHour = parseInt(course.start_time.split(":")[0]);
    const endHour = parseInt(course.end_time.split(":")[0]);

    // Fill all time slots that this course spans
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;

      // Check if this time slot exists in TIME_SLOTS
      if (TIME_SLOTS.includes(timeSlot)) {
        timetableData[course.day][timeSlot] = {
          ...course,
          isFirstSlot: hour === startHour, // Mark first slot for display purposes
          totalSlots: endHour - startHour   // Total slots this course spans
        };
      }
    }
  });

  return (
    <div className="fixed-timetable__container">
      <table className="fixed-timetable__table">
        <thead>
          <tr className="fixed-timetable__table-header">
            <th className="fixed-timetable__time-header">Time</th>
            {DAYS.map((day) => (
              <th key={day} className="fixed-timetable__day-header">
                {day.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIME_SLOTS.map((timeSlot) => (
            <tr key={timeSlot} className="fixed-timetable__table-row">
              <td className="fixed-timetable__time-slot">{timeSlot}</td>
              {DAYS.map((day) => {
                const course = timetableData[day][timeSlot];
                return (
                  <td key={`${day}-${timeSlot}`} className="fixed-timetable__table-cell">
                    {course && (
                      <div className="fixed-timetable__course-event">
                        <div className="fixed-timetable__course-name">{course.course_name}</div>
                        <div className="fixed-timetable__course-time">
                          {course.start_time} - {course.end_time}
                        </div>
                        <div className="fixed-timetable__course-semester">Semester {course.semester}</div>
                        <div className="fixed-timetable__course-difficulty">
                          Difficulty: {course.difficulty_level}
                        </div>
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