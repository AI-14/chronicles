import uuid

from django.conf import settings
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils import timezone


class UserManager(BaseUserManager):

    def create_superuser(self, email, password, **other_fields):
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError('Superuser must be assigned to is_staff=True')
        if other_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must be assigned to is_superuser=True')

        return self.create_user(email, password, **other_fields)

    def create_user(self, email, password, **other_fields):
        if not email:
            raise ValueError('You must provide an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, password=password, **other_fields)
        user.set_password(password)  # This encrypts the password
        user.is_active = True

        user.save()

        return user


def upload_to_path(instance: 'User', filename: str) -> str:
    user_id: str = instance.id
    return f'{settings.PROFILE_IMAGE_DIR_NAME}/{user_id}-{filename}'


class User(AbstractBaseUser, PermissionsMixin):

    id = models.CharField(primary_key=True, max_length=36,
                          default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=15, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    profile_image = models.ImageField(
        upload_to=upload_to_path, max_length=300, null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self) -> str:
        return self.username


@receiver(post_delete, sender=User)
def delete_profile_image(sender, instance, **kwargs):
    if instance.profile_image:
        instance.profile_image.delete(save=False)
