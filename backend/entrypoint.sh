#!/bin/sh

# Apply database migrations
python manage.py migrate

# Start Gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3 &

# Start Celery worker
celery -A backend worker --loglevel=INFO &

# Keep container running
wait