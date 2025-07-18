# Generated by Django 5.2.1 on 2025-06-25 12:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_alter_fixedclassschedule_day_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='studyblock',
            options={},
        ),
        migrations.RemoveIndex(
            model_name='studyblock',
            name='api_studybl_date_6cf0da_idx',
        ),
        migrations.RemoveField(
            model_name='studyblock',
            name='date',
        ),
        migrations.RemoveField(
            model_name='studyblock',
            name='is_completed',
        ),
        migrations.RemoveField(
            model_name='studyblock',
            name='is_notified',
        ),
        migrations.AddField(
            model_name='studyblock',
            name='day',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='studyblock',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.course'),
        ),
        migrations.AlterField(
            model_name='studyblock',
            name='semester',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.semester'),
        ),
        migrations.AlterField(
            model_name='studyblock',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userpreferences',
            name='off_days',
            field=models.CharField(blank=True, default='Sunday', help_text="Comma-separated days the user doesn't study ", max_length=27),
        ),
    ]
