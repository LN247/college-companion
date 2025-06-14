#import userprofile and ascheduled courses models and define the proposal community function 

from ..models import CustomUser, Course, StudyBlock
from django.db.models import Q
from datetime import datetime, timedelta

def propose_community(user_id, course_id=None):
    """
    Propose study communities based on user's courses and study blocks.
    
    Args:
        user_id: The ID of the user requesting community proposals
        course_id: Optional course ID to filter proposals for a specific course
    
    Returns:
        list: List of dictionaries containing proposed study communities
    """
    try:
        # Get the user
        user = CustomUser.objects.get(id=user_id)
        
        # Get user's courses
        if course_id:
            user_courses = Course.objects.filter(id=course_id, user=user)
        else:
            user_courses = Course.objects.filter(user=user)
        
        proposed_communities = []
        
        for course in user_courses:
            # Find other users taking the same course
            other_users = CustomUser.objects.filter(
                courses__name=course.name,
                courses__code=course.code
            ).exclude(id=user_id)
            
            # Get study blocks for the course
            study_blocks = StudyBlock.objects.filter(
                course=course,
                date__gte=datetime.now().date(),
                date__lte=datetime.now().date() + timedelta(days=7)
            ).order_by('date', 'start_time')
            
            # Create community proposal
            if other_users.exists():
                community = {
                    'course': {
                        'id': course.id,
                        'name': course.name,
                        'code': course.code
                    },
                    'potential_members': [
                        {
                            'id': other_user.id,
                            'username': other_user.username,
                            'email': other_user.email
                        } for other_user in other_users[:5]  # Limit to 5 potential members
                    ],
                    'upcoming_study_sessions': [
                        {
                            'id': block.id,
                            'date': block.date,
                            'start_time': block.start_time,
                            'end_time': block.end_time
                        } for block in study_blocks[:3]  # Limit to 3 upcoming sessions
                    ],
                    'total_members': other_users.count()
                }
                proposed_communities.append(community)
        
        return {
            'status': 'success',
            'communities': proposed_communities
        }
        
    except CustomUser.DoesNotExist:
        return {
            'status': 'error',
            'message': 'User not found'
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }














