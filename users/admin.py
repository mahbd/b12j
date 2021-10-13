from django.contrib import admin
from .models import User, UserToken


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'email']


@admin.register(UserToken)
class TokenAdmin(admin.ModelAdmin):
    pass
