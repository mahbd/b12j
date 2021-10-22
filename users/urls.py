from django.urls import path

from . import views

urlpatterns = [
    path('activate/<str:uid>/<str:token>/', views.activate_user),
    path('login/', views.login_google),
    path('check/', views.sql_check),
]
