from django.contrib.auth.models import AbstractUser
from django.db import models


class UserModel(AbstractUser):
    class Meta:
        db_table = 'user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-pk']

    """
    status=0 olan login olamayacak 
    status=1 olan admin post put deleted yetkileri var ama user yetkileri yok.
    status=2 süper admin tüm yetkiler var
    """
    STATUS = (
        (0, 'Customer'),
        (1, 'Admin'),
        (2, 'Super Admin')
    )

    full_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    status = models.IntegerField(choices=STATUS, default=0, null=True, blank=True)
    is_staff = models.BooleanField(default=False, null=True, blank=True)
    is_active = models.BooleanField(default=True, null=True, blank=True)
    login_attempt = models.IntegerField(default=0, null=True, blank=True)
    is_verified = models.BooleanField(default=False, null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    token = models.CharField(max_length=255, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return self.email
