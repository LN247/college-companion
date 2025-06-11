from django.core.exceptions import ValidationError

def validate_file_size(value):
    max_size = 10 * 1024 * 1024  # 10MB
    if value.size > max_size:
        raise ValidationError('File size must be under 10MB')