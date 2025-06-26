# tasks.py
from celery import shared_task
from django.utils import timezone
from .models import StudyBlock, FixedClassSchedule
from django.conf import settings
from django.utils import timezone
from django.core.cache import cache
from .models import Discipline, Roadmap, ExpertAdvice, CollegeResource
from .data_sources import get_roadmaps, get_advice, get_resources
import logging
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






logger = logging.getLogger(__name__)

@shared_task
def fetch_all_disciplines_data():
    """
    Fetches and stores data for all unique disciplines
    Runs every 48 hours via Celery Beat
    """
    # Get unique disciplines needing refresh (last updated >48h ago)
    disciplines = Discipline.objects.filter(
        last_updated__lt=timezone.now() - timezone.timedelta(hours=48)
    ).distinct()
    
    if not disciplines.exists():
        logger.info("No disciplines require refresh")
        return
    
    logger.info(f"Starting data refresh for {disciplines.count()} disciplines")
    
    for discipline in disciplines:
        fetch_discipline_data(discipline.name)
        discipline.last_updated = timezone.now()
        discipline.save()
    
    logger.info("Completed discipline data refresh")
    # Clear all user resource caches after update
    cache.delete_pattern("user_resources:*")


    

@shared_task
def fetch_discipline_data(discipline_name):
    """
    Fetches and stores data for a single discipline
    """
    logger.info(f"Fetching data for discipline: {discipline_name}")
    
    try:
        discipline = Discipline.objects.get(name=discipline_name)
    except Discipline.DoesNotExist:
        logger.error(f"Discipline {discipline_name} not found")
        return
    
    # Fetch data from external sources
    try:
        # Roadmaps
        for item in get_roadmaps(discipline_name):
            roadmap, created = Roadmap.objects.update_or_create(
                source_url=item['source_url'],
                defaults={
                    'title': item['title'],
                    'description': item['description'],
                    'difficulty': item.get('difficulty', ''),
                    'duration': item.get('duration', ''),
                    'tags': item.get('tags', []),
                    'rating': item.get('rating', 0.0),
                    'downloads': item.get('downloads', 0)
                }
            )
            roadmap.disciplines.add(discipline)
        
        # Expert Advice
        for item in get_advice(discipline_name):
            advice, created = ExpertAdvice.objects.update_or_create(
                source_url=item['source_url'],
                defaults={
                    'expert': item['expert'],
                    'expert_title': item['expert_title'],
                    'advice_title': item['advice_title'],
                    'content': item['content'],
                    'category': item.get('category', ''),
                    'read_time': item.get('read_time', ''),
                    'featured': item.get('featured', False)
                }
            )
            advice.disciplines.add(discipline)
        
        # College Resources
        for item in get_resources(discipline_name):
            resource, created = CollegeResource.objects.update_or_create(
                source_url=item['source_url'],
                defaults={
                    'title': item['title'],
                    'type': item['type'],
                    'description': item['description'],
                    'category': item.get('category', ''),
                    'useful': item.get('useful', 0)
                }
            )
            resource.disciplines.add(discipline)
            
        logger.info(f"Successfully updated {discipline_name} data")
        
    except Exception as e:
        logger.error(f"Failed to fetch data for {discipline_name}: {str(e)}")
        # Retry task after 1 hour
        fetch_discipline_data.apply_async(
            args=[discipline_name], 
            countdown=3600
        )


@shared_task
def health_check():
    """Periodic health check for monitoring"""
    from django.db import connection
    from redis import Redis
    from .models import Discipline
    
    # Database check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
    
    # Redis check
    try:
        redis = Redis.from_url(settings.CELERY_BROKER_URL)
        redis.ping()
    except Exception as e:
        logger.error(f"Redis health check failed: {str(e)}")
    
    # Data freshness check
    stale = Discipline.objects.filter(
        last_updated__lt=timezone.now() - timezone.timedelta(hours=50)
    )
    if stale.exists():
        logger.warning(f"{stale.count()} disciplines with stale data")
    
    return "HEALTHY"