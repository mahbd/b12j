import datetime

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from users.models import User


def validate_time(time: datetime.datetime):
    if timezone.now().timestamp() - time.timestamp() > 30:
        raise ValidationError("Time is in past")
    if time > timezone.now():
        raise ValidationError("Time is in future")


class ActiveChannel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    channel_name = models.TextField()
    time = models.DateTimeField(default=timezone.now, validators=[validate_time])

    def too_old(self) -> bool:
        return self.time + datetime.timedelta(days=2) < timezone.now()
