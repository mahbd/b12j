from django.urls import path

from . import views, restore

app_name = 'judge'

urlpatterns = [
    path('rejudge/<int:sub_id>/', views.rejudge, name='rejudge'),
    # path('problem/<str:problem_id>', views.show_problem, name='show_problem'),
    # path('add_problem/<str:contest_id>', views.add_problem, name='add_problem'),
    # path('add_tc/<str:problem_id>', views.add_test_case, name='add_tc'),
    # path('add_tc_python/<str:problem_id>', views.add_test_case, name='add_tc_python'),
    #
    # path('old_contests/', restore.contests_from_old_handle),
    # path('old_problems/', restore.problem_from_old_handle),
    # path('old_submissions/', restore.submission_from_old_handle),
    # path('old_test_case/', restore.test_case_from_old_handle),
]
