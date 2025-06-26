from rest_framework.generics import RetrieveUpdateAPIView, CreateAPIView
from .serializers import CustomUserSerializer,RegistrationSerializer,LoginSerializer, GoogleAuthSerializer
from .models import CustomUser
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
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
from datetime import datetime, timedelta ,date
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
import json
import os
from .task import send_study_notification
from rest_framework import viewsets
from .authentication import CookieJWTAuthentication
from .models import Semester, Course, FixedClassSchedule, StudyBlock, UserPreferences
from django.conf import settings
from .serializers import (
    SemesterSerializer, CourseSerializer, FixedClassScheduleSerializer,
    StudyBlockSerializer, UserPreferencesSerializer
)




class UserInfoView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class=CustomUserSerializer
    authentication_classes = [CookieJWTAuthentication]

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
                samesite='Lax',
                httponly=True,
                secure=False,
                max_age=timedelta(days=7, hours=23, minutes=59),
                domain='127.0.0.1/'

            )

            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                samesite='Lax',
                httponly=True,
                secure=False,
                max_age = timedelta(days=12, hours=23, minutes=59),
                domain='127.0.0.1/'
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
    
      response= Response({'message': 'logout successful: ' }, status=status.HTTP_200_OK)

      response.delete_cookie('access_token')
      response.delete_cookie('refresh_token')

      return response
   
@method_decorator(csrf_protect, name='dispatch')
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
                samesite='Lax',
                httponly=True,
                secure=False,
                max_age=timedelta(days=12, hours=23, minutes=59),
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
                    os.getenv('VITE_GOOGLE_CLIENT_ID')
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
                    samesite='Lax',
                    httponly=True,
                    secure=False,
                    max_age = timedelta(days=7, hours=23, minutes=59),

                    )

                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    samesite='Lax',
                    httponly=True,
                    secure=False,
                    max_age=timedelta(days=12, hours=23, minutes=59),

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







class SemesterViewSet(viewsets.ReadOnlyModelViewSet):
    """
       Read-only viewset for the Semester model with different querysets for superusers and non-superusers.
       """

    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer


    def get_queryset(self):
        """
        Customize the queryset based on whether the user is a superuser.
        """

        today = date.today()

        if self.request.user.is_superuser:
            # Superuser: return all semesters
            return Semester.objects.all()
        else:
            # Non-superuser: return only ongoing/upcoming semesters
            from django.db.models import Q
            return Semester.objects.filter(
                Q(start_date__gte=today) | Q(end_date__gte=today)
            )




class  SemesterOperationViewSet(viewsets.ModelViewSet):

    queryset = Semester.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = SemesterSerializer


    def get_queryset(self):
        """
        Returns all Semester objects.
        """
        return Semester.objects.all()

    def create(self, request, *args, **kwargs):
        """
        Creates a new semester.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None, *args, **kwargs):
        """
        Updates an existing semester.
        """
        queryset = self.get_queryset()
        semester = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(semester, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, pk=None, *args, **kwargs):
        """
        Deletes a semester.
        """
        queryset = self.get_queryset()
        semester = get_object_or_404(queryset, pk=pk)
        self.perform_destroy(semester)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        """
        Saves the new semester instance.
        """
        serializer.save()

    def perform_update(self, serializer):
        """
        Updates the semester instance.
        """
        serializer.save()

    def perform_destroy(self, instance):
        """
        Deletes the semester instance.
        """
        instance.delete()



class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = CourseSerializer

    def get_queryset(self):
        """Filter courses by semester type and level based on query parameters."""
        user = self.request.user

        # Base queryset: Allow access to all courses for superusers
        if user.is_superuser:
            queryset = Course.objects.all()
        else:
            queryset = super().get_queryset()

        # Get query parameters
        semester_type = self.request.query_params.get("semester")
        academic_level = self.request.query_params.get("level")

        # Filter by semester type (simple field filter)
        if semester_type:
            queryset = queryset.filter(semester=semester_type)

        # Filter by academic level (simple field filter)
        if academic_level:
            queryset = queryset.filter(academicLevel=academic_level)

        return queryset

    def perform_create(self, serializer):
        """Ensure courses are associated with the user who created them."""
        serializer.save(user=self.request.user)





class FixedClassScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = FixedClassScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FixedClassSchedule.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = FixedClassScheduleSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        for item in serializer.validated_data:
            FixedClassSchedule.objects.create(user=self.request.user, **item)


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
        semester_id = data['semester']

        # Clear existing data
        StudyBlock.objects.filter(user=user).delete()

        # Get semester information from database using semester_id

        try:
            semester = Semester.objects.get(id=semester_id)
            semester_start = semester.start_date
            semester_end = semester.end_date
        except Semester.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Semester not found'}, status=status.HTTP_404_NOT_FOUND)

        # Generate timetable with correct parameters
        study_blocks = generate_timetable(user, semester_start, semester_end, semester_id)

        # Save to database
        for block in study_blocks:
            study_block = StudyBlock.objects.create(
                user=user,
                course=block.course,
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
                args=[study_block.id],
                eta=notification_time
            )

        return JsonResponse({'status': 'success', 'blocks_created': len(study_blocks)}, status=status.HTTP_200_OK)
