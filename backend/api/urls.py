from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserInfoView, RegistrationView, LoginView, LogoutView,
    CookieTokenRefreshView, GoogleAuthView, GenerateTimetable, save_fcm_token,
    SemesterViewSet, CourseViewSet, FixedClassScheduleViewSet,
    StudyBlockViewSet, UserPreferencesViewSet, SemesterOperationViewSet, CommunityProposalView,
    GroupViewSet,
    MessageViewSet,
    ReactionViewSet,
    GroupChatViewSet,
    GroupMembershipViewSet,
    GroupMessageViewSet,
    UserProfileUpdateView,
    EventViewSet
)


router = DefaultRouter()
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'semesters-operation', SemesterOperationViewSet, basename='semester-operations')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'fixed-schedules', FixedClassScheduleViewSet, basename='fixed-schedule')
router.register(r'study-blocks', StudyBlockViewSet, basename='study-block')
router.register(r'preferences', UserPreferencesViewSet, basename='preferences')
router.register(r'events', EventViewSet, basename='event')



router.register(r'groups', GroupViewSet, basename='group')
# Nested routers for messages and reactions
groups_router = DefaultRouter()
groups_router.register(r'messages', MessageViewSet, basename='group-message')

messages_router = DefaultRouter()
messages_router.register(r'reactions', ReactionViewSet, basename='message-reaction')

router.register(r'group-chats', GroupChatViewSet, basename='groupchat')
router.register(r'group-memberships', GroupMembershipViewSet, basename='groupmembership')
router.register(r'group-messages', GroupMessageViewSet, basename='groupmessage')

urlpatterns = [
    path('', include(router.urls)),
    path('groups/', GroupViewSet.as_view({'get': 'list', 'post': 'create'}), name='group-list-create'),
    path('groups/<int:pk>/', GroupViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='group-detail'),
    path('user/profile/', UserProfileUpdateView.as_view(), name='user-profile'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('save-fcm-token/', save_fcm_token, name='save_fcm_token'),
    path('google-auth/', GoogleAuthView.as_view(), name='google-auth'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='refresh-token'),
    path('generate-timetable/', GenerateTimetable.as_view(), name='generate-timetable'),
    path('community/proposals/', CommunityProposalView.as_view(), name='community-proposals'),
  
]
   
