# utils/scheduler.py
from datetime import datetime, timedelta, time, date
from .models import UserPreferences, Course, StudyBlock,FixedClassSchedule
from .models import CustomUser
import json


def generate_timetable(user, courses, start_date, end_date):
    # Get user preferences
    prefs = UserPreferences.objects.get(user=user)
    off_days = [day.lower() for day in UserPreferences.get_off_days_list(prefs.off_days)]

    # Get fixed class hours
    fixed_hours = user.FixedClassSchedule.values_list('day', 'start_time', 'end_time')
    fixed_hours = [{'day': day, 'start': start, 'end': end} for day, start, end in fixed_hours]
    
    # Calculate total study minutes per course
    difficulty_weights = {'low': 1, 'medium': 2, 'high': 3, 'very_high': 4}
    course_study_minutes = {}
    
    for course in courses:
        base_minutes = course.credits * 60  # 1 hour per credit
        course_study_minutes[course.id] = base_minutes * difficulty_weights[course.difficulty] * course.priority
    
    # Generate available time slots
    available_slots = []
    current_date = start_date
    
    while current_date <= end_date:
        day_name = current_date.strftime('%A').lower()
        
        if day_name not in off_days:
            # Get fixed hours for this day
            day_hours = next((h for h in fixed_hours if h['day'].lower() == day_name), None)
            
            if day_hours:
                start = datetime.strptime(day_hours['start'], '%H:%M').time()
                end = datetime.strptime(day_hours['end'], '%H:%M').time()
                available_slots.append({
                    'date': current_date,
                    'start': start,
                    'end': end,
                    'duration': (datetime.combine(date.today(), end) - datetime.combine(date.today(), start)).seconds // 60
                })
        current_date += timedelta(days=1)
    
    

    # Sort courses by priority (highest first)
    sorted_courses = sorted(courses, key=lambda c: c.priority, reverse=True)
    
    #python dictionary which stores the total number of  minutes allocated  per day

    daily_allocated = {}

    # Assign study blocks
    study_blocks = []
    for course in sorted_courses:
        remaining_minutes = course_study_minutes[course.id]

        while remaining_minutes > 0 and available_slots:
            # Select the available slot with the longest duration
            slot = max(available_slots, key=lambda s: s['duration'])
            slot_date = slot['date']

            # Determine how many minutes have already been scheduled for this day
            allocated_today = daily_allocated.get(slot_date, 0)
            # Calculate remaining allowed minutes for this day
        allowed_today = 240 - allocated_today
        
        if allowed_today <= 0:
            # If the day has hit the maximum, remove the slot and continue
            available_slots.remove(slot)
            continue
        
        # Determine study duration: up to 60 minutes or less if not enough time remains
        study_duration = min(remaining_minutes, 60, slot['duration'], allowed_today)

        # Create the study block
        study_blocks.append({
            'course': course,
            'date': slot_date,
            'start_time': slot['start'],
            'end_time': (datetime.combine(slot_date, slot['start']) + timedelta(minutes=study_duration)).time()
        })
        
        # Update the available slot and remaining study minutes for the course
        slot['start'] = (datetime.combine(slot_date, slot['start']) + timedelta(minutes=study_duration)).time()
        slot['duration'] -= study_duration
        remaining_minutes -= study_duration
        
        # Track the total amount allocated for that day
        daily_allocated[slot_date] = allocated_today + study_duration
        
        # Remove the slot if it's been fully used
        if slot['duration'] <= 0:
            available_slots.remove(slot)
    
    return study_blocks


def has_conflict(new_block, existing_blocks):
    for block in existing_blocks:
        if (new_block['date'] == block['date'] and 
                not (new_block['end_time'] <= block['start_time'] or 
                     new_block['start_time'] >= block['end_time'])):
            return True
    return False