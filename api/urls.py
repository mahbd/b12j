from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from judge import views as judge_view
from . import views

router = DefaultRouter()
router.register(r'contests', views.ContestViewSet, 'contests')
router.register(r'problems/(?P<problem_id>\d+)/comments', views.CommentViewSet, 'problem comments')
router.register(r'problems', views.ProblemViewSet, 'problems')
router.register(r'submissions', views.SubmissionViewSet, 'submissions')
router.register(r'tutorials', views.TutorialViewSet, 'tutorials')
router.register(r'test-cases', views.TestCaseViewSet, 'test_cases')
router.register(r'users', views.UserViewSet, 'users')

urlpatterns = [
    path("auth/o/complete/<str:provider>/", views.CompleteView.as_view(), name="complete"),
    path('auth/jwt/create/', views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    url(r'^auth/', include('djoser.urls')),
    url(r'^auth/', include('djoser.urls.jwt')),
    url(r'^auth/', include('djoser.social.urls')),
    path('', include(router.urls)),
    path('standing/<contest_id>', judge_view.standing),
]
