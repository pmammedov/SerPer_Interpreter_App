from django.contrib import admin

from portfolio.models import PortfolioModel


class PortfolioAdmin(admin.ModelAdmin):
    list_display = ['id', 'title_tr', 'title_en', 'title_ar', 'is_active', 'is_deleted']
    list_filter = ['is_active', 'is_deleted', 'created_at', 'updated_at']
    search_fields = ['title_tr', 'title_en', 'title_ar']
    ordering = ['-id']

    fieldsets = (
        ('General Information', {
            'fields': ('title_tr', 'title_en', 'title_ar', 'content_tr', 'content_en', 'content_ar', 'image')
        }),
        ('Status', {
            'fields': ('is_active', 'is_deleted')
        }),
    )


admin.site.register(PortfolioModel, PortfolioAdmin)
