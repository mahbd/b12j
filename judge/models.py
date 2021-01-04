import bson
from django.utils import timezone
from djongo import models
from django.conf import settings


def get_random_id():
    id2 = bson.objectid.ObjectId()
    return str(id2)[10:]


class Contest(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    hosts = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='contest_host_user')
    testers = models.ManyToManyField(settings.AUTH_USER_MODEL)
    title = models.CharField(max_length=100)
    text = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    group = models.ForeignKey(settings.AUTH_USER_GROUP, on_delete=models.CASCADE, default=1)
    date = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ['-start_time']

    def __str__(self):
        return self.title


class Problem(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    text = models.TextField()
    inTerms = models.TextField()
    outTerms = models.TextField()
    corCode = models.TextField()
    time_limit = models.IntegerField(default=1)
    examples = models.IntegerField(default=1)
    notice = models.TextField(blank=True, null=True)
    date = models.DateTimeField(default=timezone.now, editable=False)
    group = models.ForeignKey(settings.AUTH_USER_GROUP, on_delete=models.CASCADE, default=1)
    conProbId = models.CharField(max_length=10, default='A')

    class Meta:
        ordering = ['conProbId', '-date']

    def __str__(self):
        return self.title


class ProblemComment(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    parent = models.ForeignKey('ProblemComment', on_delete=models.CASCADE, blank=True, null=True)
    by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']


class Submission(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    code = models.TextField()
    language = models.CharField(max_length=10, choices=(('python', 'Python3'), ('c_cpp', 'C/C++')))
    verdict = models.CharField(max_length=5, default='PJ')
    details = models.TextField(blank=True, null=True)
    time_code = models.CharField(max_length=2, default='BC',
                                 choices=(('BC', 'BC'), ('DC', 'DC'), ('AC', 'AC')))
    date = models.DateTimeField(default=timezone.now, editable=False)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f'by: {self.by.first_name}\tverdict: {self.verdict}\tproblem:{self.problem.title}'


class TestCase(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    inputs = models.TextField()
    output = models.TextField()
    date = models.DateTimeField(default=timezone.now, editable=False)

    def __str__(self):
        return f'problem: {self.problem.title} input: {self.inputs[:10]}'


class TutorialTopic(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    name = models.CharField(max_length=25)


class Tutorial(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    topic = models.ForeignKey(TutorialTopic, on_delete=models.CASCADE, blank=True, null=True)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, blank=True, null=True)
    title = models.CharField(max_length=100)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title


class TutorialComment(models.Model):
    id = models.CharField(max_length=10, default=get_random_id, primary_key=True, editable=False)
    parent = models.ForeignKey('TutorialComment', on_delete=models.CASCADE, blank=True, null=True)
    tutorial = models.ForeignKey(Tutorial, on_delete=models.CASCADE)
    by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f'{self.tutorial.title} cmt: {self.text[:10]}'
