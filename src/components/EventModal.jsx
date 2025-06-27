import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/Textarea';
import { Calendar, Save, X } from 'lucide-react';
import '../Styles/EventModal.css';

const EVENT_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
];

const EventModal = ({ start, end, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8b5cf6');
  const [startTime, setStartTime] = useState(start.toTimeString().slice(0, 5));
  const [endTime, setEndTime] = useState(end.toTimeString().slice(0, 5));

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter an event title');
      return;
    }

    const eventStart = new Date(start);
    const eventEnd = new Date(end);

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    eventStart.setHours(startHours, startMinutes);
    eventEnd.setHours(endHours, endMinutes);

    onSave({
      title: title.trim(),
      description: description.trim(),
      start: eventStart,
      end: eventEnd,
      type: 'custom',
      color,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="event-modal__container">
        <DialogHeader>
          <DialogTitle className="event-modal__title">
            <Calendar className="event-modal__icon" />
            Add Custom Event
          </DialogTitle>
        </DialogHeader>

        <div className="event-modal__form-container">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="event-modal__input-field"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event description"
              className="event-modal__textarea-field"
            />
          </div>

          <div className="event-modal__time-grid">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="event-modal__input-field"
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="event-modal__input-field"
              />
            </div>
          </div>

          <div>
            <Label>Event Color</Label>
            <div className="event-modal__color-grid">
              {EVENT_COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  onClick={() => setColor(colorOption.value)}
                  className={`event-modal__color-btn${color === colorOption.value ? ' event-modal__color-btn--selected' : ''}`}
                  style={{ backgroundColor: colorOption.value }}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="event-modal__button-container">
          <Button onClick={onClose} variant="outline" className="event-modal__cancel-btn">
            <X className="event-modal__icon" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="event-modal__save-btn">
            <Save className="event-modal__icon" />
            Save Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
