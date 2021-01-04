from django.contrib import admin
from .models import User, UserGroup


admin.site.register(UserGroup)
admin.site.register(User)
