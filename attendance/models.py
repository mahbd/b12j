from django.db import models
from django.utils import timezone
from rest_framework import serializers

from user.models import Student


class Subject(models.Model):
    name = models.CharField(max_length=250)
    teacher = models.CharField(max_length=250, blank=True, null=True)


class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    timestamp = models.DateField(default=timezone.now)


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        models = Attendance
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
