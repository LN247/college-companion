import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import EventModal from "./EventModal";
import "../Styles/AcademicCalendar.css";

const localizer = momentLocalizer(moment);

const ScheduleCalendar = ({ events = [], onEventAdd }) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setShowEventModal(true);
  };

  const handleEventAdd = (eventData) => {
    const newEvent = { ...eventData, id: Date.now().toString() };
    onEventAdd(newEvent);
    setShowEventModal(false);
    setSelectedSlot(null);
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
    },
  });

  // Always validate the data
  const customEvents = Array.isArray(events)
    ? events.filter((e) => e.type === "custom")
    : [];

  return (
    <div className="calendar-container">
      <Card className="calendar-card">
        <div className="calendar-header">
          <div>
            <h3 className="calendar-title">
              <CalendarIcon className="calendar-icon" />
              Personal Events Calendar
            </h3>
            <p className="calendar-description">
              Add your personal events and appointments
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedSlot({ start: new Date(), end: new Date(Date.now() + 3600000) });
              setShowEventModal(true);
            }}
            className="calendar-add-btn"
          >
            <Plus className="icon" />
            Add Event
          </Button>
        </div>

        <div className="calendar-body">
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
            eventPropGetter={eventStyleGetter}
            className="custom-calendar"
            min={new Date(2024, 0, 1, 7, 0, 0)}
            max={new Date(2024, 0, 1, 22, 0, 0)}
            defaultDate={new Date()}
            step={30}
            timeslots={2}
          />
        </div>
      </Card>

      {showEventModal && selectedSlot && (
        <EventModal
          start={selectedSlot.start}
          end={selectedSlot.end}
          onSave={handleEventAdd}
          onClose={() => {
            setShowEventModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};

export default ScheduleCalendar;