from django.contrib import admin
from .models import ActiveChannel


@admin.register(ActiveChannel)
class ActiveChannelAdmin(admin.ModelAdmin):
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    list_display = ['user', 'channel_name', 'time']
