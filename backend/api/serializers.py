from django.contrib.auth.models import User
from rest_framework import serializers, status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import  UserProfile




"""
This module contains serializers for user authentication and registration.
It includes:
1. CustomTokenObtainPairSerializer: A custom serializer for obtaining JWT tokens.   
2. UserCreateSerializer: A serializer for creating new users.
3. UserUpdateSerializer: A serializer for updating user information.
"""





"""
custom serializer for obtaining JWT tokens
IT overrides the default TokenObtainPairSerializer to include custom validation logic
and to add additional fields to the token payload."""





class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('student_id', 'major', 'year_level', 'gpa', 'profile_picture', 'bio')
