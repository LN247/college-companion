from rest_framework.generics import RetrieveUpdateAPIView, CreateAPIView
from .serializers import CustomUserSerializer,RegistrationSerializer,LoginSerializer, GoogleAuthSerializer
from .models import CustomUser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import UserPreferences, Course, StudyBlock,CustomUser,UserProfile
from .scheduler import generate_timetable
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import datetime, timedelta
from django.http import JsonResponse
import json
import os
from .task import send_study_notification
from rest_framework import viewsets
from .models import Semester, Course, FixedClassSchedule, StudyBlock, UserPreferences
from django.conf import settings
from .serializers import (
    SemesterSerializer, CourseSerializer, FixedClassScheduleSerializer,
    StudyBlockSerializer, UserPreferencesSerializer
)
from .utilities.Propose_community import propose_community




class UserInfoView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class=CustomUserSerializer

    def get_object(self):
        return self.request.user
    


class RegistrationView(CreateAPIView):
     permission_classes = [AllowAny]
     authentication_classes = [] 
     serializer_class=RegistrationSerializer



class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = [] 
    
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
         return response  
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
                    os.getenv('VITE_GOOGLE_CLIENT_ID')  # Make sure to set this in your environment variables
                )

                

                # Get user info from the token
                email = idinfo['email']
                try:
                    user = CustomUser.objects.get(email=email)
                except CustomUser.DoesNotExist:
                    user = CustomUser.objects.create(
                        email=email,
                        username=email 
                    )
                    user.set_unusable_password()  
                    user.save()

                # Generate JWT tokens
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
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_fcm_token(request):
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token missing'}, status=400)
    
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    profile.fcm_token = token
    profile.save()
    
    return Response({'status': 'success', 'message': 'FCM token saved'})







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




@method_decorator(csrf_exempt, name='dispatch')
class GenerateTimetable(APIView):
    def post(self, request):
        data = json.loads(request.body)
        user = request.user
        
        # Clear existing data
        Course.objects.filter(user=user).delete()
        StudyBlock.objects.filter(user=user).delete()
        
        # Create courses
        courses = []
        for course_data in data['courses']:
            course = Course.objects.create(
                user=user,
                name=course_data['name'],
                difficulty=course_data['difficulty'],
                credits=course_data['credits'],
                priority=course_data.get('priority', 3)
            )
            courses.append(course)
        
        # Create/update preferences
        UserPreferences.objects.update_or_create(
            user=user,
            defaults={
                'off_days': data['preferences']['off_days'],
                'fixed_study_hours': data['preferences']['fixed_study_hours']
            }
        )
        
        # Date range (next 2 weeks)
        start_date = datetime.now().date()
        end_date = start_date + timedelta(days=14)
        
        # Generate timetable
        study_blocks = generate_timetable(user, courses, start_date, end_date)
        
        # Save to database
        for block in study_blocks:
            StudyBlock.objects.create(
                user=user,
                course=block['course'],
                date=block['date'],
                start_time=block['start_time'],
                end_time=block['end_time']
            )


            notification_time = datetime.combine(
            block['date'], 
            block['start_time']
            ) - timedelta(minutes=settings.STUDY_NOTIFICATION_ADVANCE_MINUTES)
    
    # Schedule Celery task
            send_study_notification.apply_async(
            args=[block.id], 
            eta=notification_time
            )

        return JsonResponse({'status': 'success', 'blocks_created': len(study_blocks)}, status=status.HTTP_200_OK)

class CommunityProposalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id=None):
        """
        Get community proposals for the authenticated user.
        Optionally filter by course_id.
        """
        result = propose_community(request.user.id, course_id)
        return Response(result, status=status.HTTP_200_OK if result['status'] == 'success' else status.HTTP_400_BAD_REQUEST)