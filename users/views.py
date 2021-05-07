import json
import string
from random import choices

from django.db.models import Q
from django.http import JsonResponse, QueryDict
from django.shortcuts import get_object_or_404
from django.contrib.auth import login
from django.utils.crypto import get_random_string

from b12j.settings import EMAIL_HOST_USER
from users.models import User, UserToken


def email_verification(user: User, host):
    token = ''.join(choices(string.ascii_letters, k=15))
    UserToken.objects.create(user=user, token=token)
    text = f'Please verify your email here. {host}/users/verify-email/{token}'
    user.email_user('Confirm Your email', text, EMAIL_HOST_USER)


def create_user(request):
    try:
        info = json.loads(request.body)
    except json.JSONDecodeError:
        info = QueryDict()
        pass
    if not info:
        info: QueryDict = request.POST
    try:
        username, password, email = info.get('username'), info.get('password'), info.get('email')
        if not username:
            username = get_random_string(10, string.ascii_letters)
        User.objects.create_user(username=username, email=email, password=password)
    except Exception as E:
        return JsonResponse({'created': False, 'reason': E.args}, status=400)
    return JsonResponse({'created': True}, status=201)


def verify_email(request, token):
    token_obj = get_object_or_404(UserToken, token=token)
    token_obj.user.is_active = True
    token_obj.user.save()
    return JsonResponse({'verified': True})


def login_user(request):
    try:
        client_data = json.loads(request.body)
    except json.JSONDecodeError:
        client_data = request.POST
    username = client_data.get('username')
    email = client_data.get('email')
    try:
        user = User.objects.get(Q(username=username) | Q(email=email))
    except User.DoesNotExist:
        return JsonResponse({'message': f'Wrong data, Username: {username}, Email: {email}'}, status=400)
    if not user.check_password(client_data.get('password')):
        return JsonResponse({'message': f'Wrong Password'}, status=400)
    login(request, user)
    return JsonResponse({'success': True}, status=200)
