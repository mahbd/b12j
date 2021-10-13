import json
import string
from random import choices, randint

from django.contrib.auth import login
from django.db.models import Q
from django.http import JsonResponse, QueryDict, HttpResponse
from django.shortcuts import get_object_or_404
from django.test import Client
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string

from b12j.settings import EMAIL_HOST_USER
from .backends import is_valid_jwt_header
from .models import User, UserToken


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


def login_google_auth_response(payload: dict):
    name = payload.get('name')
    email = payload.get('email')
    username = payload.get('user_id')
    # Login users
    if User.objects.filter(username=username):
        return User.objects.get(username=username)
    if User.objects.filter(email=email):
        return User.objects.get(email=email)
    # Register users
    name_array = name.split(' ')
    if len(name_array) > 2:
        if len(name_array[0]) >= 4:
            first_name = ' '.join(name_array[:2])
            last_name = ' '.join(name_array[2:])
        else:
            first_name = name_array[0]
            last_name = name_array[1:]
    else:
        first_name = name_array[0]
        last_name = '' if len(name_array) < 2 else name_array[1]
    return User.objects.create_user(username=username, email=email, password=str(randint(100000, 999999)),
                                    first_name=first_name, last_name=last_name)


def verify_email(request, token):
    token_obj = get_object_or_404(UserToken, token=token)
    token_obj.user.is_active = True
    token_obj.user.save()
    return JsonResponse({'verified': True})


def login_user_local(request, client_data):
    username = client_data.get('username')
    email = client_data.get('email')
    try:
        user = User.objects.get(Q(username=username) | Q(email=email))
    except User.DoesNotExist:
        return None
    if not user.check_password(client_data.get('password')):
        return None
    login(request, user)
    return user


def login_check(request):
    user = is_valid_jwt_header(request)
    if user:
        user.last_login = timezone.now()
        user.save()
        logged = True
    else:
        logged = False
    return JsonResponse({"status": logged})


def activate_user(request, uid, token):
    c = Client()
    response = c.post(reverse('user-activation'), data={'uid': uid, 'token': token})
    if response.status_code == 204:
        return HttpResponse("Your account activated successfully")
    print(response.content)
    return HttpResponse("Failed to activate your account. Try again later.")
