from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_save
from django.conf import settings
from django.dispatch import receiver
from datetime import date
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin





class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('first_name', 'Admin')
        extra_fields.setdefault('last_name', 'User')
        extra_fields.setdefault('username', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)



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

    objects = CustomUserManager()


from rest_framework.permissions import BasePermission


class IsSuperUserOrReadOnly(BasePermission):
    """
       Custom permission to grant full access only to superusers,
       while others can only view.
       """

    def has_permission(self, request, view):
        # Grant full access to superusers
        if request.user.is_superuser:
            return True
        # Allow only safe methods (GET, HEAD, OPTIONS) for normal users
        return request.method in ["GET", "HEAD", "OPTIONS"]



class UserProfile(models.Model):
    user=models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    username = models.CharField(max_length=150, unique=False, null=True, blank=True)
    major = models.CharField(max_length=100, blank=True, null=True)
    minor = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.PositiveIntegerField(blank=True, null=True)
    level = models.CharField(max_length=20, default='Undergraduate', )
    profile_picture = models.FilePathField(path='profile_pictures/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    fcm_token = models.CharField(max_length=200, blank=True)




class Semester(models.Model):
    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='semesters',
    null=True,
    blank=True
)
    name = models.CharField(max_length=50) 
    year= models.PositiveIntegerField(null=True,
        validators=[MinValueValidator(2000), MaxValueValidator(2100)],
        help_text="Year of the semester (e.g., 2023)"
    )
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    semester_type = models.CharField(max_length=10, null=True, blank=True)
    created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='created_semesters',
    null=True,
    blank=True
)


    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True  )
    updated_at = models.DateTimeField(auto_now=True,null=True, blank=True  )


    class Meta:
        unique_together = ('name', 'year')
        ordering = ['-year', 'start_date']

    def __str__(self):
        return f"{self.name} {self.year} ({self.get_semester_type_display()})"
    
    @property
    def status(self):
        today = timezone.now().date()


        if self.start_date and self.start_date > today:
            return "Upcoming"
        elif self.end_date and self.end_date < today:
            return "Completed"
        elif self.start_date and self.end_date:
            return "Ongoing"
        else:
            return "Unknown"  # Provide fallback if dates are missing



    
    def create_semester(self, name, start_date, end_date):
        return Semester.objects.create(
            user=self.user,
            name=name,
            start_date=start_date,
            end_date=end_date
        )



class Course(models.Model):

    user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='course',
    null=True,
    blank=True
)

    name = models.CharField(max_length=100)
    academicLevel = models.CharField(max_length=50, blank=True, null=True)
    code = models.CharField(max_length=20, blank=True) 
    credits = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(6)]
    )
    semester=models.CharField(max_length=50, blank=True, null=True)
    created_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='created_courses',
    null=True,
    blank=True
)



    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('semester', 'code')
        ordering = ['academicLevel', 'code']

    def __str__(self):
        return f"{self.code} - {self.name}"
    

    
    

class FixedClassSchedule(models.Model):
   
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='fixed_classes')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='fixed_schedules')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='fixed_schedules')
    day = models.CharField(max_length=15 )
    start_time = models.TimeField()
    end_time = models.TimeField()
    difficulty_level = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        unique_together = ['user', 'course', 'day', 'start_time']
        ordering = ['day', 'start_time']
    
    
class StudyBlock(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    day = models.CharField(max_length=10,null=True,blank=True)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.course.name} on {self.day} from {self.start_time} to {self.end_time}"

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
        help_text="Comma-separated days the user doesn't study ",
        default='Sunday'

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
