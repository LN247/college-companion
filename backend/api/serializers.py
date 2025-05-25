from django.contrib.auth.models import User
from rest_framework import serializers, status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import (
    Course, Enrollment, Assignment, Submission,
    StudyGroup, StudyGroupMessage, CareerTest, UserProfile
)



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




User = get_user_model()

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.context['request'].user
        data['user'] = UserSerializer(user).data
        return data



class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('student_id', 'major', 'year_level', 'gpa', 'profile_picture', 'bio')

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    student = UserSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Assignment
        fields = '__all__'

class SubmissionSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(read_only=True)
    student = UserSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = '__all__'

class StudyGroupSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = StudyGroup
        fields = '__all__'

class StudyGroupMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = StudyGroupMessage
        fields = '__all__'

class CareerTestSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = CareerTest
        fields = '__all__'