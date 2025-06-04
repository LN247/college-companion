from rest_framework.generics import RetrieveUpdateAPIView, CreateAPIView
from .serializers import CustomUserSerializer,RegistrationSerializer,LoginSerializer, GoogleAuthSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import UserPreferences, Course, StudyBlock,CustomUser
from .utils.scheduler import generate_timetable
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from google.oauth2 import id_token
from google.auth.transport import requests
from task import send_study_notification
from datetime import datetime, timedelta
from django.http import JsonResponse
import json
import os



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
         return response  
      except InvalidToken:
         return Response({'error': 'Invalid token: '}, status=status.HTTP_401_UNAUTHORIZED)



class GoogleAuthView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data.get('token')
            try:
                # Verify the Google token
                idinfo = id_token.verify_oauth2_token(
                    token, 
                    requests.Request(),
                    os.getenv('GOOGLE_CLIENT_ID')  
                )

                # Get user info from the token
                email = idinfo['email']
                
                # Try to get the user from database
                try:
                    user = CustomUser.objects.get(email=email)
                except CustomUser.DoesNotExist:
                    # Create new user if doesn't exist
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

                # Set cookies same as in LoginView
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

            except ValueError as e:
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     






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