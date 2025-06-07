from os import access
from django.shortcuts import render
from rest_framework.generics import RetrieveUpdateAPIView, CreateAPIView
from .serializers import CustomUserSerializer,RegistrationSerializer,LoginSerializer, GoogleAuthSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from google.oauth2 import id_token
from google.auth.transport import requests
import os
from rest_framework import viewsets
from .models import Semester, Course, FixedClassSchedule, StudyBlock, UserPreferences
from .serializers import (
    SemesterSerializer, CourseSerializer, FixedClassScheduleSerializer,
    StudyBlockSerializer, UserPreferencesSerializer
)



class UserInfoView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class=CustomUserSerializer

    def get_object(self):
        return self.request.user
    


class RegistrationView(CreateAPIView):
     permission_classes = [AllowAny]
     serializer_class=RegistrationSerializer



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            if user is None:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response = Response({
                'user': CustomUserSerializer(user).data
            }, status=status.HTTP_200_OK)

            response.set_cookie(
                key='access_token',
                value=access_token,
                samesite='None',
                httponly=True,
                secure=True
            )

            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                samesite='None',
                httponly=True,
                secure=True
            )

            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
   permission_classes = [AllowAny]
   def post(self,request):
      refresh_token= request.COOKIES.get('refresh_token')

      if refresh_token:
        try:    
          refresh= RefreshToken.for_user(refresh_token)
          refresh.blacklist()
       
        except Exception as e:
          return Response({'error': 'error in validating token: ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
      response= Response({'message': 'logout succesfull: ' }, status=status.HTTP_200_OK)

      response.delete_cookie('access_token')
      response.delete_cookie('refresh_token')

      return response
   
class CookieTokenRefreshView(TokenRefreshView):
   
   def post(self, request):
      refresh_token = request.COOKIES.get('refresh_token')
    
      if not refresh_token:
        return Response({'error': 'refresh token not provided: '}, status=status.HTTP_401_UNAUTHORIZED)
     
      try:
         refresh = RefreshToken(refresh_token)
         access_token = str(refresh.access_token)

         response = Response({'message': 'Access token refresh successfully: '}, status=status.HTTP_200_OK)

         response.set_cookie(
                key='access_token',
                value=access_token,
                samesite='None',
                httponly=True,
                secure=True
            )
         return response  # <-- Add this line!
      except InvalidToken:
         return Response({'error': 'Invalid token: '}, status=status.HTTP_401_UNAUTHORIZED)
     
     
     #create a google login or signup   view which will handle the google login and return the user info and access token
     


class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data.get('token')
            try:
                idinfo = id_token.verify_oauth2_token(
                    token, 
                    requests.Request(),
                    os.getenv('GOOGLE_CLIENT_ID')
                )
                email = idinfo['email']
                try:
                    user = CustomUser.objects.get(email=email)
                except CustomUser.DoesNotExist:
                    user = CustomUser.objects.create(
                        email=email,
                        username=email
                    )
                finally:
                    refresh = RefreshToken.for_user(user)
                    access_token = str(refresh.access_token)

                    response = Response({
                        'user': CustomUserSerializer(user).data
                    }, status=status.HTTP_200_OK)

                    response.set_cookie(
                    key='access_token',
                    value=access_token,
                    samesite='None',
                    httponly=True,
                    secure=True
                    )

                    response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    samesite='None',
                    httponly=True,
                    secure=True
                  )    
                
                # Example: return user info
                return Response({'email': user.email}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#create the view of the  different  models  and their serializers

class SemesterViewSet(viewsets.ModelViewSet):
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Semester.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Course.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FixedClassScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = FixedClassScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FixedClassSchedule.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class StudyBlockViewSet(viewsets.ModelViewSet):
    serializer_class = StudyBlockSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyBlock.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserPreferencesViewSet(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserPreferences.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
