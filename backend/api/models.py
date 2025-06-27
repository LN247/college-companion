from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import date
from django.conf import settings


DAY_CHOICES = [
        ('MON', 'Monday'),
        ('TUE', 'Tuesday'),
        ('WED', 'Wednesday'),
        ('THU', 'Thursday'),
        ('FRI', 'Friday'),
        ('SAT', 'Saturday'),
        ('SUN', 'Sunday'),
    ]






#defining a custom class user to fit app requirements 
class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=False, null=True, blank=True)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    



class UserProfile(models.Model):
    user=models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    username = models.CharField(max_length=30, blank=True, null=True)
    major = models.CharField(max_length=100, blank=True, null=True)
    minor = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True)
    level = models.CharField(max_length=20, default='Undergraduate', )
    profile_picture = models.FilePathField(path='profile_pictures/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    fcm_token = models.CharField(max_length=200, blank=True)


@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance, username=instance.username)
    else:
        instance.profile.save()


@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()



class Semester(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='semesters')
    name = models.CharField(max_length=50) 
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    

    def create_semester(self, name, start_date, end_date):
        """Create a new semester for the user."""
        if start_date >= end_date:
            raise ValidationError("Start date must be before end date.")
        if start_date < date.today():
            raise ValidationError("Cannot create a semester with a past start date.")
        
        return Semester.objects.create(
            user=self.user,
            name=name,
            start_date=start_date,
            end_date=end_date
        )
class Course(models.Model):
    DIFFICULTY_CHOICES = [
        (1, 'Easy'),
        (2, 'Medium'),
        (3, 'Hard'),
        (4, 'Very Hard'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courses')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True) 
    credits = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(6)]
    )
    difficulty = models.PositiveSmallIntegerField(
        choices=DIFFICULTY_CHOICES, 
        default=2
    )

    
    

class FixedClassSchedule(models.Model):
   
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='fixed_classes')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='fixed_schedules')
    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ['user', 'course', 'day', 'start_time']
        ordering = ['day', 'start_time']
    
    

class StudyBlock(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='study_blocks')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='study_sessions')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_completed = models.BooleanField(default=False)
    is_notified = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['date', 'start_time']
        indexes = [
            models.Index(fields=['date', 'user']),
        ]
    
    def _str_(self):
        return f"{self.course.name} study on {self.date} at {self.start_time.strftime('%H:%M')}"

class UserPreferences(models.Model):

    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='preferences')
    preferred_study_hours_per_day = models.FloatField(
        default=2.0,
        validators=[MinValueValidator(0.5), MaxValueValidator(8)],
        help_text="Preferred study hours per day"
    )
    off_days = models.CharField(
        max_length=27,  
        blank=True,
        help_text="Comma-separated days the user doesn't study (e.g., 'SAT,SUN')"
    )
    study_start_min = models.TimeField(
        default='20:00', 
        help_text="Earliest preferred study start time"
    )
    study_end_max = models.TimeField(
        default='22:00', 
        help_text="Latest preferred study end time"
    )

    notification_reminder_minutes = models.PositiveIntegerField(
        default=15,
        validators=[MinValueValidator(5), MaxValueValidator(60)],
        help_text="Minutes before study session to send notification"
    )
    
    def get_off_days_list(self):
        """Return off days as Python list"""
        return self.off_days.split(',') if self.off_days else []
    
    def set_off_days(self, days_list):
        """Set off days from Python list"""
        self.off_days = ','.join(days_list)
    
    def _str_(self):
        return f"Preferences for {self.user.username}"

# Signal to create UserPreferences when new user is created


@receiver(post_save, sender=CustomUser)
def create_user_preferences(sender, instance, created, **kwargs):
    if created:
        UserPreferences.objects.create(user=instance)




class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE,
        related_name='created_groups'
    )
    cover_image = models.ImageField(
        upload_to='group_covers/', 
        null=True, 
        blank=True
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name

class GroupMembership(models.Model):
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('moderator', 'Moderator'),
        ('admin', 'Admin'),
    ]
    
    user = models.ForeignKey(
       CustomUser, 
        on_delete=models.CASCADE,
        related_name='group_memberships'
    )
    group = models.ForeignKey(
        Group, 
        on_delete=models.CASCADE,
        related_name='memberships'
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(
        max_length=10, 
        choices=ROLE_CHOICES, 
        default='member'
    )
    last_read = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'group')
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} in {self.group.name}"

def message_file_path(instance, filename):
    return f'messages/user_{instance.message.sender.id}/{filename}'

class FileUpload(models.Model):
    FILE_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('document', 'Document'),
        ('other', 'Other'),
    ]
    
    file = models.FileField(
        upload_to=message_file_path,
        
       
    )
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    file_size = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.file_type} file ({self.file_size} bytes)"
    
    def save(self, *args, **kwargs):
        if not self.file_size:
            self.file_size = self.file.size
        super().save(*args, **kwargs)

class Message(models.Model):
    sender = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    group = models.ForeignKey(
        Group, 
        on_delete=models.CASCADE,
        related_name='messages'
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"Message from {self.sender.username} at {self.timestamp}"
    
    def mark_as_read(self, user):
        membership = GroupMembership.objects.get(
            user=user, 
            group=self.group
        )
        if membership.last_read < self.timestamp:
            membership.last_read = self.timestamp
            membership.save()

class MessageContent(models.Model):
    CONTENT_TYPES = [
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('file', 'File'),
    ]
    
    message = models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='contents'
    )
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPES)
    content = models.TextField(blank=True, null=True)
    file = models.ForeignKey(
        FileUpload,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='message_contents'
    )
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.content_type} content for message {self.message.id}"
    

class Reaction(models.Model):
  
    
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='reactions'
    )
    message = models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='reactions'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'message')
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.user.username} reacted {self.reaction_type} to message {self.message.id}"
    def save(self, *args, **kwargs):
        if not self.pk:
            # Ensure only one reaction per user per message
            existing_reaction = Reaction.objects.filter(
                user=self.user, 
                message=self.message
            ).first()
            if existing_reaction:
                existing_reaction.delete()

class GroupChat(models.Model):
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GroupMembership(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='group_memberships')
    group = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name='memberships')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'group')

    def __str__(self):
        return f"{self.user.username} in {self.group.name}"

class GroupMessage(models.Model):
    group = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='group_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.content[:20]}..."

class Resource(models.Model):
    RESOURCE_TYPES = [
        ('roadmap', 'Roadmap'),
        ('advice', 'Expert Advice'),
        ('orientation', 'Orientation'),
        ('event', 'Event/Workshop'),
        ('link', 'Useful Link'),
        ('other', 'Other'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    url = models.URLField(blank=True, null=True)
    type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    major = models.CharField(max_length=100, blank=True, null=True)
    minor = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.type}) for {self.major or 'All Majors'}"

class Event(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='events')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    color = models.CharField(max_length=7, default='#1E88E5')  # Hex color for UI

    def __str__(self):
        return self.title