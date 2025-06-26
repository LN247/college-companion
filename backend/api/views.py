from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.generics import RetrieveUpdateAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import UserPreferences, Course,CustomUser, StudyBlock,CustomUser,UserProfile, GroupChat, GroupMembership, GroupMessage,Roadmap, ExpertAdvice, CollegeResource,Discipline
from rest_framework.views import APIView
from django.core.cache import cache 
from .serializers import UserResourcesSerializer
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
from .models import (CustomUser,Semester, Course, FixedClassSchedule, StudyBlock, UserPreferences,Group,GroupMembership, Message,MessageContent,FileUpload,Reaction)
from django.conf import settings
from .serializers import (
    SemesterSerializer, CourseSerializer, FixedClassScheduleSerializer,
    StudyBlockSerializer, UserPreferencesSerializer,GroupSerializer,
    GroupCreateSerializer,
    GroupMembershipSerializer,
    GroupJoinSerializer,
    GroupRoleUpdateSerializer,
    MessageSerializer,
    MessageCreateSerializer,
    MessageContentSerializer,
    ReactionSerializer,
    ReactionCreateSerializer,
    GroupChatSerializer,
    GroupMessageSerializer,
    CustomUserSerializer,
    RegistrationSerializer,
    LoginSerializer,
    GoogleAuthSerializer, ReactionCreateSerializer,
    GroupChatSerializer, GroupMessageSerializer, CustomUserSerializer,
    RegistrationSerializer, LoginSerializer, GoogleAuthSerializer
)




from .utilities.Propose_community import propose_community

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
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return GroupCreateSerializer
        return GroupSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Group.objects.filter(
            memberships__user=user
        ).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        group = self.get_object()
        serializer = GroupJoinSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            user = get_object_or_404(User, id=user_id)
            
            if not group.memberships.filter(user=user).exists():
                GroupMembership.objects.create(
                    user=user,
                    group=group,
                    role='member'
                )
                return Response({'status': 'user added to group'}, status=status.HTTP_201_CREATED)
            return Response({'error': 'user already in group'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def update_role(self, request, pk=None):
        group = self.get_object()
        serializer = GroupRoleUpdateSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data['user_id']
            role = serializer.validated_data['role']
            
            # Check if requester is admin
            requester_membership = group.memberships.get(user=request.user)
            if requester_membership.role != 'admin':
                return Response(
                    {'error': 'Only group admins can update roles'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            membership = get_object_or_404(
                group.memberships,
                user_id=user_id
            )
            membership.role = role
            membership.save()
            
            return Response(
                GroupMembershipSerializer(membership).data,
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        group = self.get_object()
        memberships = group.memberships.all()
        serializer = GroupMembershipSerializer(memberships, many=True)
        return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        group_id = self.kwargs.get('group_pk')
        user = self.request.user
        
        # Verify user is a member of the group
        if not GroupMembership.objects.filter(
            group_id=group_id,
            user=user
        ).exists():
            return Message.objects.none()
        
        return Message.objects.filter(group_id=group_id).order_by('timestamp')
    
    def create(self, request, *args, **kwargs):
        group_id = kwargs.get('group_pk')
        group = get_object_or_404(Group, id=group_id)
        
        # Verify user is a member of the group
        if not group.memberships.filter(user=request.user).exists():
            return Response(
                {'error': 'You are not a member of this group'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = MessageCreateSerializer(data=request.data)
        if serializer.is_valid():
            content_type = serializer.validated_data['content_type']
            content = serializer.validated_data.get('content', '')
            file = serializer.validated_data.get('file')
            
            # Create message
            message = Message.objects.create(
                sender=request.user,
                group=group
            )
            
            # Handle file upload if present
            file_upload = None
            if file:
                file_upload = FileUpload.objects.create(
                    file=file,
                    file_type=content_type,
                    file_size=file.size
                )
            
            # Create message content
            MessageContent.objects.create(
                message=message,
                content_type=content_type,
                content=content,
                file=file_upload
            )
            
            # Mark as read for sender
            membership = group.memberships.get(user=request.user)
            membership.last_read = message.timestamp
            membership.save()
            
            return Response(
                self.serializer_class(message, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, group_pk=None, pk=None):
        message = self.get_object()
        membership = get_object_or_404(
            GroupMembership,
            group_id=group_pk,
            user=request.user
        )
        
        if membership.last_read < message.timestamp:
            membership.last_read = message.timestamp
            membership.save()
        
        return Response({'status': 'message marked as read'})

class ReactionViewSet(viewsets.ModelViewSet):
    serializer_class = ReactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        message_id = self.kwargs.get('message_pk')
        return Reaction.objects.filter(message_id=message_id)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ReactionCreateSerializer
        return ReactionSerializer
    
    def perform_create(self, serializer):
        message_id = self.kwargs.get('message_pk')
        message = get_object_or_404(Message, id=message_id)
        
        # Verify user is a member of the group
        if not message.group.memberships.filter(user=self.request.user).exists():
            return Response(
                {'error': 'You are not a member of this group'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save(
            user=self.request.user,
            message=message
        )

class GroupSearchView(generics.ListAPIView):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        user = self.request.user
        
        if not query:
            return Group.objects.none()
        
        return Group.objects.filter(
            Q(name__icontains=query) |
            Q(description__icontains=query),
            memberships__user=user
        ).distinct()[:20]



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
                day=block['day'],
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

class CommunityProposalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id=None):
        """
        Get community proposals for the authenticated user.
        Optionally filter by course_id.
        """
        result = propose_community(request.user.id, course_id)
        return Response(result, status=status.HTTP_200_OK if result['status'] == 'success' else status.HTTP_400_BAD_REQUEST)

class GroupChatViewSet(viewsets.ModelViewSet):
    queryset = GroupChat.objects.all()
    serializer_class = GroupChatSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class GroupMembershipViewSet(viewsets.ModelViewSet):
    queryset = GroupMembership.objects.all()
    serializer_class = GroupMembershipSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        group_id = request.data.get('group')
        if GroupMembership.objects.filter(user=request.user, group_id=group_id).exists():
            return Response({'detail': 'Already a member'}, status=status.HTTP_400_BAD_REQUEST)
        membership = GroupMembership.objects.create(user=request.user, group_id=group_id)
        return Response(GroupMembershipSerializer(membership).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        membership = self.get_object()
        if membership.user != request.user:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        membership.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class GroupMessageViewSet(viewsets.ModelViewSet):
    queryset = GroupMessage.objects.all()
    serializer_class = GroupMessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)






from .serializers import UserProfileSerializer

class UserProfileUpdateView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile
    
    def perform_update(self, serializer):
        instance = serializer.save()
        
        # Clear cache when profile changes
        cache_key = f"user_resources:{self.request.user.id}"
        cache.delete(cache_key)
        
        # Create new disciplines if needed
        if instance.major:
            Discipline.objects.get_or_create(
                name=instance.major, 
                defaults={'type': 'MAJOR'}
            )
        if instance.minor:
            Discipline.objects.get_or_create(
                name=instance.minor, 
                defaults={'type': 'MINOR'}
            )



class UserResourcesView(APIView):
    """
    Returns all resources relevant to a user's major and minor
    """
    
    def get(self, request):
        user = request.user
        cache_key = f"user_resources:{user.id}"
        
        # Try Redis cache first
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        # Get user's disciplines
        major = user.profile.major
        minor = user.profile.minor
        
        if not major:
            return Response(
                {"error": "User major not set"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        disciplines = [major]
        if minor:
            disciplines.append(minor)
        
        # Fetch relevant data
        roadmaps = Roadmap.objects.filter(disciplines__in=disciplines).distinct()
        expert_advice = ExpertAdvice.objects.filter(disciplines__in=disciplines).distinct()
        college_resources = CollegeResource.objects.filter(disciplines__in=disciplines).distinct()
        
        # Prepare response data
        data = {
            "roadmaps": roadmaps,
            "expert_advice": expert_advice,
            "college_resources": college_resources
        }
        
        # Serialize data
        serializer = UserResourcesSerializer(data)
        response_data = serializer.data
        
        # Cache for 6 hours (21600 seconds)
        cache.set(cache_key, response_data, 21600)
        
        return Response(response_data)