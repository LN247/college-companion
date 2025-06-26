import React from 'react';
import { DAYS, TIME_SLOTS } from '../consatants/timetableConstants';

const GeneratedTimetable = ({ generatedSchedule }) => {
  if (!Array.isArray(generatedSchedule)) {
    console.error('generatedSchedule is not an array:', generatedSchedule);
    return <div>No valid schedule data available.</div>;
  }

  const timetableData = {};

  // Initialize timetable structure
  DAYS.forEach((day) => {
    timetableData[day] = {};
    TIME_SLOTS.forEach((timeSlot) => {
      timetableData[day][timeSlot] = [];
    });
  });

  // Fill timetable with events data
  generatedSchedule.forEach((event) => {
    const eventDay = event.start.toLocaleDateString('en-US', { weekday: 'long' });
    const startHour = event.start.getHours();
    const timeSlot = TIME_SLOTS.find((slot) => parseInt(slot.split(':')[0]) === startHour);

    if (timeSlot && timetableData[eventDay]) {
      timetableData[eventDay][timeSlot].push(event);
    }
  });

  return (
    <div className="timetable-container">
      <table className="timetable-table">
        <thead>
          <tr className="table-header generated-header">
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
              {DAYS.map((day) => (
                <td key={`${day}-${timeSlot}`} className="table-cell">
                  {timetableData[day][timeSlot].map((event, index) => (
                    <div key={index} className="course-event">
                      <div className="course-name">{event.title}</div>
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GeneratedTimetable;