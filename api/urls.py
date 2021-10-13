from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from judge import views as judge_view

router = DefaultRouter()
router.register(r'contests', views.ContestViewSet, 'contests')
router.register(r'problems/(?P<problem_id>\d+)/comments', views.CommentViewSet, 'problem comments')
router.register(r'problems', views.ProblemViewSet, 'problems')
router.register(r'submissions', views.SubmissionViewSet, 'submissions')
router.register(r'tutorials', views.TutorialViewSet, 'tutorials')
router.register(r'test_cases', views.TestCaseViewSet, 'test_cases')
router.register(r'users', views.UserViewSet, 'users')

urlpatterns = [
    path('', include(router.urls)),
    path('standing/<contest_id>', judge_view.standing),
]
