from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserInfoView, RegistrationView, LoginView, LogoutView,
    CookieTokenRefreshView, GoogleAuthView,
    SemesterViewSet, CourseViewSet, FixedClassScheduleViewSet,
    StudyBlockViewSet, UserPreferencesViewSet
)



router = DefaultRouter()
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'fixed-schedules', FixedClassScheduleViewSet, basename='fixed-schedule')
router.register(r'study-blocks', StudyBlockViewSet, basename='study-block')
router.register(r'preferences', UserPreferencesViewSet, basename='preferences')

urlpatterns = [
    path('', include(router.urls)),
    path('user/info/', UserInfoView.as_view(), name='user-info'),
    path('auth/register/', RegistrationView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', CookieTokenRefreshView.as_view(), name='token-refresh'),
    path('auth/google/', GoogleAuthView.as_view(), name='google-auth'),
]
   
