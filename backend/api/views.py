from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import (
    Course, Enrollment, Assignment, Submission,
    StudyGroup, StudyGroupMessage, CareerTest, UserProfile
)
from .serializers import (
    UserCreateSerializer, UserSerializer, UserProfileSerializer,
    CourseSerializer, EnrollmentSerializer, AssignmentSerializer,
    SubmissionSerializer, StudyGroupSerializer, StudyGroupMessageSerializer,
    CareerTestSerializer, CustomTokenObtainPairSerializer
)
import cv2
import numpy as np
import pytesseract
from PIL import Image
import io

# Set Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Authentication Views
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response.set_cookie(
                'access_token',
                response.data['access'],
                httponly=True,
                secure=False,
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

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user).data,
            "message": "User created successfully"
        })

# User Profile Views
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return UserProfile.objects.get_or_create(user=self.request.user)[0]

# Course Views
class CourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

# Enrollment Views
class EnrollmentListView(generics.ListCreateAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class EnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)

# Assignment Views
class AssignmentListView(generics.ListCreateAPIView):
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        course_id = self.request.query_params.get('course_id')
        if course_id:
            return Assignment.objects.filter(course_id=course_id)
        return Assignment.objects.none()

class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

# Submission Views
class SubmissionListView(generics.ListCreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Submission.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class SubmissionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(student=self.request.user)

# Study Group Views
class StudyGroupListView(generics.ListCreateAPIView):
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyGroup.objects.filter(members=self.request.user)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, members=[self.request.user])

class StudyGroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return StudyGroup.objects.filter(members=self.request.user)

class StudyGroupMessageListView(generics.ListCreateAPIView):
    serializer_class = StudyGroupMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        study_group_id = self.kwargs.get('study_group_id')
        return StudyGroupMessage.objects.filter(study_group_id=study_group_id)

    def perform_create(self, serializer):
        study_group_id = self.kwargs.get('study_group_id')
        serializer.save(
            study_group_id=study_group_id,
            sender=self.request.user
        )

# Career Test Views
class CareerTestListView(generics.ListCreateAPIView):
    serializer_class = CareerTestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CareerTest.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class CareerTestDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CareerTestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CareerTest.objects.filter(student=self.request.user)

# Exam Slip Processing View
class ExamSlipProcessor(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            image_file = request.FILES.get('exam_slip')
            if not image_file:
                return Response({'error': 'No image file provided'}, status=400)

            try:
                image_bytes = image_file.read()
                nparr = np.frombuffer(image_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                if img is None:
                    return Response({'error': 'Failed to decode image'}, status=400)
            except Exception as e:
                return Response({'error': f'Error processing image: {str(e)}'}, status=400)

            try:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
            except Exception as e:
                return Response({'error': f'Error preprocessing image: {str(e)}'}, status=400)

            try:
                text = pytesseract.image_to_string(thresh)
                if not text.strip():
                    return Response({'error': 'No text could be extracted from the image'}, status=400)
            except Exception as e:
                return Response({'error': f'Error during OCR processing: {str(e)}'}, status=400)

            subjects = self.extract_subjects(text)
            
            return Response({
                'success': True,
                'subjects': subjects,
                'raw_text': text
            })

        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            return Response({
                'success': False,
                'error': str(e),
                'error_details': error_details
            }, status=500)

    def extract_subjects(self, text):
        subjects = []
        lines = text.split('\n')
        
        for line in lines:
            if any(keyword in line.lower() for keyword in ['math', 'physics', 'chemistry', 'biology', 'computer']):
                subjects.append(line.strip())
        
        return subjects
            