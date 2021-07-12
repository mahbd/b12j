import json
import string
from datetime import timedelta
from random import choices, randint

from django.core.serializers import serialize
from django.db.models import Q
from django.http import JsonResponse, QueryDict
from django.shortcuts import get_object_or_404
from django.contrib.auth import login
from django.utils import timezone
from django.utils.crypto import get_random_string

from b12j.settings import EMAIL_HOST_USER
from extra import jwt_writer
from google_auth_helper import verify_token
from .backends import is_valid_jwt_header
from .models import User, UserToken


def email_verification(user: User, host):
    token = ''.join(choices(string.ascii_letters, k=15))
    UserToken.objects.create(user=user, token=token)
    text = f'Please verify your email here. {host}/users/verify-email/{token}'
    user.email_user('Confirm Your email', text, EMAIL_HOST_USER)


def serialize_user(user: User):
    data = {
        'email': user.email,
        'expire': str(timezone.now() + timedelta(days=7)),
        'first_name': user.first_name,
        'full_name': user.get_full_name() or user.username,
        'id': user.id,
        'is_active': user.is_active,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'last_name': user.last_name,
        'username': user.username,
    }
    jwt_str = jwt_writer(**data)
    return jwt_str


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


def login_user(request):
    try:
        client_data = json.loads(request.body)
    except json.JSONDecodeError:
        post = dict(request.POST)
        if post.get('username') or post.get('email') or post.get('idToken'):
            client_data = {
                'email': post.get('email')[0] if type(post.get('email')) == list else post.get('email'),
                'username': post.get('username')[0] if type(post.get('username')) == list else post.get('username'),
                'password': post.get('password')[0] if type(post.get('password')) == list else post.get('password'),
                'idToken': post.get('idToken')[0] if type(post.get('idToken')) == list else post.get('idToken'),
            }
        else:
            return JsonResponse({"errors": "No data provided"}, status=400)
    user = login_user_local(request, client_data)
    if not user and client_data.get('idToken'):
        id_token = client_data.get('idToken')
        payload = verify_token(id_token)
        if payload is None:
            return JsonResponse({"errors": "Couldn't verify idToken"}, status=400)
        if not payload['email_verified']:
            return JsonResponse({"errors": "Please verify email"})
        user = login_google_auth_response(payload)
    if not user:
        return JsonResponse({"errors": "Couldn't login"}, status=400)
    jwt_str = serialize_user(user)
    return JsonResponse({"jwt": jwt_str})


def login_check(request):
    user = is_valid_jwt_header(request)
    if user:
        user.last_login = timezone.now()
        user.save()
        logged = True
    else:
        logged = False
    return JsonResponse({"status": logged})
