import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CalendarIcon, Clock, MapPin, Tag } from 'lucide-react';
import '../Styles/EventForm.css';

const EventForm = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Card className="event-form-container">
      <CardHeader className="event-form-header">
        <CardTitle className="event-form-title">
          <CalendarIcon className="icon" />
          Add New Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(() => onSubmit(formData))} className="form-content">
          <div className="form-group">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} {...register('title', { required: 'Title is required' })} placeholder="Enter event title" />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          <div className="form-group">
            <Label htmlFor="type">Event Type</Label>
            <Select onValueChange={(value) => setValue('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="study">Study Session</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="form-group">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} {...register('date', { required: 'Date is required' })} />
            {errors.date && <p className="error-text">{errors.date.message}</p>}
          </div>

          <div className="form-buttons">
            <Button type="submit">Add Event</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
