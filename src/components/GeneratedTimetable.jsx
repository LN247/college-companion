import React from 'react';
import { DAYS, TIME_SLOTS } from '../consatants/timetableConstants';
import '../Styles/Timetable.css';

const GeneratedTimetable = ({ generatedSchedule }) => {
  if (!Array.isArray(generatedSchedule)) {
    console.error('generatedSchedule is not an array:', generatedSchedule);
    return <div>No valid schedule data available.</div>;
  }


  const allTimeSlots = new Set([...TIME_SLOTS]);


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


  generatedSchedule.forEach((scheduleItem) => {
    const startHour = parseInt(scheduleItem.start_time.split(':')[0]);
    const endHour = parseInt(scheduleItem.end_time.split(':')[0]);


    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;


      if (timetableData[scheduleItem.day]) {
        timetableData[scheduleItem.day][timeSlot].push({
          ...scheduleItem,
          isFirstSlot: hour === startHour,
          totalSlots: endHour - startHour
        });
      }
    }
  });

  return (
    <div className="generated-timetable__container">
      <table className="generated-timetable__table">
        <thead>
          <tr className="generated-timetable__table-header">
            <th className="generated-timetable__time-header">Time</th>
            {DAYS.map((day) => (
              <th key={day} className="generated-timetable__day-header">
                {day.slice(0, 3)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dynamicTimeSlots.map((timeSlot) => (
            <tr key={timeSlot} className="generated-timetable__table-row">
              <td className="generated-timetable__time-slot">{timeSlot}</td>
              {DAYS.map((day) => (
                <td key={`${day}-${timeSlot}`} className="generated-timetable__table-cell">
                  {timetableData[day][timeSlot].map((scheduleItem, index) => (
                    <div key={`${scheduleItem.id}-${index}`} className="generated-timetable__event">
                      <div className="generated-timetable__course-name">Course {scheduleItem.course}</div>
                      <div className="generated-timetable__course-time">
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