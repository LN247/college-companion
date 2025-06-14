from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserInfoView, RegistrationView, LoginView, LogoutView,
    CookieTokenRefreshView, GoogleAuthView,GenerateTimetable,save_fcm_token,
    SemesterViewSet, CourseViewSet, FixedClassScheduleViewSet,
    StudyBlockViewSet, UserPreferencesViewSet, CommunityProposalView
)



router = DefaultRouter()
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'fixed-schedules', FixedClassScheduleViewSet, basename='fixed-schedule')
router.register(r'study-blocks', StudyBlockViewSet, basename='study-block')
router.register(r'preferences', UserPreferencesViewSet, basename='preferences')

urlpatterns = [
    path('', include(router.urls)),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
    path('register/', RegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('save-fcm-token/', save_fcm_token, name='save_fcm_token'),
    path('google-auth/', GoogleAuthView.as_view(), name='google-auth'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='refresh-token'),
    path('generate-timetable/', GenerateTimetable.as_view(), name='generate-timetable'),
    path('community/proposals/', CommunityProposalView.as_view(), name='community-proposals'),
    path('community/proposals/<int:course_id>/', CommunityProposalView.as_view(), name='course-community-proposals'),
]
   
