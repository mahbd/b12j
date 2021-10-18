from django.contrib import admin
from .models import Contest, ContestProblem, Problem, Comment, Submission, TestCase, Tutorial
from .views import judge_submission, generate_output


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    search_fields = ['text', 'problem__title', 'tutorial__title', 'user__first_name', 'user__last_name', ]
    list_display = ['text2', 'created_at', 'user', 'problem']

    def text2(self, comment: Comment):
        return comment.text[:75]


@admin.register(ContestProblem)
class ContestProblemAdmin(admin.ModelAdmin):
    list_editable = ['problem_char']
    autocomplete_fields = ['contest', 'problem']
    search_fields = ['contest__title', 'problem__title']
    list_display = ['contest', 'problem', 'problem_char']
    list_per_page = 10


@admin.register(Contest)
class ContestAdmin(admin.ModelAdmin):
    autocomplete_fields = ['user', 'writers', 'testers']
    search_fields = ['title', 'description', 'hosts__first_name', 'hosts__last_name']
    list_display = ['id', 'title', 'start_time', 'end_time', 'user']
    list_per_page = 10


@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    autocomplete_fields = ['user']
    search_fields = ['title', 'contest__title', 'user__first_name', 'user__last_name', 'text']
    list_display = ['title', 'desc', 'difficulty', 'created_at']
    list_per_page = 10

    def desc(self, problem: Problem) -> str:
        return problem.description[:30]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    actions = ['rejudge_submissions']
    list_filter = ['problem', 'contest']
    search_fields = ['problem__title', 'contest__title', 'user__first_name', 'user__last_name', 'user_username']
    list_display = ['id', 'user', "contest", 'problem', 'language', 'verdict', 'details2', 'created_at']
    list_per_page = 20

    def details2(self, submission: Submission):
        return str(submission.details)[:50]

    @admin.action(description="Rejudge submissions")
    def rejudge_submissions(self, request, queryset):
        for submission in queryset:
            judge_submission(submission, True)
        self.message_user(request, f'{queryset.count()} rejudged successfully.')


@admin.register(TestCase)
class TestCaseAdmin(admin.ModelAdmin):
    actions = ['regenerate_output']
    autocomplete_fields = ['user', 'problem']
    search_fields = ['problem__title', 'inputs', 'output']
    list_filter = ['problem', 'user']
    list_display = ['id', 'problem', 'user', 'created_at', 'input2', 'output2']
    list_per_page = 20

    @admin.action(description="Regenerate output")
    def regenerate_output(self, request, queryset):
        for test_case in queryset:
            generate_output(test_case, True)
        self.message_user(request, f'{queryset.count()} regenerated successfully.')

    def input2(self, test_case: TestCase):
        return test_case.inputs[:75]

    def output2(self, test_case: TestCase):
        return test_case.output[:75]


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    search_fields = ['title', 'text']
    list_display = ['id', 'title', 'created_at']
    autocomplete_fields = ['user']
    list_per_page = 10
