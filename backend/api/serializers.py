from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import  authenticate
from .models import CustomUser, Semester, Course, FixedClassSchedule, StudyBlock, UserPreferences


class CustomUserSerializer(ModelSerializer):
    
    class Meta:
        model = CustomUser
        fields = ( 'id','username','email','is_superuser')


class RegistrationSerializer(ModelSerializer):
    class Meta:
        model=CustomUser
        fields=( 'username' ,'email','password')
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

class SemesterSerializer(serializers.ModelSerializer):

    status = serializers.SerializerMethodField()
    start_date = serializers.DateField(format="%Y-%m-%d")  # Output format
    end_date = serializers.DateField(format="%Y-%m-%d")  # Output format

    class Meta:
        model = Semester
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at')
    
    def get_status(self, obj):
        return obj.status  # Use the property we defined in the model
    
    def create(self, validated_data):
        # Set the creator to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class CourseSerializer(serializers.ModelSerializer):



    class Meta:
            model = Course
            fields = ['id', 'name', 'credits', 'semester','code','academicLevel']  # Include semester in fields



    def create(self, validated_data):
        # Set the creator to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)



class FixedClassScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FixedClassSchedule
        fields = ['course', 'day', 'start_time', 'end_time', 'semester', 'difficulty_level']
        # read_only_fields = ['user'] # Removed read_only_fields so user will be handled during serializer.save()

    def create(self, validated_data):
        return FixedClassSchedule.objects.create(**validated_data)


class StudyBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyBlock
        fields = ['id', 'course', 'date', 'start_time', 'end_time', 'is_completed', 'is_notified']
        read_only_fields = ['user']



class UserPreferencesSerializer(serializers.ModelSerializer):

    semester = SemesterSerializer(read_only=True)
    class Meta:
        model = UserPreferences
        fields = [
            'id', 'preferred_study_hours_per_day', 'off_days',
            'study_start_min', 'study_end_max', 'notification_reminder_minutes','semester'
        ]
        read_only_fields = ['user']