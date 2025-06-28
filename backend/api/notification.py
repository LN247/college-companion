# notifications.py
import requests
from django.conf import settings

def send_push_notification(user, title, body, data):
    if not user.fcm_token:
        return False

    payload = {
        "to": user.fcm_token,
        "notification": {"title": title, "body": body, "icon": "ic_notification"},
        "data": data,
    }
    headers = {
        "Authorization": f"key={settings.FCM_SERVER_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post("https://fcm.googleapis.com/fcm/send", json=payload, headers=headers)
    return response.ok



def send_studyblock_notification(block):
    message = (
        f"You want pass or u want fail ? . {block.course.name} study session de start at "
        f"{block.start_time.strftime('%H:%M')} make u no play with your future "
    )
    send_push_notification(
        user=block.user,
        title="Study Remainder",
        body=message,
        data={"type": "class_reminder", "block_id": str(block.id)}
    )

def notify_class_schedule(block):
    message = (
        f"Class for {block.course.name} starting at "
        f"{block.start_time.strftime('%H:%M')}"
    )
    send_push_notification(
        user=block.user,
        title="Class Reminder",
        body=message,
        data={"type": "class_reminder", "block_id": str(block.id)}
    )

def notify_event(event):
    message = (
        f"Event '{event.title}' today at "
        f"{event.start_time.strftime('%H:%M')}"
    )
    send_push_notification(
        user=event.user,
        title="Event Reminder",
        body=message,
        data={"type": "event_reminder", "event_id": str(event.id)}
    )