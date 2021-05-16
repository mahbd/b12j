from datetime import timedelta, datetime

from django.apps.registry import apps
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils import timezone

from b12j.settings import EMAIL_HOST_USER


class UserManagerCustom(UserManager):
    def _create_user(self, username, email, password, **extra_fields):
        email = self.normalize_email(email)
        if not email:
            raise ValueError('The given email must be set')
        if User.objects.filter(email=email).exists():
            raise ValueError('Email must be unique')
        if not username:
            raise ValueError('The given username must be set')
        # noinspection PyPep8Naming,PyProtectedMember
        GlobalUserModel = apps.get_model(self.model._meta.app_label, self.model._meta.object_name)
        username = GlobalUserModel.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.password = make_password(password)
        # user.is_active = False
        user.save(using=self._db)
        # Verify Email
        # token = self.make_random_password(6, '123467890')
        # UserToken.objects.create(user=user, token=token)
        # text = f'Please verify your email. Your token is: {token}'
        # user.email_user('Confirm Your email', text, EMAIL_HOST_USER)

        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    email = models.EmailField('email address', unique=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username or self.email}"

    objects = UserManagerCustom()


def expire_date():
    return datetime.now() + timedelta(days=1)


class UserToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=20)
    expire = models.DateTimeField(default=expire_date)
