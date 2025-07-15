from datetime import datetime, time, timedelta
import uuid
from .models import FixedClassSchedule, Semester, StudyBlock, UserPreferences


def generate_timetable(user, semester_start, semester_end, semester_id):




    deleted_count = StudyBlock.objects.filter(
        user=user,
        semester_id=semester_id
    ).delete()[0]


    # Get preferences
    prefs = UserPreferences.objects.get(user=user)
    off_days = [day.lower() for day in prefs.get_off_days_list()]




    # Convert preferred times
    preferred_start_time = prefs.study_start_min
    preferred_end_time = prefs.study_end_max
    if not isinstance(preferred_start_time, time):
        preferred_start_time = datetime.strptime(preferred_start_time, '%H:%M:%S').time()
    if not isinstance(preferred_end_time, time):
        preferred_end_time = datetime.strptime(preferred_end_time, '%H:%M:%S').time()


    # Fetch fixed classes and extract distinct courses
    fixed_schedules = FixedClassSchedule.objects.filter(
        user=user,
        semester=semester_id
    ).select_related('course')

    # Get distinct courses from fixed schedules
    courses = set()
    for schedule in fixed_schedules:
        courses.add(schedule.course)



    course_rotation_index = 0

    # Precompute fixed classes by day
    fixed_classes_by_day = {}
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for day in days:
        fixed_classes_by_day[day] = []

    for schedule in fixed_schedules:
        if schedule.day in fixed_classes_by_day:
            fixed_classes_by_day[schedule.day].append(schedule)

    study_blocks = []
    processed_days = 0
    skipped_days = 0

    for day in days:


        # Case-insensitive off day check
        if day.lower() in off_days:

            skipped_days += 1
            continue

        # Get free time slots
        fixed_classes_today = fixed_classes_by_day[day]
        free_slots = get_free_time_slots(day, fixed_classes_today, preferred_start_time, preferred_end_time)

        if free_slots:

            processed_days += 1

            for i, slot in enumerate(free_slots, 1):
                print(f"  Slot {i}: {slot[0].strftime('%H:%M')} - {slot[1].strftime('%H:%M')}")

            # Get course list
            course_list = list(courses)
            if not course_list:

                continue


            for slot in free_slots:
                slot_start, slot_end = slot

                # Get next course in rotation
                course = course_list[course_rotation_index % len(course_list)]
                course_rotation_index += 1


                # Create and save study block
                study_block = StudyBlock(
                    user=user,
                    course=course,
                    semester=Semester.objects.get(pk=semester_id),
                    day=day,
                    start_time=slot_start,
                    end_time=slot_end,
                )
                try:
                    study_block.save()
                    study_blocks.append(study_block)

                except Exception as e:
                    print(f"  ❌ Error saving study block: {e}")






    return study_blocks


def get_free_time_slots(day, fixed_classes, preferred_start, preferred_end):
    intervals = []


    if not fixed_classes:


     for cls in fixed_classes:
        start = cls.start_time
        end = cls.end_time

        if not isinstance(start, time):
            start = datetime.strptime(str(start), '%H:%M:%S').time()
        if not isinstance(end, time):
            end = datetime.strptime(str(end), '%H:%M:%S').time()

        # Clip class times to preferred window
        clipped_start = max(start, preferred_start)
        clipped_end = min(end, preferred_end)

        # Only add if valid time slot
        if clipped_start < clipped_end:
            intervals.append((clipped_start, clipped_end))


    # Sort by start time
    intervals.sort(key=lambda x: x[0])

    # Merge overlapping intervals
    merged = []
    for start, end in intervals:
        if not merged:
            merged.append((start, end))
        else:
            last_start, last_end = merged[-1]
            if start <= last_end:  # Overlaps
                merged[-1] = (last_start, max(last_end, end))

            else:
                merged.append((start, end))

    # Calculate free slots within preferred window
    free_slots = []
    current_start = preferred_start

    # Slot before first class
    if merged:
        first_class_start = merged[0][0]
        if current_start < first_class_start:
            slot = (current_start, first_class_start)
            free_slots.append(slot)


    # Slots between classes
    for i in range(len(merged) - 1):
        current_end = merged[i][1]
        next_start = merged[i + 1][0]

        if current_end < next_start:
            slot = (current_end, next_start)
            free_slots.append(slot)


    # Slot after last class
    if merged:
        last_class_end = merged[-1][1]
        if last_class_end < preferred_end:
            slot = (last_class_end, preferred_end)
            free_slots.append(slot)

    elif preferred_start < preferred_end:  # No classes at all
        slot = (preferred_start, preferred_end)
        free_slots.append(slot)


    return free_slots