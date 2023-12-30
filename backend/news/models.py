import os

from django.db import models

from user.models import UserModel


class NewsModel(models.Model):
    class Meta:
        db_table = 'news'
        verbose_name = 'News'
        verbose_name_plural = 'News'
        ordering = ['-pk']

    title_tr = models.CharField(max_length=255, blank=True, null=True)
    title_en = models.CharField(max_length=255, blank=True, null=True)
    title_ar = models.CharField(max_length=255, blank=True, null=True)

    content_tr = models.TextField(blank=True, null=True)
    content_en = models.TextField(blank=True, null=True)
    content_ar = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='news_images', blank=True, null=True)

    is_active = models.BooleanField(default=True, null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=True, blank=True)

    created_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='created_news')
    updated_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='updated_news')
    deleted_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='deleted_news')

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return str(self.title_tr) + " - " + str(self.title_en) + " - " + str(self.title_ar)

    def save(self, *args, **kwargs):
        if self.pk and self.image:
            try:
                old_image = NewsModel.objects.get(pk=self.pk).image
                if old_image and old_image != self.image:
                    if os.path.isfile(old_image.path):
                        os.remove(old_image.path)
            except NewsModel.DoesNotExist:
                pass

        super(NewsModel, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        if self.image:
            image_path = self.image.path
            if os.path.isfile(image_path):
                os.remove(image_path)

        super().delete(*args, **kwargs)
