from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import  authenticate
from .models import CustomUser

class CustomUserSerializer(ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ( 'id','email')



class RegistrationSerializer(ModelSerializer):
    class Meta:
        model=CustomUser
        fields=('email','password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user    
    



class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        if user:
            return {'user': user}  
        
        raise serializers.ValidationError('Invalid email or password.')



class GoogleAuthSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    
    def validate(self, data):
        token = data.get('token')
        if not token:
            raise serializers.ValidationError('Token is required')
        return data