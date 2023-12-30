from django.contrib import admin

from contact.models import ContactMessage


class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'first_name', 'last_name', 'email', 'phone', 'is_active', 'is_deleted', 'reply']
    list_filter = ['is_active', 'is_deleted', 'created_at', 'updated_at']
    search_fields = ['title', 'email', 'first_name', 'last_name']
    ordering = ['-id']
    fieldsets = (
        ('General Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'title', 'message', 'file_path')
        }),
        ('Reply', {
            'fields': ('reply',)
        }),
        ('Status', {
            'fields': ('is_active', 'is_deleted')
        }),
    )


admin.site.register(ContactMessage, ContactMessageAdmin)
