from django.contrib import admin

from .models import Applaud, Blog, Comment, ReadingList


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'slug',
                    'category', 'created_at', 'status', 'author']
    search_fields = ['id', 'title', 'slug', 'author']
    list_filter = ['category', 'status']
    ordering = ['-created_at']


@admin.register(Applaud)
class ApplaudAdmin(admin.ModelAdmin):
    list_display = ['blog', 'user']
    search_fields = ['blog', 'user']


@admin.register(ReadingList)
class ReadingListAdmin(admin.ModelAdmin):
    list_display = ['blog', 'user']
    search_fields = ['blog', 'user']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['blog', 'user']
    search_fields = ['blog', 'user']
    ordering = ['-created_at']
