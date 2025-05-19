from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserCreateSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            response.set_cookie(
                'access_token',
                response.data['access'],
                httponly=True,
                secure=False,  # Disable in dev (enable in prod)
                samesite='Strict',
                max_age=30 * 60,
            )
            response.set_cookie(
                'refresh_token',
                response.data['refresh'],
                httponly=True,
                secure=False,
                samesite='Strict',
                max_age=1 * 24 * 60 * 60,
            )
            
        return response


class createUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": serializer.data,
            "message": "User created successfully"
        })


class updateUserView(generics.UpdateAPIView):
          queryset = User.objects.all()   
          serializer_class= UserCreateSerializer
          permission_classes = [IsAuthenticated]

          def put(self, request, *args, **kwargs):
                user = self.get_object()
                serializer = self.get_serializer(user, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                user = serializer.save()
                return Response({
                    "user": serializer.data,
                    "message": "User updated successfully"
                })
            