import React, { useState, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Plus, Calendar as CalendarIcon, Trash2, Edit } from "lucide-react";
import EventModal from "./EventModal";
import "../Styles/AcademicCalendar.css";
import userContext from "../context/UserContext.jsx";
import {API_BASE} from "../consatants/Constants";
import axios from "axios";

const localizer = momentLocalizer(moment);

// Create Axios instance with credentials
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

const ScheduleCalendar = ({ events = [], onEventAdd, onEventUpdate, onEventDelete }) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useContext(userContext);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setSelectedEvent(null);
    setIsEditing(false);
    setShowEventModal(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (isEditing && selectedEvent) {
        // Update existing event
        const response = await api.put(`/events/${selectedEvent.id}/`, eventData, {
          headers: {'Content-Type': 'application/json'}
        });

        const updatedEvent = { ...response.data, type: "custom" };
        onEventUpdate(updatedEvent);
      } else {
        // Create new event
        const response = await api.post('/events/', eventData, {
          headers: {'Content-Type': 'application/json'}
        });

        const newEvent = { ...response.data, type: "custom" };
        onEventAdd(newEvent);
      }

      setShowEventModal(false);
      setSelectedSlot(null);
      setSelectedEvent(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving event:', error.response?.data || error.message);
      alert('Failed to save event');
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      await api.delete(`/events/${selectedEvent.id}/`);
      onEventDelete(selectedEvent.id);
      setShowDeleteModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error.response?.data || error.message);
      alert('Failed to delete event');
    }
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: "8px",
      opacity: 0.9,
      border: "none",
      color: "white",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
    },
  });

  // Filter custom events
  const customEvents = Array.isArray(events)
    ? events.filter((e) => e.type === "custom")
    : [];

  return (
    <div className="calendar__container">
      <Card className="calendar__card">
        <div className="calendar__header">
          <div>
            <h3 className="calendar__title">
              <CalendarIcon className="calendar__icon" />
              Personal Events Calendar
            </h3>
            <p className="calendar__description">
              Add and manage your personal events and appointments
            </p>
          </div>
          <Button
            onClick={() => {
              const now = new Date();
              setSelectedSlot({
                start: now,
                end: new Date(now.getTime() + 3600000)
              });
              setSelectedEvent(null);
              setIsEditing(false);
              setShowEventModal(true);
            }}
            className="calendar__add-btn"
          >
            <Plus className="calendar__plus-icon" />
            Add Event
          </Button>
        </div>

        <div className="calendar__body">
          <Calendar
            localizer={localizer}
            events={customEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            view="week"
            views={["week", "day"]}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            className="calendar__custom-calendar"
            min={new Date(2024, 0, 1, 7, 0, 0)}
            max={new Date(2024, 0, 1, 22, 0, 0)}
            defaultDate={new Date()}
            step={30}
            timeslots={2}
          />
        </div>
      </Card>

      {/* Event Modal (Add/Edit) */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          isEditing={isEditing}
          event={selectedEvent}
          start={selectedSlot?.start || selectedEvent?.start}
          end={selectedSlot?.end || selectedEvent?.end}
          onSave={handleSaveEvent}
          onDelete={() => {
            setShowEventModal(false);
            setShowDeleteModal(true);
          }}
          onClose={() => {
            setShowEventModal(false);
            setSelectedSlot(null);
            setSelectedEvent(null);
            setIsEditing(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="modal-backdrop">
          <div className="delete-modal">
            <h3>Delete Event</h3>
            <p>
              Are you sure you want to delete the event:
              <strong> "{selectedEvent.title}"</strong>?
            </p>
            <div className="modal-actions">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteEvent}
              >
                <Trash2 size={16} /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;