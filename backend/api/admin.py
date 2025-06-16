from django.contrib import admin
from .models import Semester, Course

class CourseInline(admin.TabularInline):
    model = Course
    extra = 0
    fields = ('name', 'code', 'academicLevel', 'credits')
    readonly_fields = ('created_by',)


@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('name', 'year', 'start_date', 'end_date', 'is_active', 'status')
    list_filter = ('year', 'is_active')
    search_fields = ('name',)
    fields = ('name', 'start_date', 'end_date')
    readonly_fields = ('status', 'created_by')
    

    def has_add_permission(self, request):
        # Allow adding in admin only for superusers
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        # Allow changing in admin only for superusers
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        # Allow deleting in admin only for superusers
        return request.user.is_superuser


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'academicLevel', 'credits', 'semester')
    list_filter = ('academicLevel', 'semester')
    search_fields = ('name', 'code')
    readonly_fields = ('created_by',)

    def save_model(self, request, obj, form, change):
        if not change:  # Only set creator when first creating
            obj.created_by = request.user
        super().save_model(request, obj, form, change)