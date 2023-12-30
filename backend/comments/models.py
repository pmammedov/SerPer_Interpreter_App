from django.db import models

from user.models import UserModel


class Comments(models.Model):
    class Meta:
        db_table = 'comments'
        verbose_name = 'Comments'
        verbose_name_plural = 'Comments'
        ordering = ['-pk']

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    comment = models.TextField()

    is_active = models.BooleanField(default=False, null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=True, blank=True)

    updated_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='updated_comments')

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"
