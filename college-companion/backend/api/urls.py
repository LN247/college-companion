from django.urls import path
from .views import UserInfoView,RegistrationView,LoginView,LogoutView,CookieTokenRefreshView,GoogleAuthView,GenerateTimetable


urlpatterns = [
 path('user-info/',UserInfoView.as_view(),name='user-info'),
 path('register/',RegistrationView.as_view(),name='register'),
 path('login/',LoginView.as_view(),name='login'),
 path('google-auth/',GoogleAuthView.as_view(),name='google-auth'),
 path('refresh/',CookieTokenRefreshView.as_view(),name='refresh-token'),
 path('generate-timetable/',GenerateTimetable.as_view(), name='generate-timetable'),
 path('logout/',LogoutView.as_view(),name='logout')
]
   
