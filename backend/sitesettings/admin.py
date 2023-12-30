from django.contrib import admin

from sitesettings.models import SiteSettingsModel


class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'title', 'phone', 'email', 'is_active']
    list_filter = ['is_active', 'created_at', 'updated_at']
    search_fields = ['title']
    ordering = ['-updated_at']

    fieldsets = (
        ('General Information', {
            'fields': ('title', 'about_us')
        }),
        ('Contact Details', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Social Media', {
            'fields': ('facebook', 'instagram', 'twitter', 'google', 'linkedin', 'youtube')
        }),
        ('Status', {
            'fields': ('is_active', 'is_deleted')
        }),
    )


admin.site.register(SiteSettingsModel, SiteSettingsAdmin)
