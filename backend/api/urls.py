from django.urls import path
from .views import (
    CustomTokenObtainPairView, UserRegistrationView, UserProfileView,
    CourseListView, CourseDetailView, EnrollmentListView, EnrollmentDetailView,
    AssignmentListView, AssignmentDetailView, SubmissionListView, SubmissionDetailView,
    StudyGroupListView, StudyGroupDetailView, StudyGroupMessageListView,
    CareerTestListView, CareerTestDetailView, ExamSlipProcessor
)

urlpatterns = [
    # Authentication
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', UserRegistrationView.as_view(), name='register'),

    # User Profile
    path('profile/', UserProfileView.as_view(), name='profile'),

    # Courses
    path('courses/', CourseListView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Enrollments
    path('enrollments/', EnrollmentListView.as_view(), name='enrollment-list'),
    path('enrollments/<int:pk>/', EnrollmentDetailView.as_view(), name='enrollment-detail'),

    # Assignments
    path('assignments/', AssignmentListView.as_view(), name='assignment-list'),
    path('assignments/<int:pk>/', AssignmentDetailView.as_view(), name='assignment-detail'),

    # Submissions
    path('submissions/', SubmissionListView.as_view(), name='submission-list'),
    path('submissions/<int:pk>/', SubmissionDetailView.as_view(), name='submission-detail'),

    # Study Groups
    path('study-groups/', StudyGroupListView.as_view(), name='study-group-list'),
    path('study-groups/<int:pk>/', StudyGroupDetailView.as_view(), name='study-group-detail'),
    path('study-groups/<int:study_group_id>/messages/', StudyGroupMessageListView.as_view(), name='study-group-messages'),

    # Career Tests
    path('career-tests/', CareerTestListView.as_view(), name='career-test-list'),
    path('career-tests/<int:pk>/', CareerTestDetailView.as_view(), name='career-test-detail'),

    # Exam Slip Processing
    path('process-exam-slip/', ExamSlipProcessor.as_view(), name='process-exam-slip'),
]
