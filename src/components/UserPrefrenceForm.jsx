import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Settings, Clock, Bell, Calendar, BookOpen } from 'lucide-react';
import '../Styles/UserPrefrenceForm.css';
import {getCookie} from "../utils/getcookies";
import {API_BASE} from "../consatants/Constants";
import axios from "axios";

const PreferencesForm = ({  semester, level, onFormComplete, onBack }) => {
  const [studyStartTime, setStudyStartTime] = useState('');
  const [studyEndTime, setStudyEndTime] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [notifications, setNotifications] = useState(true);
  const [offDays, setOffDays] = useState([]);
  const [studyHoursPerDay, setStudyHoursPerDay] = useState(2);
  const  csrfToken = getCookie("csrftoken");

  const daysOfWeek = [
    { id: 'monday', label: 'Monday', short: 'Mon' },
    { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { id: 'thursday', label: 'Thursday', short: 'Thu' },
    { id: 'friday', label: 'Friday', short: 'Fri' },
    { id: 'saturday', label: 'Saturday', short: 'Sat' },
    { id: 'sunday', label: 'Sunday', short: 'Sun' }
  ];

  const handleOffDayToggle = (dayId) => {
    setOffDays(prev => {
      if (prev.includes(dayId)) {
        return prev.filter(day => day !== dayId);
      } else {
        return [...prev, dayId];
      }
    });
  };

   const generateSchedule = async (semester) => {
    try {
      await axios.post(`${API_BASE}/generate-timetable/`,
       {
        semester: parseInt(semester.semesterId, 10),
       },
       {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
            }
      });

    }
    catch (error) {
      console.error("Error generating schedule:", error);
    }
  }

  const validateInputs = () => {
    if (!studyStartTime || !studyEndTime) {
      alert('Please select both start and end time for your study sessions');
      return false;
    }

    if (studyStartTime >= studyEndTime) {
      alert('End time must be after start time');
      return false;
    }

    // Calculate available time window
    const startTime = new Date(`1970-01-01T${studyStartTime}:00`);
    const endTime = new Date(`1970-01-01T${studyEndTime}:00`);
    const availableHours = (endTime - startTime) / (1000 * 60 * 60);

    if (studyHoursPerDay > availableHours) {
      alert(`Study hours per day (${studyHoursPerDay}h) cannot exceed your available time window (${availableHours}h)`);
      return false;
    }

    // Check if user selected all days as off days
    if (offDays.length === 7) {
      alert('You cannot select all days as off days. Please select at least one study day.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      return;
    }

    const studyDays = daysOfWeek
      .filter(day => !offDays.includes(day.id))
      .map(day => day.id);

    try {
      const response = await axios.post(`${API_BASE}/preferences/`,
          [{
        preferred_study_hours_per_day: studyHoursPerDay,
        off_days: offDays,
        study_start_min: `${studyStartTime}`,
        study_end_max: `${studyEndTime}`,
        notification_reminder_minutes: reminderMinutes,
        semester: parseInt(semester.semesterId, 10),
      }],
      {
            withCredentials: true,
            headers: {
              "X-CSRFToken": csrfToken,
            }
      });
       await generateSchedule(semester);

    } catch (error) {
      alert('Failed to generate timetable. Please try again later.');
    }
  };



  return (
    <div className="preferences-form">
      <div className="form-header">
        <Settings className="header-icon" />
        <h2>Set Your Study Preferences</h2>
        <p>Configure your preferred study schedule settings</p>
      </div>

      <div className="preferences-container">
        <div className="preference-section study-time-section">
          <div className="section-header">
            <Clock className="section-icon" />
            <Label className="section-title">Preferred Study Time Range</Label>
          </div>
          <div className="time-range-grid">
            <div className="time-input-group">
              <Label htmlFor="study-start">Study Start Time</Label>
              <Input
                id="study-start"
                type="time"
                value={studyStartTime}
                onChange={(e) => setStudyStartTime(e.target.value)}
              />
            </div>
            <div className="time-input-group">
              <Label htmlFor="study-end">Study End Time</Label>
              <Input
                id="study-end"
                type="time"
                value={studyEndTime}
                onChange={(e) => setStudyEndTime(e.target.value)}
              />
            </div>
          </div>
          <p className="section-description">
            Set your preferred time range for study sessions. We'll schedule study blocks within this range.
          </p>
        </div>

        <div className="preference-section study-hours-section">
          <div className="section-header">
            <BookOpen className="section-icon" />
            <Label className="section-title">Daily Study Hours</Label>
          </div>
          <div className="study-hours-group">
            <Label htmlFor="study-hours">Preferred study hours per day</Label>
            <Select
              value={studyHoursPerDay.toString()}
              onValueChange={(value) => setStudyHoursPerDay(parseFloat(value))}
            >
              <SelectTrigger className="study-hours-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">30 minutes</SelectItem>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="1.5">1.5 hours</SelectItem>
                <SelectItem value="2">2 hours</SelectItem>
                <SelectItem value="2.5">2.5 hours</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="3.5">3.5 hours</SelectItem>
                <SelectItem value="4">4 hours</SelectItem>
                <SelectItem value="4.5">4.5 hours</SelectItem>
                <SelectItem value="5">5 hours</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="7">7 hours</SelectItem>
                <SelectItem value="8">8 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="section-description">
            Choose how many hours you want to study per day. This will be distributed across your available time slots.
          </p>
        </div>

        <div className="preference-section off-days-section">
          <div className="section-header">
            <Calendar className="section-icon" />
            <Label className="section-title">Off Days</Label>
          </div>
          <div className="off-days-grid">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="day-toggle">
                <label className={`day-checkbox ${offDays.includes(day.id) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={offDays.includes(day.id)}
                    onChange={() => handleOffDayToggle(day.id)}
                    className="hidden-checkbox"
                  />
                  <div className="day-content">
                    <span className="day-short">{day.short}</span>
                    <span className="day-full">{day.label}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
          <p className="section-description">
            Select the days you don't want to study. We'll avoid scheduling study sessions on these days.
            {offDays.length > 0 && (
              <span className="selected-off-days">
                {' '}Selected off days: {offDays.map(dayId =>
                  daysOfWeek.find(day => day.id === dayId)?.label
                ).join(', ')}
              </span>
            )}
          </p>
        </div>

        <div className="preference-section reminder-section">
          <div className="section-header">
            <Bell className="section-icon" />
            <Label className="section-title">Reminder Settings</Label>
          </div>
          <div className="reminder-settings">
            <div className="reminder-group">
              <Label htmlFor="reminder">Remind me before events (minutes)</Label>
              <Select
                value={reminderMinutes.toString()}
                onValueChange={(value) => setReminderMinutes(parseInt(value))}
              >
                <SelectTrigger className="reminder-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="notification-group">
              <div className="notification-text">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p>Get notified about upcoming classes and study sessions</p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button
          onClick={generateSchedule(semester)}
          className="submit-button"
        >
          Generate Timetable
        </Button>
      </div>
    </div>
  );
};

export default PreferencesForm;