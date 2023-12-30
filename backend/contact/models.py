import os

from django.db import models

from user.models import UserModel


class ContactMessage(models.Model):
    class Meta:
        db_table = 'contact_messages'
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
        ordering = ['-pk']

    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=255, null=True, blank=True)

    title = models.CharField(max_length=255)
    message = models.TextField()
    file_path = models.FileField(upload_to='contact_messages', null=True, blank=True)

    reply = models.TextField(null=True, blank=True)
    is_reply = models.BooleanField(default=False, null=True, blank=True)
    reply_at = models.DateTimeField(null=True, blank=True)
    reply_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                 related_name='replied_contact_messages')

    is_active = models.BooleanField(default=False, null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=True, blank=True)

    updated_by = models.ForeignKey(UserModel, on_delete=models.SET_NULL, null=True,
                                   related_name='updated_contact_messages')

    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.title}"

    def delete(self, *args, **kwargs):
        if self.file_path:
            file_path = self.file_path.path
            if os.path.isfile(file_path):
                os.remove(file_path)

        super().delete(*args, **kwargs)
