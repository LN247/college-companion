import React, { useState } from 'react';

export default function SemesterPlanner() {
  const [timetable, setTimetable] = useState({});
  const [goals, setGoals] = useState([]);
  const [semesterDates, setSemesterDates] = useState({ start: '', end: '' });
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ date: '', title: '', description: '' });
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleTimetableChange = (day, field, value) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const addGoal = (goal, method) => {
    setGoals((prev) => [...prev, { goal, method }]);
  };

  const handleTaskChange = (field, value) => {
    setNewTask((prev) => ({ ...prev, [field]: value }));
  };

  const addTask = () => {
    if (newTask.date && newTask.title) {
      setTasks((prev) => [...prev, newTask]);
      setNewTask({ date: '', title: '', description: '' });
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem', backgroundColor: '#06123d', color: '#ffffff' }}>
      <h1 style={{ color: '#f68712', textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem' }}>Semester Planner</h1>

      {/* Timetable Section */}
      <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Timetable</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {days.map((day) => (
            <div key={day} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '0.75rem' }}>
              <h3>{day}</h3>
              <input
                placeholder="Course"
                value={timetable[day]?.course || ''}
                onChange={(e) => handleTimetableChange(day, 'course', e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
              <input
                placeholder="Hall"
                value={timetable[day]?.hall || ''}
                onChange={(e) => handleTimetableChange(day, 'hall', e.target.value)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
              <input
                placeholder="Lecture Time"
                value={timetable[day]?.lecture || ''}
                onChange={(e) => handleTimetableChange(day, 'lecture', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Goal Setting Section */}
      <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Goal Setting</h2>
        <input
          placeholder="Enter your goal"
          onKeyDown={(e) => {
            if (e.key === 'Enter') addGoal(e.target.value, '');
          }}
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        {goals.map((g, i) => (
          <div key={i} style={{ backgroundColor: '#f0f0f0', padding: '0.75rem', marginBottom: '1rem', borderRadius: '0.5rem' }}>
            <p><strong>Goal:</strong> {g.goal}</p>
            <textarea
              placeholder="How will you achieve it?"
              value={g.method}
              onChange={(e) => {
                const updated = [...goals];
                updated[i].method = e.target.value;
                setGoals(updated);
              }}
              style={{ width: '100%' }}
            />
          </div>
        ))}
      </div>

      {/* Semester Calendar Section */}
      <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Semester Calendar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label>Start Date</label><br />
            <input
              type="date"
              value={semesterDates.start}
              onChange={(e) => setSemesterDates({ ...semesterDates, start: e.target.value })}
            />
          </div>
          <div>
            <label>End Date</label><br />
            <input
              type="date"
              value={semesterDates.end}
              onChange={(e) => setSemesterDates({ ...semesterDates, end: e.target.value })}
            />
          </div>
          <div>
            {semesterDates.start && semesterDates.end && (
              <p><strong>Semester Duration:</strong> {semesterDates.start} to {semesterDates.end}</p>
            )}
          </div>
        </div>

        {/* Calendar Task Planner */}
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>Plan Tasks & Assignments</h3>
          <input
            type="date"
            value={newTask.date}
            onChange={(e) => handleTaskChange('date', e.target.value)}
            style={{ marginBottom: '0.5rem', display: 'block', width: '100%' }}
          />
          <input
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => handleTaskChange('title', e.target.value)}
            style={{ marginBottom: '0.5rem', width: '100%' }}
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => handleTaskChange('description', e.target.value)}
            style={{ marginBottom: '0.5rem', width: '100%' }}
          />
          <button onClick={addTask} style={{ backgroundColor: '#f68712', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '0.5rem' }}>
            Add Task
          </button>

          <div style={{ marginTop: '1rem' }}>
            <label>Search Tasks:</label>
            <input
              type="text"
              placeholder="Search by title or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1rem' }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label>Sort Tasks:</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: '0.5rem' }}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {sortedTasks.map((task, index) => (
              <div key={index} style={{ backgroundColor: '#eee', color: '#000', padding: '0.75rem', marginBottom: '0.75rem', borderRadius: '0.5rem' }}>
                <p><strong>Date:</strong> {task.date}</p>
                <p><strong>Title:</strong> {task.title}</p>
                <p>{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
