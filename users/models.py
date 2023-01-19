from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField('email address', unique=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username or self.email}"
