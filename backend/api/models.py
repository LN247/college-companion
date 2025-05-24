

from django.db import models
from django.contrib.auth.models import AbstractUser



#defining a custom class user to fit app requirements 


class CustomUser(AbstractUser):
    USERNAME_FIELD= 'email'
    email= models.EmailField(unique=True)
    REQUIRED_FIELDS=[]
    