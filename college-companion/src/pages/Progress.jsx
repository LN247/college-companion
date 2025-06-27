import React, { useState } from 'react';
import { FaCheckCircle, FaCircle, FaExclamationCircle } from 'react-icons/fa';
import '../Styles/Progress.css';

const Progress = () => {
  // Mock data - replace with actual API data
  const [progressData] = useState({
    overallProgress: 65,
    courses: [
      {
        id: 1,
        name: 'Computer Science 101',
        progress: 75,
        assignments: [
          { id: 1, title: 'Programming Assignment 1', status: 'completed' },
          { id: 2, title: 'Midterm Project', status: 'completed' },
          { id: 3, title: 'Final Project', status: 'pending' }
        ]
      },
      {
        id: 2,
        name: 'Mathematics 201',
        progress: 60,
        assignments: [
          { id: 1, title: 'Calculus Quiz 1', status: 'completed' },
          { id: 2, title: 'Linear Algebra Assignment', status: 'in-progress' },
          { id: 3, title: 'Final Exam', status: 'pending' }
        ]
      }
    ],
    goals: [
      { id: 1, title: 'Join Study Group', status: 'completed' },
      { id: 2, title: 'Attend Office Hours', status: 'in-progress' },
      { id: 3, title: 'Complete Research Paper', status: 'pending' }
    ]
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'in-progress':
        return <FaExclamationCircle className="text-yellow-500" />;
      case 'pending':
        return <FaCircle className="text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="progress-page">
      <div className="container mx-auto px-4 py-8">
        {/* Overall Progress */}
        <div className="overall-progress mb-8">
          <h2 className="text-2xl font-bold mb-4">Overall Progress</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Semester Progress</span>
              <span className="text-2xl font-bold text-blue-500">{progressData.overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressData.overallProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="course-progress mb-8">
          <h2 className="text-2xl font-bold mb-4">Course Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {progressData.courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">{course.name}</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {course.assignments.map(assignment => (
                    <div key={assignment.id} className="flex items-center space-x-3">
                      {getStatusIcon(assignment.status)}
                      <span className="text-sm">{assignment.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="goals-progress">
          <h2 className="text-2xl font-bold mb-4">Goals Progress</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {progressData.goals.map(goal => (
                <div key={goal.id} className="flex items-center space-x-3">
                  {getStatusIcon(goal.status)}
                  <span>{goal.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress; 