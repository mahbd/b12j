from django.contrib import admin
from .models import Contest, ContestProblem, Problem, Comment, Submission, TestCase, Tutorial


@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    search_fields = ['title', 'hosts__first_name', 'hosts__last_name']
    list_display = ['title', 'start_time', 'end_time']


@admin.register(ContestProblem)
class ContestProblemAdmin(admin.ModelAdmin):
    list_display = ['contest_id', 'problem_id', 'problem_char']


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    search_fields = ['title', 'contest__title', 'user__first_name', 'user__last_name', 'text']
    list_display = ['title', 'created_at']


@admin.register(Comment)
class ProblemDiscussionAdmin(admin.ModelAdmin):
    search_fields = ['user__first_name', 'user__last_name', 'problem_title']
    list_display = ['text', 'created_at', 'user', 'problem']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    search_fields = ['problem__title', 'contest__title', 'user__first_name', 'user__last_name', 'user_username']
    list_display = ['id', 'user', "contest", 'language', 'verdict', 'details2', 'created_at']

    def details2(self, submission: Submission):
        return str(submission.details)[:75]


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    list_display = ['problem', 'user', 'created_at', 'input2', 'output2']

    def input2(self, test_case: TestCase):
        return test_case.inputs[:75]

    def output2(self, test_case: TestCase):
        return test_case.output[:75]


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    pass
