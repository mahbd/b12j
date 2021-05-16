from django.db import models
from django.utils import timezone

from users.models import User


class ActiveChannel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    channel_name = models.TextField()
    time = models.DateTimeField(default=timezone.now)
