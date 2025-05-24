

from django.urls import path
from .views import UserInfoView,RegistrationView,LoginView,LogoutView,CookieTokenRefreshView


urlpatterns = [
 path('user-info/',UserInfoView.as_view(),name='user-info'),
 path('register/',RegistrationView.as_view(),name='register'),
 path('login/',LoginView.as_view(),name='login'),
 path('refresh/',CookieTokenRefreshView.as_view(),name='refresh-token'),
 path('logout/',LogoutView.as_view(),name='logout')

]
   
