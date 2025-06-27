from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from .models import UserProfile

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get('access_token')

        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
        except AuthenticationFailed as e:
            raise AuthenticationFailed(f"Token Authentication failed: {str(e)}")

        try:
            user = self.get_user(validated_token)
            return user, validated_token
        except AuthenticationFailed as e:
            raise AuthenticationFailed(f"Error retrieving user: {str(e)}")






class CustomAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            # Dynamically fetch the field defined by USERNAME_FIELD (e.g., email)
            user = UserModel.objects.get(**{UserModel.USERNAME_FIELD: username})
            if user.check_password(password):
                # Ensure the UserProfile exists
                if not hasattr(user, 'profile'):
                    UserProfile.objects.create(user=user)
                return user
        except UserModel.DoesNotExist:
            return None
        return None
