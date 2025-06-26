import os
from celery import Celery
from celery.schedules import crontab
from __future__ import absolute_import
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


app.conf.beat_schedule = {
    'refresh-discipline-data-48h': {
        'task': 'backend.tasks.fetch_all_disciplines_data',
        'schedule': crontab(hour='*/48'),  # Every 48 hours
        'options': {
            'expires': 60 * 60  # 1 hour expiration
        }
    },
    # Optional: Daily health check
    'health-check': {
        'task': 'backend.tasks.health_check',
        'schedule': crontab(minute=0, hour=0),  # Daily at midnight
    }
}

app.conf.timezone = 'UTC'