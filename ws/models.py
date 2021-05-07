from django.db import models
from django.utils import timezone

from users.models import User


class ActiveChannels(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    room_name = models.TextField()
    channel_name = models.TextField()
    time = models.DateTimeField(default=timezone.now)
