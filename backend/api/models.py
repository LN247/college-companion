
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import date
from .Validation import validate_file_size

#defining a custom class user to fit app requirements 


class CustomUser(AbstractUser):
    USERNAME_FIELD= 'email'
    email= models.EmailField(unique=True)
    REQUIRED_FIELDS=[]
    

class Semester(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='semesters')
    name = models.CharField(max_length=50)  # e.g., "Fall 2025"
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    def _str_(self):
        return f"{self.name} ({self.user.username})"

class Course(models.Model):
    DIFFICULTY_CHOICES = [
        (1, 'Very Easy'),
        (2, 'Easy'),
        (3, 'Medium'),
        (4, 'Hard'),
        (5, 'Very Hard'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courses')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True)  # e.g., "MATH101"
    credits = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(6)]
    )
    difficulty = models.PositiveSmallIntegerField(
        choices=DIFFICULTY_CHOICES, 
        default=3
    )
    color = models.CharField(max_length=7, default='#1E88E5')  # Hex color for UI
    
    def _str_(self):
        return f"{self.code} - {self.name}" if self.code else self.name

class FixedClassSchedule(models.Model):
    DAY_CHOICES = [
        ('MON', 'Monday'),
        ('TUE', 'Tuesday'),
        ('WED', 'Wednesday'),
        ('THU', 'Thursday'),
        ('FRI', 'Friday'),
        ('SAT', 'Saturday'),
        ('SUN', 'Sunday'),
    ]
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='fixed_classes')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='fixed_schedules')
    day = models.CharField(max_length=3, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=100, blank=True)  # e.g., "Room 305"
    class_type = models.CharField(  # e.g., Lecture, Lab, Tutorial
        max_length=20, 
        default='Lecture',
        blank=True
    )
    
    class Meta:
        unique_together = ['user', 'course', 'day', 'start_time']
        ordering = ['day', 'start_time']
    
    def _str_(self):
        return f"{self.course.name} - {self.get_day_display()} {self.start_time.strftime('%H:%M')}"

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
    DAY_CHOICES = [
        ('MON', 'Monday'),
        ('TUE', 'Tuesday'),
        ('WED', 'Wednesday'),
        ('THU', 'Thursday'),
        ('FRI', 'Friday'),
        ('SAT', 'Saturday'),
        ('SUN', 'Sunday'),
    ]
    
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='preferences')
    preferred_study_hours_per_day = models.FloatField(
        default=2.0,
        validators=[MinValueValidator(0.5), MaxValueValidator(8)],
        help_text="Preferred study hours per day"
    )
    off_days = models.CharField(
        max_length=27,  # Max: "MON,TUE,WED,THU,FRI,SAT,SUN"
        blank=True,
        help_text="Comma-separated days the user doesn't study (e.g., 'SAT,SUN')"
    )
    study_start_min = models.TimeField(
        default='18:00', 
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
from django.db.models.signals import post_save
from django.dispatch import receiver

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
        validators=[validate_file_size],
       
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
        validators=[validate_file_size],
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