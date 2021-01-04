from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework.authentication import TokenAuthentication

from extra import validate_jwt, get_user_for_ws_jwt, jwt_reader

UserModel = get_user_model()


def is_valid_jwt_header(request):
    if request.headers.get('x-auth-token', False):
        jwt_str = request.headers['x-auth-token']
        return validate_jwt(jwt_str)


class RestBackendWithJWT(TokenAuthentication):
    def authenticate(self, request):
        user = is_valid_jwt_header(request)
        return user, None


class ModelBackendWithJWT(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if request.headers.get('x-auth-token', False):
            if is_valid_jwt_header(request):
                return is_valid_jwt_header(request)
        if username is None or password is None:
            return
        try:
            user = UserModel.objects.get(username=username)
        except UserModel.DoesNotExist:
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user


class QueryAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        params = dict(x.split('=') for x in str(scope["query_string"])[2:-1].split('&'))
        scope['user'] = await get_user_for_ws_jwt(params)

        return await self.app(scope, receive, send)
