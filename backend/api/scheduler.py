from datetime import datetime, time, timedelta
from .models import FixedClassSchedule, Semester
from .models import StudyBlock
from .models import UserPreferences
from .task import send_study_notification


def generate_timetable(user, semester_start, semester_end, semester_id):
    # Get user preferences
    prefs = UserPreferences.objects.get(user=user)
    off_days = [day.lower() for day in prefs.get_off_days_list()]
    notification_min= prefs. notification_reminder_minutes
    preferred_start_time = prefs.study_start_min
    preferred_end_time = prefs.study_end_max

    print(off_days, preferred_end_time, preferred_start_time)

    # Get user's fixed class schedule for the provided semester
    fixed_class_schedules = FixedClassSchedule.objects.filter(user=user, semester=semester_id)

    print(fixed_class_schedules)

    study_blocks = []

    for class_schedule in fixed_class_schedules:
        print(f"Processing class schedule: {class_schedule}")  # Added

        day = class_schedule.day.lower()
        start_time = class_schedule.start_time
        end_time = class_schedule.end_time
        course = class_schedule.course

        print(f"Day: {day}, Start time: {start_time}, End time: {end_time}, Course: {course}")  # Added

        if day in off_days:
            print(f"Skipping {day} because it's an off day. Off days are: {off_days}")  # Modified
            continue

        # Time conversion and comparison issues:
        print(f"Original start_time: {start_time}, Original end_time: {end_time}")

        if not isinstance(start_time, time):
            start_time = datetime.strptime(str(start_time), '%H:%M:%S').time()
            print(f"Converted start_time: {start_time}")
        if not isinstance(end_time, time):
            end_time = datetime.strptime(str(end_time), '%H:%M:%S').time()
            print(f"Converted end_time: {end_time}")

        if preferred_start_time and preferred_end_time:
            print(
                f"Preferred study times are set. preferred_start_time: {preferred_start_time}, preferred_end_time: {preferred_end_time}")

            if not isinstance(preferred_start_time, time):
                preferred_start_time = datetime.strptime(preferred_start_time, '%H:%M:%S').time()
                print(f"Converted preferred_start_time: {preferred_start_time}")
            if not isinstance(preferred_end_time, time):
                preferred_end_time = datetime.strptime(preferred_end_time, '%H:%M:%S').time()
                print(f"Converted preferred_end_time: {preferred_end_time}")

            if start_time >= preferred_start_time and end_time <= preferred_end_time:
                print("Class is within preferred study times. Creating study block.")
                study_block = StudyBlock(
                    user=user,
                    course=course,
                    semester_id=semester_id,
                    day=day,
                    start_time=start_time,
                    end_time=end_time,
                )
                try:
                    study_block.save()
                    study_blocks.append(study_block)
                    print(f"Created and saved study block: {study_block}")
                except Exception as e:
                    print(f"Error saving study block: {e}")

                # Schedule notification
                notification_time = datetime.combine(semester_start, start_time) - timedelta(minutes=notification_min)
                # Schedule the task
                send_study_notification.apply_async(args=[study_block.id], eta=notification_time)

            else:
                print("Class is outside preferred study times. Skipping.")
                continue
        else:
            print("Preferred study times are not set. Creating study block.")
            study_block = StudyBlock(
                user=user,
                course=course,
                semester=Semester.objects.get(pk=semester_id),
                day=day,
                start_time=start_time,
                end_time=end_time,
            )
            try:
                study_block.save()
                study_blocks.append(study_block)
                print(f"Created and saved study block: {study_block}")
            except Exception as e:
                print(f"Error saving study block: {e}")

            notification_time = datetime.combine(semester_start, start_time) - timedelta(minutes=notification_min)
            send_study_notification.apply_async(args=[study_block.id], eta=notification_time)

    return study_blocks
