from django.contrib import admin

from languages.models import Languages


class LanguagesAdmin(admin.ModelAdmin):
    list_display = ['id', 'name_tr', 'order', 'is_active', 'is_deleted']
    list_filter = ['is_active', 'is_deleted', 'created_at', 'updated_at']
    search_fields = ['name']
    ordering = ['-id']

    fieldsets = (
        ('General Information', {
            'fields': ('name_tr', 'name_en', 'name_ar', 'image', 'order')
        }),
        ('Status', {
            'fields': ('is_active', 'is_deleted')
        }),
    )


admin.site.register(Languages, LanguagesAdmin)
