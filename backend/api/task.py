# tasks.py
from celery import shared_task
from .models import StudyBlock
from django.conf import settings

import requests



@shared_task
def send_study_notification(block_id):
    try:
        block = StudyBlock.objects.get(id=block_id)
        user = block.user

        # Notification message
        message = (
            f"Study time for {block.course.name} starting soon!\n"
            f" {block.start_time.strftime('%H:%M')} - {block.end_time.strftime('%H:%M')}"
        )

        # push notificaftion  using firebase cloud  messaging
        if hasattr(user, 'fcm_token') and user.fcm_token:
            headers = {
                "Authorization": f"key={settings.FCM_SERVER_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "to": user.fcm_token,
                "notification": {
                    "title": "Study Time Reminder",
                    "body": message,
                    "icon": "ic_notification"
                },
                "data": {
                    "block_id": str(block.id),
                    "type": "study_reminder"
                }
            }
            requests.post(
                "https://fcm.googleapis.com/fcm/send",
                json=payload,
                headers=headers
            )

        return f"Notification sent for block {block_id}"
    except StudyBlock.DoesNotExist:
        return "StudyBlock not found"



@shared_task
def send_class_time_reminder(block_id):


    pass





