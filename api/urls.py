from django.conf.urls import url
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from . import views
from judge import views as judge_view

router = DefaultRouter()
router.register(r'contests', views.ContestViewSet, 'contests')
router.register(r'problems/(?P<problem_id>\d+)/comments', views.CommentViewSet, 'problem comments')
router.register(r'problems', views.ProblemViewSet, 'problems')
router.register(r'submissions', views.SubmissionViewSet, 'submissions')
router.register(r'tutorials', views.TutorialViewSet, 'tutorials')
router.register(r'test-cases', views.TestCaseViewSet, 'test_cases')
router.register(r'users', views.UserViewSet, 'users')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.get_full_name() or user.username
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


urlpatterns = [
    path('auth/jwt/create/', MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    url(r'^auth/', include('djoser.urls')),
    url(r'^auth/', include('djoser.urls.jwt')),
    url(r'^auth/', include('djoser.social.urls')),
    path('', include(router.urls)),
    path('standing/<contest_id>', judge_view.standing),
]
