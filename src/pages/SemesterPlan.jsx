import React, { useState } from 'react';
import { FaCalendarAlt, FaBook, FaGraduationCap, FaUsers, FaFlag } from 'react-icons/fa';
import '../Styles/SemesterPlan.css';

const SemesterPlan = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Mock data - replace with actual API data
  const semesterEvents = [
    {
      id: 1,
      title: 'Orientation Week',
      date: '2024-09-01',
      type: 'academic',
      description: 'Welcome week for new students'
    },
    {
      id: 2,
      title: 'Cultural Day',
      date: '2024-09-15',
      type: 'event',
      description: 'Annual cultural celebration'
    },
    {
      id: 3,
      title: 'Midterm Exams',
      date: '2024-10-15',
      type: 'academic',
      description: 'First semester midterm examinations'
    },
    {
      id: 4,
      title: 'Mountain Day',
      date: '2024-11-03',
      type: 'event',
      description: 'Traditional mountain climbing event'
    }
  ];

  const semesterGoals = [
    {
      id: 1,
      title: 'Academic Goals',
      items: [
        'Maintain GPA above 3.5',
        'Complete all assignments on time',
        'Participate in class discussions'
      ]
    },
    {
      id: 2,
      title: 'Social Goals',
      items: [
        'Join at least 2 clubs',
        'Attend campus events',
        'Network with professors'
      ]
    },
    {
      id: 3,
      title: 'Personal Goals',
      items: [
        'Exercise 3 times a week',
        'Learn a new skill',
        'Maintain work-life balance'
      ]
    }
  ];

  const getEventIcon = (type) => {
    switch (type) {
      case 'academic':
        return <FaBook className="text-blue-500" />;
      case 'event':
        return <FaUsers className="text-green-500" />;
      default:
        return <FaCalendarAlt className="text-gray-500" />;
    }
  };

  return (
    <div className="semester-plan">
      <div className="container mx-auto px-4 py-8">
        {/* Semester Overview */}
        <div className="semester-overview mb-8">
          <h2 className="text-2xl font-bold mb-4">Fall Semester 2024</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Academic Calendar</h3>
              <ul className="space-y-4">
                {semesterEvents.map(event => (
                  <li key={event.id} className="flex items-start space-x-3">
                    {getEventIcon(event.type)}
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">{event.date}</p>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Semester Goals</h3>
              {semesterGoals.map(goal => (
                <div key={goal.id} className="mb-6">
                  <h4 className="font-medium mb-2">{goal.title}</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {goal.items.map((item, index) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Add New Event
                </button>
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  Update Goals
                </button>
                <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                  Export Calendar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Integration */}
        <div className="calendar-integration">
          <h2 className="text-2xl font-bold mb-4">Calendar Integration</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-4">
              Connect your school calendar to automatically sync important dates and events.
            </p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Connect Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterPlan; 