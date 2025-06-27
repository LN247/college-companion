from celery import shared_task
from django.utils import timezone
from .models import StudyBlock
from django.core.mail import send_mail
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
        
        # 1. Email notification
        if user.email:
            send_mail(
                subject="Study Time Reminder",
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True
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