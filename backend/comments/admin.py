from django.contrib import admin

from comments.models import Comments


class CommentsAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'is_active', 'is_deleted']
    list_filter = ['is_active', 'is_deleted', 'created_at', 'updated_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-id']

    fieldsets = (
        ('General Information', {
            'fields': ('first_name', 'last_name', 'email', 'comment')
        }),
        ('Status', {
            'fields': ('is_active', 'is_deleted')
        }),
    )


admin.site.register(Comments, CommentsAdmin)
