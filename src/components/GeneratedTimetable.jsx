import React from 'react';
import { DAYS, TIME_SLOTS } from '../consatants/timetableConstants';

const GeneratedTimetable = ({ generatedSchedule }) => {
  if (!Array.isArray(generatedSchedule)) {
    console.error('generatedSchedule is not an array:', generatedSchedule);
    return <div>No valid schedule data available.</div>;
  }

  // Create dynamic time slots based on the schedule data
  const allTimeSlots = new Set([...TIME_SLOTS]);

  // Add any missing time slots from the schedule data
  generatedSchedule.forEach((scheduleItem) => {
    const startHour = parseInt(scheduleItem.start_time.split(':')[0]);
    const endHour = parseInt(scheduleItem.end_time.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      allTimeSlots.add(timeSlot);
    }
  });

  // Convert to sorted array
  const dynamicTimeSlots = Array.from(allTimeSlots).sort((a, b) => {
    const hourA = parseInt(a.split(':')[0]);
    const hourB = parseInt(b.split(':')[0]);
    return hourA - hourB;
  });

  const timetableData = {};

  // Initialize timetable structure with dynamic time slots
  DAYS.forEach((day) => {
    timetableData[day] = {};
    dynamicTimeSlots.forEach((timeSlot) => {
      timetableData[day][timeSlot] = [];
    });
  });

  // Fill timetable with schedule data
  generatedSchedule.forEach((scheduleItem) => {
    const startHour = parseInt(scheduleItem.start_time.split(':')[0]);
    const endHour = parseInt(scheduleItem.end_time.split(':')[0]);

    // Fill all time slots that this course spans
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;

      // Now we know the time slot exists because we created it above
      if (timetableData[scheduleItem.day]) {
        timetableData[scheduleItem.day][timeSlot].push({
          ...scheduleItem,
          isFirstSlot: hour === startHour, // Mark first slot for display purposes
          totalSlots: endHour - startHour   // Total slots this course spans
        });
      }
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
          {dynamicTimeSlots.map((timeSlot) => (
            <tr key={timeSlot} className="table-row">
              <td className="time-slot">{timeSlot}</td>
              {DAYS.map((day) => (
                <td key={`${day}-${timeSlot}`} className="table-cell">
                  {timetableData[day][timeSlot].map((scheduleItem, index) => (
                    <div key={`${scheduleItem.id}-${index}`} className="course-event generated-event">
                      <div className="course-name">Course {scheduleItem.course}</div>
                      <div className="course-time">
                        {scheduleItem.start_time} - {scheduleItem.end_time}
                      </div>
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