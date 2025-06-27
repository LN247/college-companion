import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, BookOpen, GraduationCap, Bell } from "lucide-react";
import "../Styles/AcademicCalendar.css";

const AcademicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Fall Semester Begins",
      date: "2024-08-26",
      time: "09:00 AM",
      type: "semester",
      location: "Main Campus",
      description: "First day of Fall 2024 semester",
      color: "#f68712"
    },
    {
      id: 2,
      title: "Labor Day Holiday",
      date: "2024-09-02",
      time: "All Day",
      type: "holiday",
      location: "Campus Closed",
      description: "University closed for Labor Day",
      color: "#dc3545"
    },
    {
      id: 3,
      title: "Midterm Exams",
      date: "2024-10-15",
      time: "08:00 AM",
      type: "exam",
      location: "Various Classrooms",
      description: "Midterm examination period",
      color: "#007bff"
    },
    {
      id: 4,
      title: "Thanksgiving Break",
      date: "2024-11-25",
      time: "All Day",
      type: "holiday",
      location: "Campus Closed",
      description: "Thanksgiving holiday break",
      color: "#dc3545"
    },
    {
      id: 5,
      title: "Final Exams",
      date: "2024-12-16",
      time: "08:00 AM",
      type: "exam",
      location: "Various Classrooms",
      description: "Final examination period",
      color: "#007bff"
    },
    {
      id: 6,
      title: "Winter Break Begins",
      date: "2024-12-20",
      time: "05:00 PM",
      type: "semester",
      location: "Campus",
      description: "End of Fall semester",
      color: "#28a745"
    }
  ]);

  const [filter, setFilter] = useState("all");

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getFilteredEvents = () => {
    if (filter === "all") return events;
    return events.filter(event => event.type === filter);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'semester': return <GraduationCap />;
      case 'exam': return <BookOpen />;
      case 'holiday': return <Calendar />;
      default: return <Bell />;
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="academic-calendar">
      <div className="calendar-container">
        {/* Header */}
        <div className="calendar-header">
          <h1 className="calendar-title">Academic Calendar</h1>
          <p className="calendar-subtitle">
            Stay organized with important academic dates and events
          </p>
        </div>

        {/* Filter Controls */}
        <div className="calendar-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
          <button 
            className={`filter-btn ${filter === 'semester' ? 'active' : ''}`}
            onClick={() => setFilter('semester')}
          >
            <GraduationCap />
            Semester
          </button>
          <button 
            className={`filter-btn ${filter === 'exam' ? 'active' : ''}`}
            onClick={() => setFilter('exam')}
          >
            <BookOpen />
            Exams
          </button>
          <button 
            className={`filter-btn ${filter === 'holiday' ? 'active' : ''}`}
            onClick={() => setFilter('holiday')}
          >
            <Calendar />
            Holidays
          </button>
        </div>

        <div className="calendar-content">
          {/* Calendar Grid */}
          <div className="calendar-grid">
            <div className="calendar-nav">
              <button 
                className="nav-btn"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              >
                ←
              </button>
              <h2 className="current-month">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button 
                className="nav-btn"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              >
                →
              </button>
            </div>

            <div className="calendar-days">
              {dayNames.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
              
              {getDaysInMonth(currentDate).map((date, index) => {
                const dayEvents = getEventsForDate(date);
                const isSelected = selectedDate && date && 
                  date.toDateString() === selectedDate.toDateString();
                const isToday = date && date.toDateString() === new Date().toDateString();
                
                return (
                  <div 
                    key={index} 
                    className={`calendar-day ${!date ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <span className="day-number">{date.getDate()}</span>
                        {dayEvents.length > 0 && (
                          <div className="day-events">
                            {dayEvents.slice(0, 2).map(event => (
                              <div 
                                key={event.id} 
                                className="event-dot"
                                style={{ backgroundColor: event.color }}
                                title={event.title}
                              />
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="more-events">+{dayEvents.length - 2}</div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Events Panel */}
          <div className="events-panel">
            <div className="events-header">
              <h3 className="events-title">
                {selectedDate ? `Events for ${formatDate(selectedDate)}` : 'Upcoming Events'}
              </h3>
            </div>
            
            <div className="events-list">
              {selectedDate ? (
                getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="event-card" style={{ borderLeftColor: event.color }}>
                      <div className="event-icon" style={{ color: event.color }}>
                        {getEventIcon(event.type)}
                      </div>
                      <div className="event-content">
                        <h4 className="event-title">{event.title}</h4>
                        <div className="event-details">
                          <div className="event-time">
                            <Clock />
                            {event.time}
                          </div>
                          <div className="event-location">
                            <MapPin />
                            {event.location}
                          </div>
                        </div>
                        <p className="event-description">{event.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-events">
                    <Calendar />
                    <p>No events scheduled for this date</p>
                  </div>
                )
              ) : (
                getFilteredEvents().slice(0, 5).map(event => (
                  <div key={event.id} className="event-card" style={{ borderLeftColor: event.color }}>
                    <div className="event-icon" style={{ color: event.color }}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="event-content">
                      <h4 className="event-title">{event.title}</h4>
                      <div className="event-details">
                        <div className="event-date">
                          <Calendar />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="event-time">
                          <Clock />
                          {event.time}
                        </div>
                      </div>
                      <p className="event-description">{event.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
