from django.db import models

from user.models import UserModel


class SiteSettingsModel(models.Model):
    class Meta:
        db_table = "site_settings"
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"

    title = models.CharField(max_length=255, blank=True, null=True)
    about_us_tr = models.TextField(blank=True, null=True)
    about_us_en = models.TextField(blank=True, null=True)
    about_us_ar = models.TextField(blank=True, null=True)

    # İletişim bilgileri
    phone = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    # Sosyal medya hesapları
    facebook = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)
    twitter = models.CharField(max_length=255, blank=True, null=True)
    linkedin = models.CharField(max_length=255, blank=True, null=True)
    google = models.CharField(max_length=255, blank=True, null=True)
    youtube = models.CharField(max_length=255, blank=True, null=True)

    is_active = models.BooleanField(default=True, null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=True, blank=True)

    created_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='created_site_settings')
    updated_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='updated_site_settings')
    deleted_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='deleted_site_settings')

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f" {self.title} "
