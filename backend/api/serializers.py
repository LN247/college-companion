

from django.contrib.auth.models import User
from rest_framework import serializers, status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer




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





class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = 'email'
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
       
        email = attrs.get('email')
        password = attrs.get('password')

        try:
           
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            
            raise serializers.ValidationError({"email": "No account found with this email address."})
        
        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Incorrect password."})

       
       
        self.user = user

        refresh = self.get_token(self.user)

        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        
        
        return data


