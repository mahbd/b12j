from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter

from api import views
# from attendance import views as attendance_view
# from users import views as user_view
# from judge import views as judge_view

router = DefaultRouter()
# router.register(r'attendance/', attendance_view.AttendanceViewSet, 'attendance')
router.register(r'contests', views.ContestViewSet, 'contests')
# router.register(r'problems/comments', views.ProblemCommentViewSet, 'problem_comments')
# router.register(r'problems', views.ProblemViewSet, 'problems')
# router.register(r'submissions', views.SubmissionViewSet, 'submissions')
# router.register(r'test_cases', views.TestCaseViewSet, 'test_cases')
# router.register(r'tutorials/comments', views.TutorialCommentViewSet, 'tutorial_comments')
# router.register(r'tutorials', views.TutorialViewSet, 'tutorials')
# router.register(r'students/', user_view.StudentViewSet, 'students')
# router.register(r'users', views.UserViewSet, 'users')

urlpatterns = [
    path('', include(router.urls)),
    # path('standing/<contest_id>', judge_view.standing),
    # path('login/', csrf_exempt(views.verify_login)),
    # path('login_check/', views.is_logged_in),
]
