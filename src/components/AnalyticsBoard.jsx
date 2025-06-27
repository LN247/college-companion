import React from 'react';
import '../Styles/AdminDashboard.css';

const fakeAnalytics = {
  users: 128,
  courses: 24,
  semesters: [
    { name: 'Fall 2024', users: 45 },
    { name: 'Spring 2024', users: 38 },
    { name: 'Summer 2024', users: 22 },
  ],
};

const AnalyticsBoard = () => (
  <div className="admin-dashboard__analytics-board" style={{ marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
    <div className="admin-dashboard__analytics-card" style={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', color: '#fff', borderRadius: '1rem', padding: '1.5rem 2rem', minWidth: '200px', boxShadow: '0 2px 8px rgba(102, 126, 234, 0.10)' }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{fakeAnalytics.users}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total Users</div>
    </div>
    <div className="admin-dashboard__analytics-card" style={{ background: 'linear-gradient(90deg, #10b981 0%, #22d3ee 100%)', color: '#fff', borderRadius: '1rem', padding: '1.5rem 2rem', minWidth: '200px', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.10)' }}>
      <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{fakeAnalytics.courses}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total Courses</div>
    </div>
    <div className="admin-dashboard__analytics-card" style={{ background: '#fff', color: '#3730a3', borderRadius: '1rem', padding: '1.5rem 2rem', minWidth: '260px', boxShadow: '0 2px 8px rgba(102, 126, 234, 0.10)' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Users per Semester</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {fakeAnalytics.semesters.map((sem) => (
          <li key={sem.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '0.3rem' }}>
            <span>{sem.name}</span>
            <span style={{ fontWeight: 700 }}>{sem.users}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default AnalyticsBoard; 