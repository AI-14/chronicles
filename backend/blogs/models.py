import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.utils.text import slugify


def upload_to_path(instance: 'Blog', filename: str) -> str:
    user_id: str = instance.author.id
    blog_id: str = instance.id
    return f'{settings.BLOG_IMAGE_DIR_NAME}/{user_id}-{blog_id}-{filename}'


class Blog(models.Model):

    class Meta:
        ordering = ('-created_at',)

    class Status(models.TextChoices):
        DRAFT = 'draft', 'DRAFT'
        PUBLISH = 'publish', 'PUBLISH'

    class Category(models.TextChoices):
        ARTS = 'arts', 'ARTS'
        GAMES = 'games', 'GAMES'
        HOME = 'home', 'HOME'
        HEALTH = 'health', 'HEALTH'
        TECHNOLOGY = 'technology', 'TECHNOLOGY'
        RECREATION = 'recreation', 'RECREATION'
        BUSINESS = 'business', 'BUSINESS'
        SOCIETY = 'society', 'SOCIETY'
        SPORTS = 'sports', 'SPORTS'
        SCIENCE = 'science', 'SCIENCE'

    id = models.CharField(primary_key=True, max_length=36,
                          default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=225, unique=True)
    slug = models.SlugField(max_length=250, null=True, blank=True)
    subtitle = models.CharField(max_length=300, null=True, blank=True)
    cover_image = models.ImageField(
        upload_to=upload_to_path, max_length=200, blank=True, null=True)
    content = models.TextField()
    category = models.CharField(
        max_length=20, choices=Category.choices, blank=False, null=False)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.DRAFT)
    applaud_count = models.PositiveIntegerField(default=0)
    author = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name='blog_posts')

    def save(self, *args, **kwargs) -> None:
        self.slug = slugify(self.title)

        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.title


@receiver(post_delete, sender=Blog)
def delete_cover_image(sender, instance, **kwargs):
    if instance.cover_image:
        instance.cover_image.delete(save=False)


class Comment(models.Model):

    class Meta:
        ordering = ('-created_at',)

    id = models.CharField(primary_key=True, max_length=36,
                          default=uuid.uuid4, editable=False)
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    blog = models.ForeignKey(
        Blog, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name='comments')

    def __str__(self) -> str:
        return f'{self.blog}-{self.user}'


class Applaud(models.Model):

    blog = models.ForeignKey(
        Blog, on_delete=models.CASCADE, related_name='applauds')
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name='applauds')

    def __str__(self) -> str:
        return f'{self.blog}-{self.user}'


class ReadingList(models.Model):

    class Meta:
        ordering = ('-date_added',)

    blog = models.ForeignKey(
        Blog, on_delete=models.CASCADE, related_name='reading_list')
    user = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name='reading_list')
    date_added = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f'{self.blog}-{self.user}'
