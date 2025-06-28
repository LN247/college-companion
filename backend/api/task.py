from datetime import datetime, timedelta, time

from django.utils import timezone
from .models import StudyBlock,Event,FixedClassSchedule
from celery import shared_task
from django.core.cache import cache
import pytz
from .notification import notify_event,notify_class_schedule,send_studyblock_notification
import requests






@shared_task
def check_daily_events():
    today = timezone.localdate()
    # Reset notification flags for new day
    Event.objects.filter(date__lt=today).update(notified=False)

    for event in Event.objects.filter(date=today, notified=False):
        try:
            tz = pytz.timezone(event.user.timezone)
            user_now = timezone.now().astimezone(tz)

            # Send between 8-10 AM local time
            if 8 <= user_now.hour < 10:
                notify_event(event)
                event.notified = True
                event.save()

        except (pytz.UnknownTimeZoneError, AttributeError):
            continue


@shared_task
def check_upcoming_classes():
    now = timezone.now()
    cache_window = 15 * 60  # 15 minutes in seconds

    for block in FixedClassSchedule.objects.filter(is_active=True):
        try:
            tz = pytz.timezone(block.user.timezone)
            user_now = now.astimezone(tz)
            user_today = user_now.date()

            # Skip if not today
            if user_now.weekday() != block.day_of_week:
                continue

            # Build class datetime in user's timezone
            class_start = tz.localize(
                datetime.combine(user_today, block.start_time)
            )
            # Check if within next 15 mins
            if 0 < (class_start - user_now).total_seconds() <= cache_window:
                cache_key = f"class_{block.id}_{user_today}"
                if not cache.get(cache_key):
                    notify_class_schedule(block)
                    cache.set(cache_key, True, timeout=86400)  # 24h cache

        except (pytz.UnknownTimeZoneError, AttributeError):
            continue


# Day mapping for quick lookup
DAY_MAPPING = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6
}


@shared_task
def check_upcoming_studyblocks():
    """Check and send notifications for upcoming classes"""
    now_utc = timezone.now()
    notification_window = 15  # Minutes before class to notify

    # Get active study blocks with users who have FCM tokens
    blocks = StudyBlock.objects.filter(
        is_active=True,
        user__fcm_token__isnull=False
    ).select_related('user', 'course')

    for block in blocks:
        try:
            # Get user's timezone
            user_tz = pytz.timezone(block.user.timezone)
            user_now = now_utc.astimezone(user_tz)

            # Get current weekday index (0=Monday, 6=Sunday)
            current_weekday = user_now.weekday()
            target_weekday = DAY_MAPPING[block.day]

            # Calculate days until target day
            if current_weekday < target_weekday:
                days_until = target_weekday - current_weekday
            elif current_weekday > target_weekday:
                days_until = 7 - (current_weekday - target_weekday)
            else:  # Same day
                days_until = 0

            # Calculate next occurrence date
            next_date = user_now.date() + timedelta(days=days_until)

            # Create datetime for class start
            class_start = user_tz.localize(
                datetime.combine(next_date, block.start_time)
            )

            # Calculate notification time (15 minutes before class)
            notify_time = class_start - timedelta(minutes=notification_window)

            # Skip if class already started
            if user_now > class_start:
                continue

            # Check if in notification window
            if user_now >= notify_time:
                cache_key = f"studyblock_{block.id}_{next_date.isoformat()}"
                if not cache.get(cache_key):
                    if send_studyblock_notification(block):
                        # Prevent duplicate notifications for 24 hours
                        cache.set(cache_key, True, timeout=86400)
        except (pytz.UnknownTimeZoneError, ValueError):
            # Handle invalid timezones
            continue