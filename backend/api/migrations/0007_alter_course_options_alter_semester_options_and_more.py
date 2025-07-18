# Generated by Django 5.2.1 on 2025-06-13 16:48

import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_remove_course_color_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='course',
            options={'ordering': ['level', 'code']},
        ),
        migrations.AlterModelOptions(
            name='semester',
            options={'ordering': ['-year', 'start_date']},
        ),
        migrations.AlterUniqueTogether(
            name='course',
            unique_together={('semester', 'code')},
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='username',
        ),
        migrations.AddField(
            model_name='course',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='course',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_courses', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='course',
            name='level',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='course',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='semester',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='semester',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_semesters', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='semester',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AddField(
            model_name='semester',
            name='year',
            field=models.PositiveIntegerField(help_text='Year of the semester (e.g., 2023)', null=True, validators=[django.core.validators.MinValueValidator(2000), django.core.validators.MaxValueValidator(2100)]),
        ),
        migrations.AlterField(
            model_name='course',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='course', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='semester',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='semesters', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='semester',
            unique_together={('name', 'year')},
        ),
        migrations.RemoveField(
            model_name='course',
            name='difficulty',
        ),
    ]
