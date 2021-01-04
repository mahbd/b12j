from django.contrib import admin
from .models import Contest, Problem, ProblemComment, Submission, TestCase, TutorialTopic, Tutorial, TutorialComment


class ContestAdmin(admin.ModelAdmin):
    search_fields = ['title', 'hosts__first_name', 'hosts__last_name', 'group__name']
    list_display = ['title', 'start_time', 'end_time']


class ProblemAdmin(admin.ModelAdmin):
    search_fields = ['title', 'contest__title', 'by__first_name', 'by__last_name', 'text']
    list_display = ['title', 'date', 'group']


class ProblemCommentAdmin(admin.ModelAdmin):
    search_fields = ['by__first_name', 'by__last_name', 'problem_title']
    list_display = ['text', 'date', 'by', 'problem']


class SubmissionAdmin(admin.ModelAdmin):
    search_fields = ['problem__title', 'contest__title', 'by__first_name', 'by__last_name']


admin.site.register(Contest, ContestAdmin)
admin.site.register(Problem, ProblemAdmin)
admin.site.register(ProblemComment, ProblemCommentAdmin)
admin.site.register(Submission, SubmissionAdmin)
admin.site.register(TestCase)
admin.site.register(Tutorial)
admin.site.register(TutorialComment)
admin.site.register(TutorialTopic)
