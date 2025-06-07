

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import date


#defining a custom class user to fit app requirements 


class CustomUser(AbstractUser):
    USERNAME_FIELD= 'email'
    email= models.EmailField(unique=True)
    REQUIRED_FIELDS=[]

    
    
    