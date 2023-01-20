from datetime import datetime

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from users.models import User


LANGUAGE_PYTHON = 'python'
LANGUAGE_CPP = 'c_cpp'
LANGUAGE_CHOICES = (
    (LANGUAGE_CPP, 'C/C++'),
    (LANGUAGE_PYTHON, 'Python')
)


def validate_past(start_time: datetime):
    if start_time <= datetime.now(tz=start_time.tzinfo):
        raise ValidationError("Shouldn't start in past")


class ContestProblem(models.Model):
    contest = models.ForeignKey('Contest', on_delete=models.CASCADE)
    problem = models.ForeignKey('Problem', on_delete=models.CASCADE)
    problem_char = models.CharField(default='A', max_length=3)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ('problem_char', )


# TODO: Start and end time validator
class Contest(models.Model):
    description = models.TextField(blank=True, null=True)
    end_time = models.DateTimeField(default=timezone.now)
    problems = models.ManyToManyField('Problem', through=ContestProblem)
    start_time = models.DateTimeField(default=timezone.now)
    testers = models.ManyToManyField(User, related_name='contest_tester_set')
    title = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    writers = models.ManyToManyField(User, related_name='contest_writer_set')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return self.title


class Problem(models.Model):
    checker_function = models.TextField(null=True, blank=True)
    checker_func_lang = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, null=True, blank=True)
    correct_code = models.TextField(blank=True, null=True)
    correct_lang = models.CharField(max_length=20, choices=LANGUAGE_CHOICES, blank=True, null=True)
    description = models.TextField()
    difficulty = models.IntegerField(default=1500)
    example_number = models.IntegerField(default=1)
    hidden_till = models.DateTimeField(default=timezone.now)
    input_terms = models.TextField()
    memory_limit = models.IntegerField(default=256)
    notice = models.TextField(blank=True, null=True)
    output_terms = models.TextField()
    time_limit = models.IntegerField(default=1)
    title = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(default=timezone.now)

    def is_hidden(self) -> bool:
        all_contest_completed = True
        for contest in self.contest_set.all():
            if contest.end_time > timezone.now():
                all_contest_completed = False
                break
        return not all_contest_completed and self.hidden_till > timezone.now()

    def is_unused(self) -> bool:
        if self.contestproblem_set.all():
            return False
        return True

    class Meta:
        ordering = ['difficulty', '-created_at']

    def __str__(self):
        return self.title


class Comment(models.Model):
    parent = models.ForeignKey('Comment', on_delete=models.CASCADE, blank=True, null=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, blank=True, null=True)
    text = models.TextField()
    tutorial = models.ForeignKey('Tutorial', on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.text[:20]

    class Meta:
        ordering = ('-created_at', )


class TestCase(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    inputs = models.TextField()
    output = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'input: {self.inputs[:10]}, created_at: {self.created_at}'

    class Meta:
        ordering = ('created_at', )


class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, null=True, on_delete=models.SET_NULL)
    code = models.TextField()
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    verdict = models.CharField(max_length=5, default='PJ')
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'by: {self.user.username}\tverdict: {self.verdict}\tproblem:{self.problem.title}'

    class Meta:
        ordering = ('-created_at', )


class Tutorial(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, blank=True, null=True)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=100)
    text = models.TextField()
    hidden_till = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('-created_at', )
