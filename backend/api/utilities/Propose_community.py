from ..models import CustomUser, FixedClassSchedule,  GroupMembership, Group
from django.db.models import Q
from datetime import timedelta, date

def propose_community(user_id, course_id=None):
    try:
        user = CustomUser.objects.get(id=user_id)
        today = date.today()
        next_week = today + timedelta(days=7)

        #  Try to match users with same major and minor
        matching_users = CustomUser.objects.filter(
            major=user.major,
            minor=user.minor
        ).exclude(id=user.id)

        if matching_users.exists():
            # Look for groups they are already in
            group_ids = GroupMembership.objects.filter(user__in=matching_users).values_list('group_id', flat=True)
            if group_ids:
                groups = Group.objects.filter(id__in=group_ids).distinct()
                if groups.exists():
                    return {
                        'status': 'success',
                        'reason': 'related field of study',
                        'communities': [
                            {
                                'group_id': group.id,
                                'name': group.name,
                                'members': [
                                    {
                                        'id': member.id,
                                        'username': member.username
                                    } for member in CustomUser.objects.filter(groupmembership__group=group)
                                ]
                            }
                            for group in groups
                        ]
                    }

        # Match users with shared courses
        if course_id:
            user_courses = FixedClassSchedule.objects.filter(user=user, course__id=course_id).values_list('course', flat=True)
        else:
            user_courses = FixedClassSchedule.objects.filter(user=user).values_list('course', flat=True)

        if user_courses:
            other_users = CustomUser.objects.filter(
                fixedclassschedule__course__in=user_courses
            ).exclude(id=user.id).distinct()

            if other_users.exists():
                common_group_ids = GroupMembership.objects.filter(user__in=other_users).values_list('group_id', flat=True)
                groups = Group.objects.filter(id__in=common_group_ids)
                if groups.exists():
                    return {
                        'status': 'success',
                        'reason': 'shared courses',
                        'communities': [
                            {
                                'group_id': group.id,
                                'name': group.name,
                                'members': [
                                    {
                                        'id': member.id,
                                        'username': member.username
                                    } for member in CustomUser.objects.filter(groupmembership__group=group)
                                ]
                            }
                            for group in groups
                        ]
                    }

        # Fallbak: Random group suggestion
        random_group = Group.objects.order_by('?').first()
        if random_group:
            return {
                'status': 'success',
                'reason': 'random suggestion',
                'communities': [
                    {
                        'group_id': random_group.id,
                        'name': random_group.name,
                        'members': [
                            {
                                'id': member.id,
                                'username': member.username
                            } for member in CustomUser.objects.filter(groupmembership__group=random_group)
                        ]
                    }
                ]
            }

        return {
            'status': 'error',
            'message': 'No suitable communities available at the moment.'
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
