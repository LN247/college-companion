from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from django.contrib.auth import  authenticate
from .models import CustomUser, Semester, Course, FixedClassSchedule, StudyBlock, UserPreferences, GroupChat, GroupMembership, GroupMessage
from rest_framework import serializers
from .models import (
    Group,
    GroupMembership,
    Message,
    MessageContent,
    FileUpload,
    Reaction
)
from django.contrib.auth import get_user_model


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
            fields = ['id', 'name', 'credits', 'semester','code','academicLevel'] 



    def create(self, validated_data):
        # Set the creator to the current user
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)



class FixedClassScheduleSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    class Meta:
        model = FixedClassSchedule
        fields = ['course', 'day', 'start_time', 'end_time', 'semester', 'difficulty_level', 'course_name']
        read_only_fields = ['user', 'course_name']

    def create(self, validated_data):
        return FixedClassSchedule.objects.create(**validated_data)


class StudyBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyBlock
        fields = ['id', 'course',  'start_time', 'end_time', 'is_completed', 'is_notified']
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
class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ['id', 'file', 'file_type', 'file_size', 'uploaded_at']
        read_only_fields = ['file_type', 'file_size', 'uploaded_at']

class MessageContentSerializer(serializers.ModelSerializer):
    file = FileUploadSerializer(read_only=True)
    
    class Meta:
        model = MessageContent
        fields = ['id', 'content_type', 'content', 'file', 'order']

class ReactionSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Reaction
        fields = ['id', 'user', 'reaction_type', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    sender = CustomUserSerializer(read_only=True)
    contents = MessageContentSerializer(many=True, read_only=True)
    reactions = ReactionSerializer(many=True, read_only=True)
    is_read = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 
            'sender', 
            'group', 
            'timestamp',
            'contents',
            'reactions',
            'is_read'
        ]
    
    def get_is_read(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.group.memberships.filter(
                user=request.user,
                last_read__gte=obj.timestamp
            ).exists()
        return False

class GroupMembershipSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = GroupMembership
        fields = [
            'id',
            'user',
            'group',
            'joined_at',
            'role',
            'last_read'
        ]
        read_only_fields = ['joined_at', 'last_read']

class GroupSerializer(serializers.ModelSerializer):
    created_by = CustomUserSerializer(read_only=True)
    memberships = GroupMembershipSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = [
            'id',
            'name',
            'description',
            'created_at',
            'created_by',
            'cover_image',
            'memberships',
            'member_count',
            'is_member',
            'user_role',
            'last_message'
        ]
        read_only_fields = ['created_at', 'created_by']
    
    def get_member_count(self, obj):
        return obj.memberships.count()
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.memberships.filter(user=request.user).exists()
        return False
    
    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            membership = obj.memberships.filter(user=request.user).first()
            return membership.role if membership else None
        return None
    
    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return MessageSerializer(last_message, context=self.context).data
        return None

class GroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['name', 'description', 'cover_image']
    
    def create(self, validated_data):
        request = self.context.get('request')
        group = Group.objects.create(
            created_by=request.user,
            **validated_data
        )
        # Add creator as admin
        GroupMembership.objects.create(
            user=request.user,
            group=group,
            role='admin'
        )
        return group

class GroupJoinSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

class GroupRoleUpdateSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    role = serializers.ChoiceField(choices=GroupMembership.ROLE_CHOICES)

class MessageCreateSerializer(serializers.Serializer):
    content_type = serializers.ChoiceField(choices=MessageContent.CONTENT_TYPES)
    content = serializers.CharField(required=False, allow_blank=True)
    file = serializers.FileField(required=False)

class ReactionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ['reaction_type']

class GroupChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupChat
        fields = ['id', 'name', 'created_by', 'created_at']
        read_only_fields = ['created_by', 'created_at']

class GroupMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = ['id', 'group', 'user', 'content', 'timestamp']
        read_only_fields = ['user', 'timestamp']