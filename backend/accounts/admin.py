from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_staff', 'is_active',)
    search_fields = ['id', 'username', 'email']
    list_filter = ['is_staff', 'is_active']
    ordering = ['-date_joined']
