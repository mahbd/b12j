from datetime import timedelta, datetime

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField('email address', unique=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username or self.email}"


def expire_date():
    return datetime.now() + timedelta(days=1)


class UserToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=20)
    expire = models.DateTimeField(default=expire_date)
