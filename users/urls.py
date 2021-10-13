from django.contrib.auth import views as auth_view
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from . import views

urlpatterns = [
    path('activate/<str:uid>/<str:token>/', views.activate_user),
    path('create-user-unsafe/', csrf_exempt(views.create_user)),
    path('verify-email/<str:token>/', views.verify_email),
    path('password_change/', auth_view.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_view.PasswordChangeDoneView.as_view(), name='password_change_done'),
    path('password_reset/', auth_view.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_view.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_view.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_view.PasswordResetCompleteView.as_view(), name='password_reset_complete')
]
