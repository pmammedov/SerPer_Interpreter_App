import os

from django.db import models

from user.models import UserModel


class Languages(models.Model):
    class Meta:
        db_table = 'languages'
        verbose_name = 'Languages'
        verbose_name_plural = 'Languages'
        ordering = ['-pk']

    name_tr = models.CharField(max_length=255, blank=True, null=True)
    name_en = models.CharField(max_length=255, blank=True, null=True)
    name_ar = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='languages_images', blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)

    is_active = models.BooleanField(default=True, null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=True, blank=True)

    created_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='created_languages')
    updated_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='updated_languages')
    deleted_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='deleted_languages')

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return str(self.name_tr) + " - " + str(self.name_en) + " - " + str(self.name_ar)

    def save(self, *args, **kwargs):
        if self.pk and self.image:
            try:
                old_image = Languages.objects.get(pk=self.pk).image
                if old_image and old_image != self.image:
                    if os.path.isfile(old_image.path):
                        os.remove(old_image.path)
            except Languages.DoesNotExist:
                pass

        super(Languages, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.image:
            image_path = self.image.path
            if os.path.isfile(image_path):
                os.remove(image_path)

        super().delete(*args, **kwargs)
