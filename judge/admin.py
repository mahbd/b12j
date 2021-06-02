from django.contrib import admin
from .models import Contest, ContestProblem, Problem, ProblemDiscussion, Submission, TestCase, Tutorial, \
    TutorialDiscussion


@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    search_fields = ['title', 'hosts__first_name', 'hosts__last_name']
    list_display = ['title', 'start_time', 'end_time']


@admin.register(ContestProblem)
class ContestProblemAdmin(admin.ModelAdmin):
    list_display = ['contest_id', 'problem_id', 'problem_char']


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    search_fields = ['title', 'contest__title', 'by__first_name', 'by__last_name', 'text']
    list_display = ['title', 'date']


@admin.register(ProblemDiscussion)
class ProblemDiscussionAdmin(admin.ModelAdmin):
    search_fields = ['by__first_name', 'by__last_name', 'problem_title']
    list_display = ['text', 'date', 'by', 'problem']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    search_fields = ['problem__title', 'contest__title', 'by__first_name', 'by__last_name']


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    pass


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    pass


@admin.register(TutorialDiscussion)
class TutorialDiscussionAdmin(admin.ModelAdmin):
    pass
