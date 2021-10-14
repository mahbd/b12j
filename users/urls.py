from django.contrib.auth import views as auth_view
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path('activate/<str:uid>/<str:token>/', views.activate_user),
    path('login/', views.login_google),
    path('check/', views.sql_check),
]
