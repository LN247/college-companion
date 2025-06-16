import React, { useState, useMemo } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Styles/AcademicCalendar.css';
import EventForm from '../components/EventForm';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'CS101 - Midterm Exam',
      start: new Date(2024, 5, 20, 9, 0),
      end: new Date(2024, 5, 20, 11, 0),
      type: 'exam',
      location: 'Room 101',
      description: 'Introduction to Programming midterm examination'
    },
    // ... other sample events
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);

  const eventStyleGetter = (event) => {
    return { className: `rbc-event rbc-event-${event.type}` };
  };

  const dayPropGetter = (date) => {
    const hasEvents = events.some(event =>
      moment(event.start).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
    );

    return { className: hasEvents ? 'rbc-day-has-events' : '' };
  };

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    return events
      .filter(event => event.start >= now && event.start <= weekFromNow)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 5);
  }, [events]);

  const getEventTypeColor = (type) => {
    const colors = {
      exam: 'badge-exam',
      presentation: 'badge-presentation',
      study: 'badge-study',
      deadline: 'badge-deadline',
      event: 'badge-event'
    };
    return colors[type] || 'badge-default';
  };

  const formatEventTime = (date) => {
    return moment(date).format('MMM DD, YYYY h:mm A');
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleAddEvent = (formData) => {
    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const [endHour, endMinute] = formData.endTime.split(':').map(Number);
    const eventDate = new Date(formData.date);

    const newEvent = {
      id: events.length + 1,
      title: formData.title,
      start: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), startHour, startMinute),
      end: new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), endHour, endMinute),
      type: formData.type,
      location: formData.location || undefined,
      description: formData.description || undefined
    };

    setEvents([...events, newEvent]);
    setShowEventForm(false);
  };

  return (
    <div className="calendar-container">
      <div className="navigation">{/* Navigation component */}</div>
      <div className="calendar-content">
        <div className="calendar-header">
          <div>
            <h1 className="calendar-title">
              <CalendarIcon className="calendar-icon" />
              Academic Calendar
            </h1>
            <p className="calendar-subtitle">
              Manage your academic schedule and upcoming events
            </p>
          </div>
          <button
            className="add-event-btn"
            onClick={() => setShowEventForm(true)}
          >
            <Plus className="plus-icon" />
            Add Event
          </button>
        </div>

        <div className="calendar-grid">
          <div className="main-calendar">
            <div className="calendar-card">
              <div className="calendar-wrapper">
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  dayPropGetter={dayPropGetter}
                  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                  defaultView={Views.MONTH}
                  popup
                  components={{
                    toolbar: (props) => (
                      <div className="calendar-toolbar">
                        <div className="toolbar-nav">
                          <button onClick={() => props.onNavigate('PREV')}>
                            &#8249;
                          </button>
                          <button onClick={() => props.onNavigate('TODAY')}>
                            Today
                          </button>
                          <button onClick={() => props.onNavigate('NEXT')}>
                            &#8250;
                          </button>
                        </div>
                        <h2 className="toolbar-title">
                          {props.label}
                        </h2>
                        <div className="toolbar-views">
                          {props.views.map((view) => (
                            <button
                              key={view}
                              onClick={() => props.onView(view)}
                              className={props.view === view ? 'active-view' : ''}
                            >
                              {view}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  }}
                />
              </div>
            </div>
          </div>

          <div className="calendar-sidebar">
            <div className="sidebar-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Clock className="card-icon" />
                  Upcoming Events
                </h3>
                <p className="card-subtitle">Next 7 days</p>
              </div>
              <div className="card-content">
                {upcomingEvents.length === 0 ? (
                  <p className="no-events">No upcoming events</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="event-card"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="event-header">
                        <h4 className="event-title">{event.title}</h4>
                        <span className={`event-badge ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                      <div className="event-details">
                        <div className="event-time">
                          <Clock className="detail-icon" />
                          {moment(event.start).format('MMM DD, h:mm A')}
                        </div>
                        {event.location && (
                          <div className="event-location">
                            <MapPin className="detail-icon" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedEvent && (
              <div className="sidebar-card">
                <div className="card-header">
                  <h3 className="card-title">
                    Event Details
                    <span className={`event-badge ${getEventTypeColor(selectedEvent.type)}`}>
                      {selectedEvent.type}
                    </span>
                  </h3>
                </div>
                <div className="card-content">
                  <div className="event-detail">
                    <h4 className="detail-title">{selectedEvent.title}</h4>
                    <p className="detail-description">{selectedEvent.description}</p>
                  </div>

                  <div className="event-meta">
                    <div className="meta-item">
                      <Clock className="meta-icon" />
                      <div>
                        <div className="meta-label">Start:</div>
                        <div className="meta-value">
                          {formatEventTime(selectedEvent.start)}
                        </div>
                      </div>
                    </div>

                    <div className="meta-item">
                      <Clock className="meta-icon" />
                      <div>
                        <div className="meta-label">End:</div>
                        <div className="meta-value">
                          {formatEventTime(selectedEvent.end)}
                        </div>
                      </div>
                    </div>

                    {selectedEvent.location && (
                      <div className="meta-item">
                        <MapPin className="meta-icon" />
                        <div>
                          <div className="meta-label">Location:</div>
                          <div className="meta-value">
                            {selectedEvent.location}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="event-actions">
                    <button className="edit-btn">
                      Edit Event
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="sidebar-card">
              <div className="card-header">
                <h3 className="card-title">
                  <Users className="card-icon stats-icon" />
                  Quick Stats
                </h3>
              </div>
              <div className="stats-content">
                <div className="stat-item">
                  <span>Total Events</span>
                  <span className="stat-value">{events.length}</span>
                </div>
                <div className="stat-item">
                  <span>This Week</span>
                  <span className="stat-value">{upcomingEvents.length}</span>
                </div>
                <div className="stat-item">
                  <span>Exams</span>
                  <span className="stat-value">
                    {events.filter(e => e.type === 'exam').length}
                  </span>
                </div>
                <div className="stat-item">
                  <span>Deadlines</span>
                  <span className="stat-value">
                    {events.filter(e => e.type === 'deadline').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEventForm && (
        <div className="event-dialog">
          <div className="dialog-content">
            <EventForm
              onSubmit={handleAddEvent}
              onCancel={() => setShowEventForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;