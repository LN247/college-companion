import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addHours } from 'date-fns';
import GoogleCalendarIntegration from '../components/GoogleCalendarIntegration';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function SemesterPlanner() {
  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('semesterTimetable');
    return saved ? JSON.parse(saved) : {};
  });
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('semesterGoals');
    return saved ? JSON.parse(saved) : [];
  });
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('assignments');
    return saved ? JSON.parse(saved) : [];
  });
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : [];
  });
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });

  const [goalInput, setGoalInput] = useState('');
  const [goalPlan, setGoalPlan] = useState('');
  const [semesterStart, setSemesterStart] = useState('');
  const [semesterEnd, setSemesterEnd] = useState('');
  const [assignmentInput, setAssignmentInput] = useState('');
  const [assignmentDue, setAssignmentDue] = useState('');
  const [assignmentCourse, setAssignmentCourse] = useState('');
  const [assignmentPriority, setAssignmentPriority] = useState('medium');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [courseInput, setCourseInput] = useState('');
  const [creditHours, setCreditHours] = useState('');
  const [studyHours, setStudyHours] = useState('');
  const [courseColor, setCourseColor] = useState('#f68712');

  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('calendarEvents');
    return saved ? JSON.parse(saved).map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    })) : [];
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: addHours(new Date(), 1),
    description: '',
    type: 'class', // class, assignment, study, other
    course: '',
    location: ''
  });

  const [googleEvents, setGoogleEvents] = useState([]);

  // Update calendarEvents to include Google Calendar events
  const allEvents = [...calendarEvents, ...googleEvents];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  useEffect(() => {
    localStorage.setItem('semesterTimetable', JSON.stringify(timetable));
    localStorage.setItem('semesterGoals', JSON.stringify(goals));
    localStorage.setItem('assignments', JSON.stringify(assignments));
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
  }, [timetable, goals, assignments, courses, events, calendarEvents]);

  const handleTimetableChange = (day, field, value) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleAddGoal = () => {
    if (goalInput && goalPlan) {
      setGoals([...goals, { goal: goalInput, plan: goalPlan, completed: false, stepsCompleted: false }]);
      setGoalInput('');
      setGoalPlan('');
    }
  };

  const toggleGoalCompleted = (index, field) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = !updatedGoals[index][field];
    setGoals(updatedGoals);
  };

  const handleSaveTimetable = () => {
    localStorage.setItem('semesterTimetable', JSON.stringify(timetable));
    alert('Timetable saved!');
  };

  const handleAddCourse = () => {
    if (courseInput && creditHours) {
      const recommendedStudyHours = parseInt(creditHours) * 2; // 2 hours of study per credit hour
      const newCourse = {
        name: courseInput,
        creditHours: parseInt(creditHours),
        recommendedStudyHours,
        actualStudyHours: parseInt(studyHours) || 0,
        color: courseColor,
        assignments: [],
        progress: 0
      };
      setCourses([...courses, newCourse]);
      setCourseInput('');
      setCreditHours('');
      setStudyHours('');
    }
  };

  const handleAddAssignment = () => {
    if (assignmentInput && assignmentDue && assignmentCourse) {
      const newAssignment = {
        name: assignmentInput,
        due: assignmentDue,
        course: assignmentCourse,
        priority: assignmentPriority,
        completed: false,
        progress: 0
      };
      setAssignments([...assignments, newAssignment]);
      
      // Update course assignments
      const updatedCourses = courses.map(course => {
        if (course.name === assignmentCourse) {
          return {
            ...course,
            assignments: [...course.assignments, newAssignment]
          };
        }
        return course;
      });
      setCourses(updatedCourses);

      setAssignmentInput('');
      setAssignmentDue('');
      setAssignmentPriority('medium');
    }
  };

  const updateAssignmentProgress = (index, progress) => {
    const updatedAssignments = assignments.map((assignment, i) => {
      if (i === index) {
        return { ...assignment, progress: parseInt(progress) };
      }
      return assignment;
    });
    setAssignments(updatedAssignments);

    // Update course progress
    const updatedCourses = courses.map(course => {
      const courseAssignments = updatedAssignments.filter(a => a.course === course.name);
      const totalProgress = courseAssignments.reduce((sum, a) => sum + a.progress, 0);
      const averageProgress = courseAssignments.length ? totalProgress / courseAssignments.length : 0;
      return {
        ...course,
        progress: averageProgress
      };
    });
    setCourses(updatedCourses);
  };

  const updateStudyHours = (courseName, hours) => {
    const updatedCourses = courses.map(course => {
      if (course.name === courseName) {
        return {
          ...course,
          actualStudyHours: parseInt(hours)
        };
      }
      return course;
    });
    setCourses(updatedCourses);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const calculateWorkload = (course) => {
    const assignmentCount = course.assignments.length;
    const upcomingAssignments = course.assignments.filter(a => 
      new Date(a.due) > new Date() && new Date(a.due) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length;
    const studyHourDeficit = course.recommendedStudyHours - course.actualStudyHours;

    if (upcomingAssignments >= 2 || studyHourDeficit > 5) return 'High';
    if (upcomingAssignments === 1 || studyHourDeficit > 0) return 'Medium';
    return 'Low';
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({
      title: '',
      start,
      end,
      description: '',
      type: 'class',
      course: '',
      location: ''
    });
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent(event);
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setCalendarEvents(calendarEvents.map(event =>
        event === selectedEvent ? newEvent : event
      ));
    } else {
      // Add new event
      setCalendarEvents([...calendarEvents, newEvent]);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: new Date(),
      end: addHours(new Date(), 1),
      description: '',
      type: 'class',
      course: '',
      location: ''
    });
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setCalendarEvents(calendarEvents.filter(event => event !== selectedEvent));
    }
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleGoogleEventsLoaded = (events) => {
    setGoogleEvents(events);
  };

  const eventStyleGetter = (event) => {
    if (event.source === 'google') {
      return {
        style: {
          backgroundColor: '#4285f4',
          borderRadius: '4px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block'
        }
      };
    }

    let backgroundColor = '#f68712';
    switch (event.type) {
      case 'class':
        backgroundColor = '#06123D';
        break;
      case 'assignment':
        backgroundColor = '#F68712';
        break;
      case 'study':
        backgroundColor = '#4285f4';
        break;
      case 'exam':
        backgroundColor = '#ea4335';
        break;
      default:
        backgroundColor = '#f68712';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div style={{ minHeight: '100vh', padding: '0', backgroundColor: '#06123D', color: '#FFFFFF' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          color: '#000000', 
          padding: '1rem', 
          borderRadius: '12px', 
          marginBottom: '0',
          minHeight: 'calc(100vh - 2rem)'
        }}>
          <div style={{ height: 'calc(100vh - 4rem)' }}>
            <GoogleCalendarIntegration onEventsLoaded={handleGoogleEventsLoaded} />
            <Calendar
              localizer={localizer}
              events={allEvents}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day', 'agenda']}
              defaultView='month'
              step={60}
              showMultiDayTimes
              style={{ height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SemesterPlanner; 