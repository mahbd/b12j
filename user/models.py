import bson
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from djongo import models
from rest_framework import serializers


def get_random_id():
    id2 = bson.objectid.ObjectId()
    return str(id2)[10:]


class UserGroup(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    name = models.CharField(max_length=100)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name


class User(AbstractUser):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    picture = models.URLField(blank=True, null=True)
    cf_handle = models.CharField(max_length=100, blank=True, null=True)
    batch = models.IntegerField(default=0)
    groups = models.ManyToManyField(UserGroup)
    is_admin = models.BooleanField(
        'staff status',
        default=False,
        help_text='Designates whether the user can log into custom admin site.',
    )

    def __str__(self):
        return f"{self.get_full_name()} {self.email}"


class Student(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=250)
    roll = models.CharField(max_length=250)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'
