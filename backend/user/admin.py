from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from user.models import UserModel


class UserModelAdmin(UserAdmin):
    list_display = ['id', 'email', 'full_name', 'is_staff', 'is_active', 'is_verified', 'is_deleted', 'created_at',
                    'updated_at']
    list_filter = ['is_staff', 'is_active', 'is_verified', 'is_deleted']
    search_fields = ['email', 'full_name']
    readonly_fields = ['created_at', 'updated_at']

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2', 'is_staff', 'is_active')}
         ),
    )
    fieldsets = (
        (None, {'fields': ('email', 'password', 'full_name')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_verified', 'is_deleted')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
        ('Additional info', {'fields': ('total_amount',)}),
    )
    ordering = ('-pk',)


admin.site.register(UserModel, UserModelAdmin)
