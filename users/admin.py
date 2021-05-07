from django.contrib import admin
from .models import User, UserToken


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass


@admin.register(UserToken)
class TokenAdmin(admin.ModelAdmin):
    pass
