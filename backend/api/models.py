


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
<<<<<<< HEAD
    USERNAME_FIELD= 'email'
    email= models.EmailField(unique=True)
    REQUIRED_FIELDS=[]

    
    
    
=======
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
>>>>>>> b6dc82cae86bbbbbee5bbea630142c39207f2a74
