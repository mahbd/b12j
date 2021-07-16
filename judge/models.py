from datetime import datetime

from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from users.models import User


def validate_past(start_time: datetime):
    if start_time <= datetime.now(tz=start_time.tzinfo):
        raise ValidationError("Shouldn't start in past")


class ContestProblem(models.Model):
    contest = models.ForeignKey('Contest', on_delete=models.CASCADE)
    problem = models.ForeignKey('Problem', on_delete=models.CASCADE)
    problem_char = models.CharField(default='A', max_length=3)


class Contest(models.Model):
    writers = models.ManyToManyField(User, related_name='contest_host_user')
    testers = models.ManyToManyField(User)
    title = models.CharField(max_length=100, unique=True)
    text = models.TextField(blank=True, null=True)
    problems = models.ManyToManyField('Problem', through=ContestProblem)
    start_time = models.DateTimeField(validators=[validate_past])
    end_time = models.DateTimeField(validators=[validate_past])
    date = models.DateTimeField(default=timezone.now, editable=False)

    def clean(self, *args, **kwargs):
        if self.start_time >= self.end_time:
            raise ValidationError("Shouldn't start before end")

    def save(self, *args, **kwargs):
        self.full_clean()
        super(Contest, self).save(*args, **kwargs)

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return self.title


class Problem(models.Model):
    by = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
    title = models.CharField(max_length=100, unique=True)
    text = models.TextField()
    inTerms = models.TextField()
    outTerms = models.TextField()
    corCode = models.TextField()
    checker = models.TextField(null=True, blank=True)
    time_limit = models.IntegerField(default=1)
    memory_limit = models.IntegerField(default=256)
    difficulty = models.IntegerField(default=1500)
    examples = models.IntegerField(default=1)
    notice = models.TextField(blank=True, null=True)
    date = models.DateTimeField(default=timezone.now, editable=False)

    def lone_problem(self) -> bool:
        if self.contestproblem_set.all():
            return False
        return True

    class Meta:
        ordering = ['difficulty', '-date']

    def __str__(self):
        return self.title


class ProblemDiscussion(models.Model):
    by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    parent = models.ForeignKey('ProblemDiscussion', blank=True, null=True, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.text[:20]

    class Meta:
        ordering = ['date']


class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    inputs = models.TextField()
    output = models.TextField(blank=True, null=True)
    date = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f'problem: {self.problem.title} input: {self.inputs[:10]}'


class Submission(models.Model):
    by = models.ForeignKey(User, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, null=True, on_delete=models.SET_NULL)
    code = models.TextField()
    language = models.CharField(max_length=10, choices=(('python', 'Python3'), ('c_cpp', 'C/C++')))
    verdict = models.CharField(max_length=5, default='PJ')
    details = models.TextField(blank=True, null=True)
    date = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'by: {self.by.username}\tverdict: {self.verdict}\tproblem:{self.problem.title}'


class Tutorial(models.Model):
    by = models.ForeignKey(User, on_delete=models.CASCADE)
    tags = ArrayField(models.CharField(max_length=31, blank=True, null=True), blank=True, null=True)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, blank=True, null=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=100)
    text = models.TextField()
    hidden_till = models.DateTimeField(default=timezone.now)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title


class TutorialDiscussion(models.Model):
    by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    tutorial = models.ForeignKey(Problem, on_delete=models.CASCADE)
    parent = models.ForeignKey('TutorialDiscussion', blank=True, null=True, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField(default=timezone.now)


class JudgeQueue(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE)
